import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import { logger } from '../utils/logger';
import { registerEvents } from './events';
import { initRedis } from '../utils/cache';
import { scheduleDocumentationScraping } from '../scraping/scheduler';
import { runHealthCheck } from '../health/healthCheck';
import { buildVectorStore } from '../embeddings/vectorStore';

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessages,
  ]
});

client.once('ready', async () => {
  logger.info(`Logged in as ${client.user?.tag}`);
  // Initialize Redis, vector store and schedule daily scraping
  initRedis();
  await buildVectorStore();
  scheduleDocumentationScraping();
  runHealthCheck();
});

// Register event handlers
registerEvents(client);

client.login(process.env.DISCORD_TOKEN);
