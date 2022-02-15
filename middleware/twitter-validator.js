import config from "../keys";
import bodyParser from "body-parser";
import crypto from "crypto";
import { AuthenticationError } from "../errors";

const verifyGetRequest = (req, res, next) => {
  const { crc_token, nonce } = req?.query || {};
  const hmac = crypto
    .createHmac("sha256", config.TWITTER_CONSUMER_SECRET)
    .update(`crc_token=${crc_token}&nonce=${nonce}`)
    .digest("base64");

  if (`sha256=${hmac}` !== req.headers["x-twitter-webhooks-signature"])
    throw new AuthenticationError("Request is not originated from Twitter");

  next();
};

const verifyPostRequest = (req, res, buf, encoding) => {
  const hmac = crypto
    .createHmac("sha256", config.TWITTER_CONSUMER_SECRET)
    .update(buf, encoding)
    .digest("base64");

  if (`sha256=${hmac}` !== req.headers["x-twitter-webhooks-signature"])
    throw new Error("Request is not originated from Twitter");
};

export default (app) => {
  app.get(`/${config.CALLBACK_NONCE}`, verifyGetRequest);
  app.post(
    `/${config.CALLBACK_NONCE}`,
    bodyParser.json({ verify: verifyPostRequest })
  );
};
