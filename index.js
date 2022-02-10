import express from "express";
import ErrorHandlingMiddleware from "./middleware/error-handling";
import config from "./keys";
import chalk from "chalk";
import Middleware from "./middleware";
import Controller from "./controllers";

const PORT = config.PORT;

const app = express();

Middleware(app);
app.use("", Controller);
ErrorHandlingMiddleware(app);

app.listen(PORT, () => {
  console.log(chalk.blue(`Sever listening on port ${PORT}`));
});

export default app;
