import config from "../keys";
import { TwitterApi } from "twitter-api-v2";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

export default class TwitterService {
  constructor() {
    this.twitterClient = new TwitterApi({
      appKey: config.TWITTER_CONSUMER_KEY,
      appSecret: config.TWITTER_CONSUMER_SECRET,
      accessToken: config.TWITTER_ACCESS_TOKEN,
      accessSecret: config.TWITTER_ACCESS_TOKEN_SECRET,
    });
  }

  async getTweetByID(tweetID) {
    const tweet = await this.twitterClient.v2.singleTweet(tweetID, {
      expansions: ["author_id"],
      "tweet.fields": ["created_at"],
    });
    const tweetText = tweet?.data?.text || "";
    const username = tweet?.includes?.users[0].username || "";
    const date = tweet?.data?.created_at;
    const tweetDate = dayjs(date)
      .tz("Asia/Colombo")
      .format("[As published on] MMM D, YYYY, h:mm A");
    return {
      tweetText,
      username,
      tweetDate,
    };
  }

  getStatistics(tweetText) {
    const blackRe = new RegExp(config.BLACK_BLOCK, "g");
    const blackBlocks = (tweetText.match(blackRe) || []).length;
    const greenRe = new RegExp(config.GREEN_BLOCK, "g");
    const greenBlocks = (tweetText.match(greenRe) || []).length;
    const yellowRe = new RegExp(config.YELLOW_BLOCK, "g");
    const yellowBlocks = (tweetText.match(yellowRe) || []).length;

    return {
      blackBlocks: blackBlocks.toString(),
      greenBlocks: greenBlocks.toString(),
      yellowBlocks: yellowBlocks.toString(),
    };
  }

  getTries(tweetText) {
    if (!tweetText) return;

    const textSplit = tweetText.split(" ");
    const triesText = textSplit[2];
    return triesText.split("/")[0];
  }

  getURL(username, tweetID) {
    return `https://twitter.com/${username}/status/${tweetID}`;
  }

  getTitle(tweetText) {
    return tweetText.split("\n")[0].toLowerCase();
  }

  getDescription(tweetText, tweetDate) {
    return `# ${
      tweetText.split("\n")[0]
    }\n${tweetDate}\n\nSigned by [opensearobot](https://opensear.niweera.gq).`;
  }

  async getMetadata(tweetID) {
    console.log("Now obtaining the metadata...");
    const { tweetText, username, tweetDate } = await this.getTweetByID(tweetID);
    const statistics = this.getStatistics(tweetText);
    const tries = this.getTries(tweetText);
    const tweetURL = this.getURL(username, tweetID);
    const description = this.getDescription(tweetText, tweetDate);
    const name = this.getTitle(tweetText);
    return {
      name,
      tweetURL,
      description,
      tries,
      statistics,
    };
  }

  async addReplyToTweet(tweetID, assetURL) {
    console.log("Now replying the asset URL to the original tweet...");
    const reply = `☝ This tweet is for sale.\nCheck it out on @opensea marketplace.\n${assetURL}`;
    await this.twitterClient.v2.reply(reply, tweetID);
    console.log(
      `Replied with the asset URL [${assetURL}] to the original tweet [${tweetID}]...`
    );
  }
}
