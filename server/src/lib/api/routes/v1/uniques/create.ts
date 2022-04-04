import express from "express";
import { DatabaseClient } from "../../../../../lib/database";
import { Router } from "../../../../../lib/twitch";

import { BadRequestResponse, SuccessResponse } from "../../../core/ApiResponse";
import asyncHandler from "../../../helpers/asyncHandler";
import { buildCustomUnique } from "../../../../../lib/twitch/command/custom";

const router = express.Router();

type Type = "base" | "opgg" | "track";
const sanitizeString = (str: string) => {
  str = str.replace(/[^a-z0-9áéíóúñü \.,_-][{^}]/gim, "");
  return str.trim();
};

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const router = req.app.locals.router as Router;
    const db = req.app.locals.database as DatabaseClient;

    if (
      !Array.isArray(req.body.triggers) ||
      typeof req.body.response !== "string" ||
      typeof req.body.type !== "string"
    )
      return new BadRequestResponse("500 oops");

    const createTemplate = (type: Type, data: any) => {
      if (!["base", "opgg", "track"].includes(type)) return false;

      if (type == "base") {
        if (data.response === "" || data.triggers.length === 0) return false;

        return {
          data: {
            response: sanitizeString(data.response),
            triggers: data.triggers.map((trigger: string) =>
              sanitizeString(trigger)
            ),
            type: sanitizeString(data.type) as Type,
          },
          id: sanitizeString(data.id),
        };
      }

      if (type == "opgg" || type == "track") {
        if (
          data.summonerId === "" ||
          data.region === "" ||
          data.triggers.length === 0
        )
          return false;

        return {
          data: {
            triggers: data.triggers.map((trigger: string) =>
              sanitizeString(trigger)
            ),
            summonerId: sanitizeString(data.summonerId),
            region: sanitizeString(data.region),
            type: sanitizeString(data.type) as Type,
          },
          id: sanitizeString(data.id),
        };
      }

      return false;
    };

    var template = createTemplate(req.body.type, req.body);

    if (!template) return new BadRequestResponse("500 oops");

    const unique = await buildCustomUnique(template);
    db.injectIntoCollectionWithId(
      "uniques",
      sanitizeString(req.body.id),
      template.data
    );
    router.injectUnique(unique);

    return new SuccessResponse("Fetched games", "created").send(res);
  })
);

export default router;
