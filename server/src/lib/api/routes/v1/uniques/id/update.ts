import express from "express";
import { DatabaseClient } from "../../../../../../lib/database";
import { Router } from "../../../../../../lib/twitch";

import {
  BadRequestResponse,
  SuccessResponse,
  ForbiddenResponse,
} from "../../../../core/ApiResponse";
import asyncHandler from "../../../../helpers/asyncHandler";
import { buildCustomUnique } from "../../../../../../lib/twitch/command/custom";

const router = express.Router();

const sanitizeString = (str: string) => {
  str = str.replace(/[^a-z0-9áéíóúñü \.,_-][{^}]/gim, "");
  return str.trim();
};

router.post(
  "/",
  asyncHandler(async (req, res) => {
    if (req.body.api_key !== process.env.API_KEY)
      return new ForbiddenResponse("Hmm not allowed bro");

    const router = req.app.locals.router as Router;
    const database = req.app.locals.database as DatabaseClient;
    const id = req.app.locals.id;

    const uniques = await router.fetchUniques();
    const cloud_uniques = await database.fetchCollection("uniques");

    const fetched_local_unique = uniques
      .map((u) => u.getConfig())
      .find((u) => u.id === id);
    const fetched_cloud_unique = cloud_uniques.find((u) => u.id === id);

    if (!fetched_cloud_unique) return new BadRequestResponse("oops lol!");

    const { region, triggers, type, summonerId, response } = req.body.data;
    const toChange: any = {};
    if (region && type !== "") toChange["region"] = sanitizeString(region);
    if (triggers && Array.isArray(triggers) && triggers.length !== 0)
      toChange["triggers"] = triggers.map((trigger) => sanitizeString(trigger));
    if (type && type !== "" && ["base", "opgg", "tracl"].includes(type))
      toChange["type"] = sanitizeString(type);
    if (summonerId && summonerId !== "")
      toChange["summonerId"] = sanitizeString(summonerId);
    if (response && response !== "")
      toChange["response"] = sanitizeString(response);

    const newTemplate: any = {
      ...fetched_local_unique,
      data: { ...fetched_local_unique!.data, ...toChange },
    };

    const unique = await buildCustomUnique(newTemplate);
    router.replaceUnique(id, unique);
    database.injectIntoCollectionWithId(
      "uniques",
      sanitizeString(id),
      newTemplate
    );

    const _response = {
      old: {
        cloud: fetched_cloud_unique,
        local: fetched_local_unique,
      },
      new: {
        cloud: newTemplate,
        local: unique.getConfig(),
      },
    };

    return new SuccessResponse("Updated Unique", _response).send(res);
  })
);

export default router;
