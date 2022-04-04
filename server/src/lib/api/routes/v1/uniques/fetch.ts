import express from "express";
import { DatabaseClient } from "../../../../../lib/database";
import { Router } from "../../../../../lib/twitch";

import { SuccessResponse } from "../../../core/ApiResponse";
import asyncHandler from "../../../helpers/asyncHandler";

const router = express.Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const router = req.app.locals.router as Router;
    const database = req.app.locals.database as DatabaseClient;

    const uniques = await router.fetchUniques();
    const cloud_uniques = await database.fetchCollection("uniques");

    const template = {
      cloud: cloud_uniques,
      local: uniques.map((u) => u.getConfig()),
    };

    await new SuccessResponse("Fetched uniques", template).send(res);
  })
);

export default router;
