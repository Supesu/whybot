"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
class Config {
    constructor(username, password, channels, options) {
        this.username = username;
        this.password = password;
        this.channels = channels;
        this.options = {
            debug: (options === null || options === void 0 ? void 0 : options.debug) || false,
        };
    }
    static createConfigFromEnv(env, channels) {
        const isValid = (item) => typeof item === "string" && item;
        const username = env.TWITCH_USERNAME;
        const password = env.TWITCH_PASSWORD;
        const debug = env.TWITCH_DEBUG === "true";
        if (!isValid(username) && !isValid(password)) {
            utils_1.Logger.fatal("Failed Validation");
            process.exit();
        }
        return new this(username, password, channels, { debug });
    }
    getUsername() {
        return this.username;
    }
    getPassword() {
        return this.password;
    }
    getChannels() {
        return this.channels;
    }
    isDebug() {
        return !!this.options.debug;
    }
    getOptions() {
        return this.options;
    }
    convertToTmi() {
        return {
            options: { debug: this.isDebug() },
            connection: {
                reconnect: true,
                secure: true,
            },
            identity: {
                username: this.getUsername(),
                password: this.getPassword(),
            },
            channels: this.getChannels(),
        };
    }
    convertToJson() {
        return {
            channels: this.getChannels(),
            options: this.getOptions(),
            password: this.getPassword(),
            username: this.getUsername(),
        };
    }
}
exports.default = Config;
//# sourceMappingURL=config.js.map