import { AuthenticationError } from "../errors";
import config from "../keys";
import crypto from "crypto";

export default class Service {
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
        !tweetCreateEvent ||
        !tweetCreateEvent.text.toLowerCase().includes(config.MAGIC_WORD)
      )
        return {};

      console.log(tweetCreateEvent.id_str);
    }
    return {};
  }
}
