import axios from "axios";
import config from "../keys";

export default class TweetPikService {
  async getScreenshot(tweetId) {
    const response = await axios.post(
      `https://tweetpik.com/api/images`,
      {
        tweetId,
        themeId: config.TWEETPIK_THEME_ID,
        timezone: config.TIMEZONE,
      },
      {
        headers: {
          "Content-Type": "application/json",
          authorization: config.TWEETPIK_API_KEY,
        },
      }
    );

    return `${response.data.url}?${new Date().getTime()}`;
  }
}
