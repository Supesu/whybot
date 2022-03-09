"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tmi_js_1 = require("tmi.js");
const utils_1 = require("./utils");
const config_1 = require("./config");
const twitch_1 = require("./lib/twitch");
void (async () => {
    const config = config_1.Config.createConfigFromEnv(process.env, ["supesuOCE"]);
    const router = twitch_1.Router.createRouter();
    utils_1.Logger.debug("Initalizing Client");
    const client = new twitch_1.Client(new tmi_js_1.Client(config.convertToTmi()), router.exectueOrIgnore);
    client
        .connect()
        .then(() => utils_1.Logger.info("Whybot connected to twitch's API"))
        .catch((err) => utils_1.Logger.fatal(err.message));
})();
//# sourceMappingURL=index.js.map