import { S3Client } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config();

/**
 * WHAT TO CHANGE:
 *  - Set these four environment variables in your backend/.env file:
 *      AWS_REGION=us-east-1                       ← your bucket's region
 *      AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE      ← your IAM access key
 *      AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY  ← your IAM secret key
 *      AWS_S3_BUCKET_NAME=my-chat-app-bucket       ← your S3 bucket name
 *
 *  - Make sure the IAM user/role has these S3 permissions:
 *      s3:PutObject, s3:GetObject on arn:aws:s3:::my-chat-app-bucket/chat-uploads/*
 *
 *  - Set the bucket's CORS policy to allow PUT from your frontend origin.
 */

export const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'REPLACE_WITH_YOUR_ACCESS_KEY_ID',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'REPLACE_WITH_YOUR_SECRET_ACCESS_KEY',
  },
});

export const S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || 'REPLACE_WITH_YOUR_BUCKET_NAME';
