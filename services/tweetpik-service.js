import axios from "axios";
import config from "../keys";
import download from "image-downloader";
import path from "path";
import { fileURLToPath } from "url";

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

  async downloadImage(url) {
    const __dirname = path.dirname(
      path.dirname(fileURLToPath(import.meta.url))
    );

    const response = await download.image({
      url,
      dest: path.resolve(path.join(__dirname, "temp")),
    });

    console.log(`screenshot downloaded to ${response.filename}`);
  }
}
