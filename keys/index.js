import dotenv from "dotenv";

dotenv.config();

export default {
  PORT: process.env.PORT || 8080,
  TWITTER_BEARER_TOKEN: process.env.TWITTER_BEARER_TOKEN,
  TWITTER_CONSUMER_KEY: process.env.TWITTER_CONSUMER_KEY,
  TWITTER_CONSUMER_SECRET: process.env.TWITTER_CONSUMER_SECRET,
  TWITTER_ACCESS_TOKEN: process.env.TWITTER_ACCESS_TOKEN,
  TWITTER_ACCESS_TOKEN_SECRET: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  TWITTER_API_URL: "https://api.twitter.com/1.1",
  TWITTER_WEBHOOK_ENV: "development",
  WEBHOOK_URL: "https://opensear.niweera.gq/callback",
  MAGIC_WORD: "wordle",
  TWEETPIK_API_KEY: process.env.TWEETPIK_API_KEY,
  TWEETPIK_THEME_ID: "323155318417654351",
  BLACK_BLOCK: "⬛",
  GREEN_BLOCK: "🟩",
  YELLOW_BLOCK: "🟨",
  METAMASK_PASSWORD: process.env.METAMASK_PASSWORD,
  METAMASK_MNEMONIC_PHRASE: process.env.METAMASK_MNEMONIC_PHRASE,
  COLLECTION_NAME: "wordle-keeps-sadness-away",
  METAMASK_VERSION: "v10.1.1",
  GH_ACCESS_TOKEN: process.env.GH_ACCESS_TOKEN,
};
