import { ThreadChannel } from 'discord.js';
import { logger } from '../utils/logger';
import { checkCooldown, setCooldown, isRateLimited } from '../utils/rateLimiter';
import { processUserQuery } from '../ai/responseGenerator';

const THREAD_COOLDOWN = 30000; // 30 seconds cooldown

export async function handleNewThread(thread: ThreadChannel) {
  // Only process threads in channels with the proper naming convention
  if (!thread.name.includes('once-helper-threads')) return;
  
  // Prevent duplicate processing using a cooldown check
  const threadId = thread.id;
  if (await checkCooldown(threadId)) {
    logger.info(`Thread ${threadId} is on cooldown, skipping processing.`);
    return;
  }
  await setCooldown(threadId, THREAD_COOLDOWN);

  // Wait for the initial user question in the thread
  const initialMessage = await thread.fetchStarterMessage();
  if (initialMessage) {
    const userId = initialMessage.author.id;
    // Rate limit check: 5 requests per minute per user
    if (await isRateLimited(userId)) {
      logger.info(`User ${userId} is rate limited.`);
      await thread.send('You are sending requests too quickly. Please slow down.');
      return;
    }
    logger.info(`Processing query in thread ${thread.id}: ${initialMessage.content}`);
    await processUserQuery(thread, initialMessage.content, userId);
  }
}
