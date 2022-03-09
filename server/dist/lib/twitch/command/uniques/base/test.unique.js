"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../../../../utils");
class TestUnique {
    static test(message) {
        const COMPILED_TRIGGERS = (0, utils_1.compileTriggers)(this.UNIQUE_TRIGGERS);
        return !!COMPILED_TRIGGERS.find((x) => x === message.split(/\s+/g)[0]);
    }
    async run(_channel, _userstate, _message, _self) {
        utils_1.Logger.debug("Attempting to trigger test command");
        utils_1.Logger.debug("Test command has been triggered");
        return Promise.resolve();
    }
}
exports.default = TestUnique;
TestUnique.UNIQUE_TRIGGERS = ["{PREFIX}test", "{PREFIX}ping"];
//# sourceMappingURL=test.unique.js.map