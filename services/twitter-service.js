import config from "../keys";
import { TwitterApi } from "twitter-api-v2";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(timezone);
dayjs.tz.setDefault(config.TIMEZONE);

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
    const tweetDate = dayjs(date).format(
      "[As published on] MMM D, YYYY, h:mm A"
    );
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
      blackBlocks,
      greenBlocks,
      yellowBlocks,
    };
  }

  getTries(tweetText) {
    if (!Boolean(tweetText)) return;

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
    return `# ${tweetText.split("\n")[0]}\n${tweetDate}`;
  }

  async getTweetID() {
    const { screen_name } = await this.twitterClient.currentUser();
    const tweets = await this.twitterClient.v2.search(
      `from:${screen_name} Wordle`
    );

    return tweets.tweets[0].id;
  }
}
