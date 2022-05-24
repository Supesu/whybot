import express from "express";
import { DatabaseClient } from "../../../../../lib/database";
import { Router } from "../../../../../lib/twitch";

import {
  BadRequestResponse,
  SuccessResponse,
  ForbiddenResponse,
} from "../../../core/ApiResponse";
import asyncHandler from "../../../helpers/asyncHandler";
import { buildCustomUnique } from "../../../../../lib/twitch/command/custom";
import { DahvidClient } from "dahvidclient";

const router = express.Router();

router.post(
  "/",
  asyncHandler(async (req, res) => {
    if (req.body.api_key !== process.env.API_KEY)
      return new ForbiddenResponse("Hmm not allowed bro");

    var config = req.body.config;

    if (!config["metadata"] || !config["metadata"]["description"]) {
      return new BadRequestResponse(JSON.stringify({ field: "metadata" })).send(
        res
      );
    }

    if (!config["triggers"] || config["triggers"].length <= 0) {
      return new BadRequestResponse(JSON.stringify({ field: "triggers" })).send(
        res
      );
    }

    if (!["opgg", "track", "base"].includes(config["type"])) {
      return new BadRequestResponse(JSON.stringify({ field: "type" })).send(
        res
      );
    }

    if (config["type"] == "base" && !config["response"]) {
      return new BadRequestResponse(JSON.stringify({ field: "response" })).send(
        res
      );
    }

    if (["opgg", "track"].includes(config["type"]) && !config["region"]) {
      return new BadRequestResponse(JSON.stringify({ field: "region" })).send(
        res
      );
    }

    if (["opgg", "track"].includes(config["type"]) && !config["summonerName"]) {
      return new BadRequestResponse(
        JSON.stringify({ field: "summonerName" })
      ).send(res);
    }

    const router = req.app.locals.router as Router;
    const api = req.app.locals.api as DahvidClient;
    const db = req.app.locals.database as DatabaseClient;
    var hasFailed = false;

    // run any pre-injection scripts
    if (["opgg", "track"].includes(config["type"])) {
      await api.summoner
        .byName(config["summonerName"], config["region"])
        .then((data) => {
          config["summonerId"] = data["id"];
        })
        .catch(() => {
          hasFailed = true;
          return new BadRequestResponse(
            JSON.stringify({ field: "summonerName" })
          ).send(res);
        });
      delete config["summonerName"];
    }

    // this stops headers being set after request has already been sent
    if (hasFailed) return;

    // inject into cloud database
    const commandId = await db.injectIntoCollectionWithoutId("uniques", config);

    // build unique
    const buildCustomUniqueConfig: Record<string, any> = {
      data: {
        type: config["type"],
        triggers: config["triggers"],
      },
      id: commandId,
      metadata: config["metadata"],
    };

    if (["opgg", "track"].includes(config["type"])) {
      buildCustomUniqueConfig["data"]["summonerId"] = config["summonerId"];
      buildCustomUniqueConfig["data"]["region"] = config["region"];
    }

    const unique = await buildCustomUnique(buildCustomUniqueConfig as any);

    // inject into live client
    router.injectUnique(unique);

    return new SuccessResponse(`Created unique: ${commandId}`, commandId).send(
      res
    );
  })
);

export default router;
