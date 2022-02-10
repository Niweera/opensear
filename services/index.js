import { AuthenticationError } from "../errors";
import config from "../keys";
import crypto from "crypto";
import TweetPikService from "./tweetpik-service";
import ImageService from "./image-service";
import TwitterService from "./twitter-service";

export default class Service {
  constructor() {
    this.tweetPikService = new TweetPikService();
    this.imageService = new ImageService();
    this.twitterService = new TwitterService();
  }

  async getScreenshot() {
    const tweetID = await this.twitterService.getTweetID();
    const originalScreenshot = await this.tweetPikService.getScreenshot(
      tweetID
    );
    const screenshot = await this.imageService.removeWatermark(
      originalScreenshot
    );
    return {
      tweetID,
      screenshot,
    };
  }

  async getMetadata() {
    const tweetID = await this.twitterService.getTweetID();
    const { tweetText, username, tweetDate } =
      await this.twitterService.getTweetByID(tweetID);
    const statistics = this.twitterService.getStatistics(tweetText);
    const tries = this.twitterService.getTries(tweetText);
    const tweetURL = this.twitterService.getURL(username, tweetID);
    const description = this.twitterService.getDescription(
      tweetText,
      tweetDate
    );
    const name = this.twitterService.getTitle(tweetText);
    return {
      name,
      tweetURL,
      description,
      tries,
      statistics,
    };
  }

  getHandler({ crc_token: crcToken }) {
    if (crcToken) {
      return {
        response_token: this.createCrcResponseToken(crcToken),
      };
    } else {
      throw new AuthenticationError("Error: crc_token missing from request.");
    }
  }

  createCrcResponseToken(crcToken) {
    const hmac = crypto
      .createHmac("sha256", config.TWITTER_CONSUMER_SECRET)
      .update(crcToken)
      .digest("base64");

    return `sha256=${hmac}`;
  }

  async postHandler(body) {
    if ("tweet_create_events" in body) {
      const tweetCreateEvent =
        body.tweet_create_events.length > 0 ? body.tweet_create_events[0] : "";

      if (
        !Boolean(tweetCreateEvent) ||
        !tweetCreateEvent.text.toLowerCase().includes(config.MAGIC_WORD)
      )
        return {};

      const originalScreenshot = await this.tweetPikService.getScreenshot(
        tweetCreateEvent.id_str
      );
      const imageBuffer = await this.imageService.removeWatermark(
        originalScreenshot
      );
      console.log(imageBuffer);
    }
    return {};
  }
}
