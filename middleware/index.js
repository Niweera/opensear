import bodyParser from "body-parser";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import TwitterValidator from "./twitter-validator";

const CommonMiddleware = (app) => {
  app.use(bodyParser.json());
  app.use(morgan("dev"));
  app.use(cors());
  app.use(helmet());
};

const Middleware = (app) => {
  TwitterValidator(app);
  CommonMiddleware(app);
};

export default Middleware;
