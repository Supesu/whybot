import express from "express";
import { DatabaseClient } from "../../../../../../lib/database";
import { Router } from "../../../../../../lib/twitch";

import { SuccessResponse } from "../../../../core/ApiResponse";
import asyncHandler from "../../../../helpers/asyncHandler";

const router = express.Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const router = req.app.locals.router as Router;
    const database = req.app.locals.database as DatabaseClient;

    const id = req.app.locals.id;
    const uniques = await router.fetchUniques();
    const cloud_uniques = await database.fetchCollection("uniques");

    const fetched_local_unique = uniques
      .map((u) => u.getConfig())
      .find((u) => u.id === id);
    const fetched_cloud_unique = cloud_uniques.find((u) => u.id === id);

    const template = {
      cloud: fetched_cloud_unique,
      local: fetched_local_unique,
    };

    await new SuccessResponse("Fetched unique", template).send(res);
  })
);

export default router;
