import config from "../keys";
import { TwitterApi } from "twitter-api-v2";

export default class TwitterCLIService {
  constructor() {
    this.twitterClient = new TwitterApi({
      appKey: config.TWITTER_CONSUMER_KEY,
      appSecret: config.TWITTER_CONSUMER_SECRET,
      accessToken: config.TWITTER_ACCESS_TOKEN,
      accessSecret: config.TWITTER_ACCESS_TOKEN_SECRET,
    });
    this.actions = {
      GET_WEBHOOKS: "get-webhooks",
      CREATE_WEBHOOK: "create-webhook",
      DELETE_WEBHOOK: "delete-webhook",
      GET_SUBSCRIPTIONS: "get-subscriptions",
      CREATE_SUBSCRIPTION: "create-subscription",
      DELETE_SUBSCRIPTION: "delete-subscription",
    };
  }

  async getWebhooks() {
    const response = await this.twitterClient.v1.get(
      `account_activity/all/webhooks.json`,
      {},
      {
        headers: {
          authorization: `Bearer ${config.TWITTER_BEARER_TOKEN}`,
        },
      }
    );

    return { ...response };
  }

  async createWebhook() {
    const response = await this.twitterClient.v1.post(
      `account_activity/all/${config.TWITTER_WEBHOOK_ENV}/webhooks.json`,
      {},
      { query: { url: config.WEBHOOK_URL } }
    );

    return { ...response };
  }

  async deleteWebhook() {
    const { environments } = await this.getWebhooks();
    const webhookID =
      environments.length > 0 && environments[0]["webhooks"].length > 0
        ? environments[0]["webhooks"][0].id
        : "";

    if (!Boolean(webhookID))
      return { message: "No existing webhooks to delete" };

    const response = await this.twitterClient.v1.delete(
      `account_activity/all/${config.TWITTER_WEBHOOK_ENV}/webhooks/${webhookID}.json`,
      {}
    );

    return { ...response, message: `[${webhookID}] webhook deleted` };
  }

  async getSubscriptions() {
    const response = await this.twitterClient.send({
      method: "GET",
      url: `${config.TWITTER_API_URL}/account_activity/all/${config.TWITTER_WEBHOOK_ENV}/subscriptions/list.json`,
      headers: {
        authorization: `Bearer ${config.TWITTER_BEARER_TOKEN}`,
      },
      enableAuth: false,
    });

    return { ...response.data };
  }

  async createSubscription() {
    const response = await this.twitterClient.v1.post(
      `account_activity/all/${config.TWITTER_WEBHOOK_ENV}/subscriptions.json`,
      {}
    );

    return { ...response, message: "subscription added" };
  }

  async deleteSubscription() {
    const loggedUser = await this.twitterClient.currentUser();

    await this.twitterClient.send({
      method: "DELETE",
      url: `${config.TWITTER_API_URL}/account_activity/all/${config.TWITTER_WEBHOOK_ENV}/subscriptions/${loggedUser.id}.json`,
      headers: {
        authorization: `Bearer ${config.TWITTER_BEARER_TOKEN}`,
      },
      enableAuth: false,
    });

    return { message: `subscription deleted` };
  }
}
