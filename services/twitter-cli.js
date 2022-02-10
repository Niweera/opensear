import TwitterCLIService from "./twitter-cli-service";
const twitterCLIService = new TwitterCLIService();

(async () => {
  switch (process.argv[2]) {
    case twitterCLIService.actions.GET_WEBHOOKS: {
      const response = await twitterCLIService.getWebhooks();
      console.log(JSON.stringify(response));
      return;
    }
    case twitterCLIService.actions.CREATE_WEBHOOK: {
      const response = await twitterCLIService.createWebhook();
      console.log(JSON.stringify(response));
      return;
    }
    case twitterCLIService.actions.DELETE_WEBHOOK: {
      const response = await twitterCLIService.deleteWebhook();
      console.log(JSON.stringify(response));
      return;
    }
    case twitterCLIService.actions.GET_SUBSCRIPTIONS: {
      const response = await twitterCLIService.getSubscriptions();
      console.log(JSON.stringify(response));
      return;
    }
    case twitterCLIService.actions.CREATE_SUBSCRIPTION: {
      const response = await twitterCLIService.createSubscription();
      console.log(JSON.stringify(response));
      return;
    }
    case twitterCLIService.actions.DELETE_SUBSCRIPTION: {
      const response = await twitterCLIService.deleteSubscription();
      console.log(JSON.stringify(response));
      return;
    }
    default: {
      console.log(
        `the command should be one of ${JSON.stringify(
          Object.values(twitterCLIService.actions)
        )}`
      );
      return;
    }
  }
})();
