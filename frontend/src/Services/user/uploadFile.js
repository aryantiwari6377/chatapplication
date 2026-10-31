import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
//const BASE_URL =  'http://localhost:5000/api';

/**
 * uploadFileToS3
 *
 * 1. Asks the backend for a short-lived presigned PUT URL.
 * 2. Uploads the file directly to S3 (no file bytes go through your server).
 * 3. Returns { publicUrl, fileType, fileName } for attaching to a message.
 *
 * @param {File}     file           - The File object from the input element
 * @param {Function} onProgress     - Optional (percent: number) => void callback
 * @returns {Promise<{ publicUrl: string, fileType: string, fileName: string }>}
 */
export const uploadFileToS3 = async (file, onProgress) => {
  if (!file) throw new Error('No file provided.');

  const token = sessionStorage.getItem('token');
  if (!token) throw new Error('Not authenticated.');

  // Strip codec suffix so "audio/webm;codecs=opus" → "audio/webm"
  const normalizedType = file.type.split(';')[0].trim();

  // ── Step 1: request presigned URL from our backend ──────────────────────
  const { data } = await axios.post(
    `${BASE_URL}/get-presigned-url`,
    {
      fileName: file.name,
      fileType: normalizedType,
      fileSize: file.size,
    },
    {
      headers: { Authorization: token },
    }
  );

  const { presignedUrl, publicUrl } = data;

  // ── Step 2: PUT the file directly to S3 ─────────────────────────────────
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
