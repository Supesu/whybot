// External Imports
import { Client as TmiClient } from "tmi.js";

// Internal Imports
import { Logger } from "./utils";
import { Config } from "./config";
import { Client, Router } from "./lib/twitch";

// Main loop
void (async () => {
  //? initalize config
  const config = Config.createConfigFromEnv(process.env, ["supesuOCE"]);

  //? intalize twitch client
  Logger.debug("Initalizing Client");
  const client = new Client(new TmiClient(config.convertToTmi()));

  //? Initalize Router
  const router = await Router.create(client);

  //? Bind router to client
  client.handleMessage((...args) => router.routeMessage(...args));

  //? connect twitch client to api
  client
    .connect()
    .then(() => Logger.info("Whybot connected to twitch's API"))
    .catch((err: Error) => Logger.fatal(err.message));
})();
