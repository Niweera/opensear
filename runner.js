import Xvfb from "xvfb";
import TweetPikService from "./services/tweetpik-service";
import ImageService from "./services/image-service";
import OpenSeaRobot from "./opensearobot";
import TwitterService from "./services/twitter-service";

const start = async (tweetID) => {
  console.log(`Worker dispatching...`);
  try {
    console.log(`Now executing job ${tweetID}`);
    const tweetPikService = new TweetPikService();
    const imageService = new ImageService();
    const twitterService = new TwitterService();

    const originalScreenshot = await tweetPikService.getScreenshot(tweetID);

    const imageFilePath = await imageService.removeWatermark(
      originalScreenshot,
      tweetID
    );

    // const metadata = await twitterService.getMetadata(tweetID);

    const metadata = {
      name: "wordle 239 4/6 #ghatest4",
      tweetURL: "https://twitter.com/Niweera/status/1492986339381452800",
      description:
        "# Wordle 239 4/6 #ghatest4\nAs published on Feb 14, 2022, 3:47 AM\n\nSigned by [opensearobot](https://opensear.niweera.gq).",
      tries: "4",
      statistics: { blackBlocks: "7", greenBlocks: "7", yellowBlocks: "6" },
    };

    let assetURL;

    if (process.platform !== "win32") {
      const xvfb = new Xvfb();
      xvfb.startSync();
      console.log("xvfb works");
      const openSeaRobot = new OpenSeaRobot();
      assetURL = await openSeaRobot.run(imageFilePath, metadata);
      xvfb.stopSync();
    } else {
      const openSeaRobot = new OpenSeaRobot();
      assetURL = await openSeaRobot.run(imageFilePath, metadata);
    }

    await twitterService.addReplyToTweet(tweetID, assetURL);

    console.log(`Job ${tweetID} executed`);
    process.exit(0);
  } catch (e) {
    console.error(`Job failed with error`);
    console.trace(e);
    process.exit(1);
  }
};

start(process.argv[2].toString()).then();
