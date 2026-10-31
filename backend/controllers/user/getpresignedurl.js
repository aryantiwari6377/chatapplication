import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { s3Client, S3_BUCKET_NAME } from '../../util/s3.js';

// ─── Allowed MIME types ───────────────────────────────────────────────────────
const ALLOWED_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'audio/webm',
  'audio/mp4',
  'audio/ogg',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
]);

// 10 MB limit
const MAX_SIZE_BYTES = 10 * 1024 * 1024;

// ─── Controller ──────────────────────────────────────────────────────────────
export const getPresignedUrl = async (req, res) => {
  try {
    const { fileName, fileType, fileSize } = req.body;

    // ── Input validation ──────────────────────────────────────────────────────
    if (!fileName || typeof fileName !== 'string') {
      return res.status(400).json({ message: 'fileName is required and must be a string.' });
    }
    if (!fileType || typeof fileType !== 'string') {
      return res.status(400).json({ message: 'fileType is required and must be a string.' });
    }
    if (fileSize === undefined || typeof fileSize !== 'number') {
      return res.status(400).json({ message: 'fileSize is required and must be a number.' });
    }

    // Normalise fileType — strip codec suffix (e.g. "audio/webm;codecs=opus" → "audio/webm")
    const normalizedType = fileType.split(';')[0].trim();

    // Sanitise the original filename — keep only the extension
    const ext = path.extname(fileName).toLowerCase().replace(/[^a-z0-9.]/g, '');

    // Check allowed type — use prefix match for audio (handles codec suffixes like audio/webm;codecs=opus)
    const typeAllowed = ALLOWED_TYPES.has(fileType) || [...ALLOWED_TYPES].some(t => fileType.startsWith(t));
    if (!typeAllowed) {
      return res.status(400).json({ message: `File type "${fileType}" is not allowed.` });
    }
    if (fileSize > MAX_SIZE_BYTES) {
      return res.status(400).json({ message: `File size exceeds the 10 MB limit.` });
    }

    // ── Generate a collision-resistant storage key ────────────────────────────
    const storageKey = `chat-uploads/${uuidv4()}${ext}`;

    // ── Build a presigned PUT URL (expires in 15 minutes) ────────────────────
    const command = new PutObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: storageKey,
      ContentType: normalizedType,
    });

    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 900 });

    // ── Public URL the receiver will use to view the file ────────────────────
    // WHAT TO CHANGE: if your bucket is NOT publicly readable, use presigned
    // GET URLs instead (or CloudFront). For a public bucket this URL works:
    const publicUrl = `https://${S3_BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${storageKey}`;

    return res.status(200).json({ presignedUrl, publicUrl, storageKey });
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    return res.status(500).json({ message: 'Could not generate upload URL. Please try again.' });
  }
};
