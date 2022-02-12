import OpenSeaRobot from "./index";
import TwitterService from "../services/twitter-service";
import path from "path";
import { fileURLToPath } from "url";
import Xvfb from "xvfb";

const headless = async () => {
  const xvfb = new Xvfb();
  xvfb.startSync();
  const tweetID = "1491661057651183617";
  const openSeaRobot = new OpenSeaRobot();
  const twitterService = new TwitterService();
  const metadata = await twitterService.getMetadata(tweetID);
  metadata.name = "wordle osr test #" + new Date().getTime();

  const __dirname = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
  const imageFilePath = path.resolve(
    path.join(__dirname, "temp", `${tweetID}.png`)
  );

  const assetURL = await openSeaRobot.run(imageFilePath, metadata);
  await twitterService.addReplyToTweet(tweetID, assetURL);
  xvfb.stopSync();
};

const headfull = async () => {
  const tweetID = "1491661057651183617";
  const openSeaRobot = new OpenSeaRobot();
  const twitterService = new TwitterService();
  const metadata = await twitterService.getMetadata(tweetID);
  metadata.name = "wordle osr test #" + new Date().getTime();

  const __dirname = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
  const imageFilePath = path.resolve(
    path.join(__dirname, "temp", `${tweetID}.png`)
  );

  const assetURL = await openSeaRobot.run(imageFilePath, metadata);
  await twitterService.addReplyToTweet(tweetID, assetURL);
};

if (process.platform !== "win32") {
  headless().then();
} else {
  headfull().then();
}
