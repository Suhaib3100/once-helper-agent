import { Client, Message, ThreadChannel } from 'discord.js';
import { handleNewThread } from './threadManager';
import { logger } from '../utils/logger';
import { storeFeedback } from '../feedback/feedbackManager';

export function registerEvents(client: Client) {
  // When a new thread is created, process it
  client.on('threadCreate', async (thread) => {
    logger.info(`New thread created: ${thread.name}`);
    await handleNewThread(thread as ThreadChannel);
  });

  // Listen for new messages (for additional processing if needed)
  client.on('messageCreate', async (message: Message) => {
    if (message.author.bot) return;
    if (message.channel.isThread()) {
      if (message.channel.name.includes('once-helper-threads')) {
        logger.info(`User message in thread ${message.channel.id}: ${message.content}`);
      }
    }
  });

  // Listen for reaction events to record feedback
  client.on('messageReactionAdd', async (reaction, user) => {
    if (user.bot) return;
    // Only process reactions on bot messages (answers)
    if (reaction.message.author?.bot) {
      const emoji = reaction.emoji.name;
      if (emoji === '👍' || emoji === '👎') {
        const feedback = {
          threadId: reaction.message.id,
          responseRating: emoji === '👍' ? 'good' : 'bad',
          improvementSuggestions: [] // In production, trigger a modal for suggestions when a 👎 is received.
        };
        storeFeedback(feedback);
        logger.info(`Stored feedback for message ${reaction.message.id}`);
      }
    }
  });
}
