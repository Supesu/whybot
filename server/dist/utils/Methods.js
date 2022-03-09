"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compileTriggers = void 0;
const compileTriggers = (triggers) => {
    return triggers.map((t) => t.replace("{PREFIX}", process.env.PREFIX));
};
exports.compileTriggers = compileTriggers;
//# sourceMappingURL=Methods.js.map