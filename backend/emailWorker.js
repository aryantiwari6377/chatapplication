// /**
//  * emailWorker.js
//  * SQS Consumer — polls the email queue and sends emails via nodemailer.
//  *
//  * This runs as part of the same Node process (started from app.js),
//  * so you do NOT need a separate server or deployment.
//  *
//  * Flow:
//  *   1. Poll SQS every 5 seconds (long-polling with WaitTimeSeconds: 5)
//  *   2. For each message: parse JSON, send email via nodemailer
//  *   3. On success: delete the message from SQS (so it isn't retried)
//  *   4. On failure: leave the message in the queue — SQS will redeliver
//  *      it after the visibility timeout (default 30s), up to the queue's
//  *      maxReceiveCount, then it moves to the Dead-Letter Queue if configured.
//  */

// import dotenv from 'dotenv';
// dotenv.config();

// import {
//   ReceiveMessageCommand,
//   DeleteMessageCommand,
// } from '@aws-sdk/client-sqs';
// import { sqsClient, SQS_QUEUE_URL } from './util/sqsClient.js';
// import { getTransporter } from './util/nodemailer.js';

// const POLL_INTERVAL_MS = 5000; // how often to poll when queue is empty
// const MAX_MESSAGES     = 10;   // messages per poll (SQS max is 10)

// const processMessage = async (message) => {
//   let payload;
//   try {
//     payload = JSON.parse(message.Body);
//   } catch {
//     console.error('[Worker] Failed to parse message body:', message.Body);
//     // Bad JSON — delete it so it doesn't block the queue forever
//     await deleteMessage(message.ReceiptHandle);
//     return;
//   }

//   const { to, subject, html } = payload;

//   if (!to || !subject || !html) {
//     console.error('[Worker] Message missing required fields:', payload);
//     await deleteMessage(message.ReceiptHandle);
//     return;
//   }

//   try {
//     await getTransporter().sendMail({
//       from: {
//         name: 'Chat App',
//         address: process.env.GMAIL_USER,
//       },
//       to,
//       subject,
//       html,
//     });

//     console.log(`[Worker] Email sent to ${to}`);
//     await deleteMessage(message.ReceiptHandle);
//   } catch (err) {
//     // Leave message in queue — SQS will redeliver after visibility timeout
//     console.error(`[Worker] Failed to send email to ${to}:`, err.message);
//   }
// };

// const deleteMessage = async (receiptHandle) => {
//   try {
//     await sqsClient.send(new DeleteMessageCommand({
//       QueueUrl:      SQS_QUEUE_URL,
//       ReceiptHandle: receiptHandle,
//     }));
//   } catch (err) {
//     console.error('[Worker] Failed to delete message:', err.message);
//   }
// };

// const poll = async () => {
//   if (!SQS_QUEUE_URL) {
//     console.warn('[Worker] SQS_QUEUE_URL not set — email worker not started.');
//     return;
//   }

//   let messages = [];
//   try {
//     const result = await sqsClient.send(new ReceiveMessageCommand({
//       QueueUrl:            SQS_QUEUE_URL,
//       MaxNumberOfMessages: MAX_MESSAGES,
//       WaitTimeSeconds:     5,   // long-polling — reduces empty-receive costs
//       VisibilityTimeout:   60,  // seconds to hide message while processing
//     }));

//     messages = result.Messages || [];

//     if (messages.length > 0) {
//       console.log(`[Worker] Received ${messages.length} message(s) from SQS`);
//       await Promise.all(messages.map(processMessage));
//     }
//   } catch (err) {
//     console.error('[Worker] SQS poll error:', err.code, '—', err.message);
//     console.error('[Worker] Queue URL being used:', SQS_QUEUE_URL);
//   }

//   // If we got a full batch, poll again immediately — otherwise wait
//   setTimeout(poll, messages.length === MAX_MESSAGES ? 0 : POLL_INTERVAL_MS);
// };

// // Keep a reference to the first scheduled timeout so it can be cleared if needed
// let _started = false;

// export const startEmailWorker = () => {
//   if (_started) return;
//   _started = true;

//   if (!SQS_QUEUE_URL || SQS_QUEUE_URL.includes('YOUR_ACCOUNT_ID')) {
//     console.warn('[Worker] SQS_QUEUE_URL not configured — email worker disabled.');
//     return;
//   }

//   console.log('[Worker] Email worker starting...');
//   console.log('[Worker] Queue URL:', SQS_QUEUE_URL);
//   console.log('[Worker] Region:', process.env.AWS_REGION);
//   poll();
// };
