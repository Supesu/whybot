"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../../utils");
const contract_1 = require("./contract");
const uniques_1 = __importDefault(require("./uniques"));
class Router {
    constructor(flags) {
        utils_1.Logger.debug("Flags injected");
        this.FLAGS = flags;
        this.Uniques = [];
        this.loadUniques();
        utils_1.Logger.debug("Ordinaries Injected");
        this.Ordinaries = this.loadOrdinaries();
    }
    static createRouter() {
        const FLAGS = process.env.FLAGS.split(",").map((i) => parseInt(i));
        if (FLAGS.includes(0xe9000)) {
            utils_1.Logger.fatal("0xe9000 detected :: Master");
        }
        utils_1.Logger.info("Created Router Instance :: Master");
        return new this(FLAGS);
    }
    async loadUniques() {
        const localUniques = await (0, uniques_1.default)();
        this.Uniques = [];
        utils_1.Logger.debug("Uniques Injected");
        return [localUniques];
    }
    loadOrdinaries() {
        return [];
    }
    findOrdinary(message) {
        if (this.Ordinaries.length <= 0) {
            return utils_1.Logger.fatal("No Ordinaries Loaded");
        }
        return this.Ordinaries.find((Ordinary) => Ordinary.test(message));
    }
    executeUnique(unique) {
        if (!unique)
            return Promise.resolve([contract_1.Status.ERR, "Unique Not Provided"]);
        return Promise.resolve([contract_1.Status.OK]);
    }
    async executeOrIgnoreOrdinary(channel, userstate, message, self) {
        if (this.FLAGS.includes(0xfe833))
            return [contract_1.Status.ERR, "0xfe833 Detected!"];
        const Orindary = this.findOrdinary(message);
        if (!Orindary)
            return [contract_1.Status.IGNORE];
        try {
            await Orindary.run(channel, userstate, message, self);
            return [contract_1.Status.OK];
        }
        catch (e) {
            return [contract_1.Status.ERR, e.message];
        }
    }
    exectueOrIgnore(channel, userstate, message, self) {
        const unique = this.Uniques.find((Unique) => Unique.test(message));
        if (!unique) {
            return this.executeOrIgnoreOrdinary(channel, userstate, message, self);
        }
        return this.executeUnique(unique);
    }
}
exports.default = Router;
//# sourceMappingURL=router.js.map