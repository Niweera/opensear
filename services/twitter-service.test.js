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

test("twitterService-reply", async () => {
  const tweetID = "1492589622085689346";
  const assetURL =
    "https://opensea.io/assets/matic/0x2953399124f0cbb46d2cbacd8a89cf0599974963/3174924704537354725776608230933781217533108654819823768175757859634024546305";
  const twitterService = new TwitterService();
  await twitterService.addReplyToTweet(tweetID, assetURL);
});
