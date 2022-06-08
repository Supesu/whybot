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
import { DahvidClient } from "dahvidclient";
import { Logger } from "../../../../../../utils";
import type { Unique } from "../../../../../twitch/command/contract";

const router = express.Router();

router.post(
  "/",
  asyncHandler(async (req, res) => {
    if (req.body.api_key !== process.env.API_KEY)
      return new ForbiddenResponse("Hmm not allowed bro").send(res);

    const router = req.app.locals.router as Router;
    const database = req.app.locals.database as DatabaseClient;
    const api = req.app.locals.api as DahvidClient;
    const id = req.app.locals.id;

    const uniques = await router.fetchUniques();
    const cloud_uniques = await database.fetchCollection("uniques");

    const fetched_local_unique = uniques
      .map((u) => u.getConfig())
      .find((u) => u.id === id);
    const fetched_cloud_unique = cloud_uniques.find((u) => u.id === id);

    if (!fetched_cloud_unique)
      return new BadRequestResponse("oops lol!").send(res);

    const config = req.body.config;
    var valid = true;
    var newConfig: Record<string, any> = { data: {} };

    if (!config.metadata.description) valid = false;
    if (config.triggers.length === 0) valid = false;
    if (!["base", "opgg", "track"].includes(config.type)) valid = false;
    if (config.type === "base" && (config.response === "" || !config.response))
      valid = false;
    if (
      ["opgg", "track"].includes(config.type) &&
      (config.summonerName == "" || !config.region)
    )
      valid = false;

    if (!valid) return new BadRequestResponse("oop").send(res);

    newConfig["data"]["triggers"] = config.triggers;
    newConfig["metadata"] = config.metadata;

    if (["opgg", "track"].includes(config.type)) {
      const summonerId = (
        await api.summoner.byName(config.summonerName, config.region)
      ).id;

      newConfig["data"]["region"] = config.region;
      newConfig["data"]["summonerId"] = summonerId;
    }

    if (config.type === "base") {
      newConfig["data"]["response"] = config.response;
    }

    const newTemplate: any = {
      ...fetched_local_unique,
      ...newConfig,
      data: { ...fetched_local_unique.data, ...newConfig.data },
    };

    const unique: Unique = await buildCustomUnique(newTemplate);
    router.replaceUnique(id, unique);
    const cloudTemplate: any = {
      id: newTemplate.id,
      ...newTemplate.data,
      metadata: newTemplate.metadata,
    };
    database.injectIntoCollectionWithId("uniques", id, cloudTemplate);
    Logger.debug("Executed update request for Unique: " + id);

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
