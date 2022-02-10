import dotenv from "dotenv";

dotenv.config();

export default {
  PORT: process.env.PORT,
  TWITTER_BEARER_TOKEN: process.env.TWITTER_BEARER_TOKEN,
  TWITTER_CLIENT_ID: process.env.TWITTER_CLIENT_ID,
  TWITTER_CLIENT_SECRET: process.env.TWITTER_CLIENT_SECRET,
  TWITTER_APP_ID: process.env.TWITTER_APP_ID,
  TWITTER_CONSUMER_KEY: process.env.TWITTER_CONSUMER_KEY,
  TWITTER_CONSUMER_SECRET: process.env.TWITTER_CONSUMER_SECRET,
  TWITTER_ACCESS_TOKEN: process.env.TWITTER_ACCESS_TOKEN,
  TWITTER_ACCESS_TOKEN_SECRET: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  TWITTER_API_URL: process.env.TWITTER_API_URL,
  TWITTER_WEBHOOK_ENV: process.env.TWITTER_WEBHOOK_ENV,
  WEBHOOK_URL: process.env.WEBHOOK_URL,
  MAGIC_WORD: process.env.MAGIC_WORD,
  TWEETPIK_API_KEY: process.env.TWEETPIK_API_KEY,
  TWEETPIK_THEME_ID: process.env.TWEETPIK_THEME_ID,
  TIMEZONE: process.env.TIMEZONE,
  BLACK_BLOCK: "⬛",
  GREEN_BLOCK: "🟩",
  YELLOW_BLOCK: "🟨",
};