import TweetPikService from "./tweetpik-service";

test("tweetPikService", async () => {
  const tweetPikService = new TweetPikService();
  await tweetPikService.getScreenshot("1491661057651183617");
}, 60000);
