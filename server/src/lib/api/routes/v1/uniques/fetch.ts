import express from "express";
import { Router } from "../../../../../lib/twitch";

import { SuccessResponse } from "../../../core/ApiResponse";
import asyncHandler from "../../../helpers/asyncHandler";

const router = express.Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const router = req.app.locals.router as Router;

    const uniques = await router.fetchUniques();

    const template = {
      local: uniques.map((u) => u.getConfig()),
    };

    await new SuccessResponse("Fetched uniques", template).send(res);
  })
);

export default router;
