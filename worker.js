import throng from "throng";
import Queue from "bull";
import config from "./keys";
import Xvfb from "xvfb";
import TweetPikService from "./services/tweetpik-service";
import ImageService from "./services/image-service";
import OpenSeaRobot from "./opensearobot";
import TwitterService from "./services/twitter-service";

function start() {
  console.log("worker dispatching...");
  let workQueue = new Queue(config.REDIS_QUEUE_NAME, config.REDIS_URL);

  workQueue.process(
    config.BULL_PROCESS_NAME,
    config.MAX_JOBS_PER_WORKER,
    async (job, done) => {
      job.progress(0);
      const tweetID = job.id;
      const tweetPikService = new TweetPikService();
      const imageService = new ImageService();
      const twitterService = new TwitterService();

      const originalScreenshot = await tweetPikService.getScreenshot(tweetID);
      job.progress(25);

      const imageFilePath = await imageService.removeWatermark(
        originalScreenshot,
        tweetID
      );
      job.progress(50);

      const metadata = await twitterService.getMetadata();
      job.progress(75);

      const xvfb = new Xvfb();
      xvfb.startSync();
      const openSeaRobot = new OpenSeaRobot();
      await openSeaRobot.run(imageFilePath, metadata);
      xvfb.stopSync();
      job.progress(100);

      done();
    }
  );
}

throng({ workers: config.WEB_CONCURRENCY, start }).then().catch(console.log);
