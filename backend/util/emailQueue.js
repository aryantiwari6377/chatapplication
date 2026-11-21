// /**
//  * emailQueue.js
//  * Producer — sends an email job to the SQS queue.
//  * The actual email is sent by emailWorker.js (the consumer).
//  */

// import { SendMessageCommand } from '@aws-sdk/client-sqs';
// import { sqsClient, SQS_QUEUE_URL } from './sqsClient.js';

// /**
//  * Enqueue an email job.
//  * @param {{ to: string, subject: string, html: string }} payload
//  */
// export const enqueueEmail = async (payload) => {
//   if (!SQS_QUEUE_URL) {
//     throw new Error('SQS_QUEUE_URL is not set in .env');
//   }

//   const command = new SendMessageCommand({
//     QueueUrl:    SQS_QUEUE_URL,
//     MessageBody: JSON.stringify(payload),
//   });

//   const result = await sqsClient.send(command);
//   console.log('[SQS] Message enqueued, MessageId:', result.MessageId);
//   return result;
// };
