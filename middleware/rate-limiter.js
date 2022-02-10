import rateLimit from "express-rate-limit";

export default rateLimit({
  windowMs: 15 * 60 * 1000, // 15 Minutes
  max: 1, // limit each IP to 1 requests per 15 Minutes
  message: {
    message:
      "Too many accounts created from this IP, please try again after 15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
