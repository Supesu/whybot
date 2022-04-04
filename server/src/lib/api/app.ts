import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import bodyParser from "body-parser";

import routesV1 from "./routes/v1";
import { corsUrl, environment } from "./config";
import { NotFoundError, ApiError, InternalError } from "./core/ApiError";

export const app = express();

app.use(bodyParser.json({ limit: "10mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "10mb",
    extended: true,
    parameterLimit: 50000,
  })
);
app.use(cors({ origin: corsUrl, optionsSuccessStatus: 200 }));

app.use("/api/v1", routesV1);

app.use((_req, _res, next) => next(new NotFoundError()));

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof ApiError) {
    ApiError.handle(err, res);
  } else {
    if (environment === "development") {
      res.status(500).send(err.message);
      return;
    }
    ApiError.handle(new InternalError(), res);
  }
});
