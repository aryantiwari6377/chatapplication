// /**
//  * sqsClient.js
//  * Shared AWS SQS client — reads credentials from .env
//  *
//  * WHAT TO SET IN .env:
//  *   AWS_REGION=ap-south-1          ← same region as your S3 bucket
//  *   AWS_ACCESS_KEY_ID=...          ← IAM key (already set for S3)
//  *   AWS_SECRET_ACCESS_KEY=...      ← IAM secret (already set for S3)
//  *   SQS_QUEUE_URL=https://sqs.ap-south-1.amazonaws.com/YOUR_ACCOUNT_ID/email-queue
//  *
//  * HOW TO CREATE THE QUEUE (do this once in AWS Console):
//  *   1. Go to AWS Console → SQS → Create Queue
//  *   2. Type: Standard Queue
//  *   3. Name: email-queue  (or any name you like)
//  *   4. Leave all defaults, click Create
//  *   5. Copy the Queue URL and paste into SQS_QUEUE_URL in .env
//  *
//  * IAM PERMISSIONS NEEDED (add to your existing IAM user/policy):
//  *   sqs:SendMessage
//  *   sqs:ReceiveMessage
//  *   sqs:DeleteMessage
//  *   sqs:GetQueueAttributes
//  *   on resource: arn:aws:sqs:REGION:ACCOUNT_ID:email-queue
//  */

// import { SQSClient } from '@aws-sdk/client-sqs';
// import dotenv from 'dotenv';
// dotenv.config();

// export const sqsClient = new SQSClient({
//   region: process.env.AWS_REGION || 'ap-south-1',
//   credentials: {
//     accessKeyId:     process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   },
// });

// // Read AFTER dotenv.config() so the value is populated
// export const SQS_QUEUE_URL = process.env.SQS_QUEUE_URL;

// console.log('[SQS Client] Loaded. Region:', process.env.AWS_REGION, 'Queue URL:', process.env.SQS_QUEUE_URL);
