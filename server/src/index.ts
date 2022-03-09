// External Imports
import { Client as TmiClient } from "tmi.js";
import {} from "discord.js";

// Internal Imports
import { Logger } from "./utils";
import { Config } from "./config";
import { Client, Router } from "./lib/twitch";

// Main loop
void (async () => {
  //? initalize config
  const config = Config.createConfigFromEnv(process.env, ["supesuOCE"]);
  const router = Router.createRouter();

  //? intalize twitch client
  Logger.debug("Initalizing Client");
  const client = new Client(new TmiClient(config.convertToTmi()), router.exectueOrIgnore);

  //? connect twitch client to api
  client
    .connect()
    .then(() => Logger.info("Whybot connected to twitch's API"))
    .catch((err: Error) => Logger.fatal(err.message));
})();
