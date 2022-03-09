"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../../utils");
class Client {
    constructor(client, onMessage) {
        this.client = client;
        utils_1.Logger.debug("Initalized Client");
        this.client.on("message", onMessage);
        utils_1.Logger.debug("Binded Message Handler To Client");
    }
    connect() {
        return this.client.connect();
    }
    say(channel, message) {
        return this.client.say(channel, message);
    }
}
exports.default = Client;
//# sourceMappingURL=client.js.map