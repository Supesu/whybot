import express from "express";
import { DatabaseClient } from "../../../../../../lib/database";
import { Router } from "../../../../../../lib/twitch";

import {
  BadRequestResponse,
  SuccessResponse,
} from "../../../../core/ApiResponse";
import asyncHandler from "../../../../helpers/asyncHandler";

const router = express.Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const router = req.app.locals.router as Router;
    const database = req.app.locals.database as DatabaseClient;

    const id = req.app.locals.id;
    const uniques = (await router.fetchUniques()).map((u) => u.getConfig());

    const fetched_local_unique = uniques.find((u) => u.id === id);

    if (!fetched_local_unique)
      return new BadRequestResponse("chill combo probably");

    router.unloadUnique(id);
    database.deleteFromColletionWithId("uniques", id);
    const fetched_unique = (await router.fetchUniques())
      .map((u) => u.getConfig())
      .find((u) => u.id === id);

    const template = {
      cache: fetched_local_unique,
      test: fetched_unique || {},
    };

    return new SuccessResponse("Deleted unique", template).send(res);
  })
);

export default router;
