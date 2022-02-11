import TwitterService from "./twitter-service";

test("twitterService", async () => {
  const tweetID = "1491661057651183617";
  const twitterService = new TwitterService();
  const tweetData = await twitterService.getTweetByID(tweetID);

  console.log(twitterService.getStatistics(tweetData.tweetText));
  console.log(twitterService.getTries(tweetData.tweetText));
  console.log(twitterService.getURL(tweetData.username, tweetID));
  console.log(twitterService.getTitle(tweetData.tweetText));
  console.log(
    twitterService.getDescription(tweetData.tweetText, tweetData.tweetDate)
  );
});
