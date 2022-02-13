import config from "./keys";
import Xvfb from "xvfb";
import TweetPikService from "./services/tweetpik-service";
import ImageService from "./services/image-service";
import OpenSeaRobot from "./opensearobot";
import TwitterService from "./services/twitter-service";

function start() {
  console.log("worker dispatching...");
  try {
    const tweetID = "1492597351089045505";
    // console.log(`Now executing job ${tweetID}`);
    // const tweetPikService = new TweetPikService();
    // const imageService = new ImageService();
    // const twitterService = new TwitterService();
    //
    // const originalScreenshot = await tweetPikService.getScreenshot(tweetID);
    //
    // const imageFilePath = await imageService.removeWatermark(
    //   originalScreenshot,
    //   tweetID
    // );
    //
    // const metadata = await twitterService.getMetadata(tweetID);
    //
    // let assetURL;
    //
    if (process.platform !== "win32") {
      const xvfb = new Xvfb();
      xvfb.startSync();
      console.log("xvfb works");
      //   const openSeaRobot = new OpenSeaRobot();
      //   assetURL = await openSeaRobot.run(imageFilePath, metadata);
      xvfb.stopSync();
    } else {
      console.log("platform is windows??????");
      //   const openSeaRobot = new OpenSeaRobot();
      //   assetURL = await openSeaRobot.run(imageFilePath, metadata);
    }
    //
    // await twitterService.addReplyToTweet(tweetID, assetURL);
    //
    console.log(`Job ${tweetID} executed`);
    process.exit(0);
  } catch (e) {
    console.error(`Job failed with error: ${e.message}`);
    process.exit(1);
  }
}

start();
