import bodyParser from "body-parser";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";

const CommonMiddleware = (app) => {
  app.use(bodyParser.json());
  app.use(morgan("dev"));
  app.use(cors());
  app.use(helmet());
};

const Middleware = (app) => {
  CommonMiddleware(app);
};

export default Middleware;
