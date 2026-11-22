import axios from 'axios';
import axiosInstance from '../axiosInstance';

/**
 * uploadFileToS3
 *
 * 1. Asks the backend for a short-lived presigned PUT URL  (uses axiosInstance → auto-auth).
 * 2. Uploads the file directly to S3 with plain axios    (presigned URL — no auth header needed).
 * 3. Returns { publicUrl, fileType, fileName } for attaching to a message.
 */
export const uploadFileToS3 = async (file, onProgress) => {
  if (!file) throw new Error('No file provided.');

  // Strip codec suffix so "audio/webm;codecs=opus" → "audio/webm"
  const normalizedType = file.type.split(';')[0].trim();

  // ── Step 1: request presigned URL from backend (authenticated) ──────────────
  const { data } = await axiosInstance.post('/get-presigned-url', {
    fileName: file.name,
    fileType: normalizedType,
    fileSize: file.size,
  });

  const { presignedUrl, publicUrl } = data;

  // ── Step 2: PUT file directly to S3 (plain axios — no Authorization header) ─
  await axios.put(presignedUrl, file, {
    headers: {
      'Content-Type': normalizedType,
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percent);
      }
    },
  });

  return {
    publicUrl,
    fileType: normalizedType,
    fileName: file.name,
  };
};
