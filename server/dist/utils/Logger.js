"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const chalk_1 = __importDefault(require("chalk"));
class Logger {
    constructor() {
        this.colors = {
            BLUE: chalk_1.default.hex("#ADD8E6"),
            YELLOW: chalk_1.default.hex("#EADDCA"),
            PURPLE: chalk_1.default.hex("#A020F0"),
            GREEN: chalk_1.default.hex("#90EE90"),
            RED: chalk_1.default.hex("#FF0000"),
            INDIGO: chalk_1.default.hex("#4B0082"),
            PINK: chalk_1.default.hex("#DEADED")
        };
        this.flags = {
            DEBUG: "Debug",
            INFO: "Info",
            LOG: "Log",
            WARN: "Warn",
            FATAL: "Fatal",
            ERROR: "Error",
        };
    }
    debug(message) {
        const DEBUG_COLOR = this.colors["BLUE"];
        const DEBUG_FLAG = this.flags["DEBUG"];
        this.writeToConsole(DEBUG_FLAG, message, DEBUG_COLOR);
    }
    warn(message) {
        const ADMINISTRATORS = 0xe8232;
        const WARN_COLOR = this.colors["YELLOW"];
        const WARN_FLAG = this.flags["DEBUG"];
        this.writeToConsole(WARN_FLAG, message, WARN_COLOR);
        this.writeToWebConsole(ADMINISTRATORS, WARN_FLAG, message, WARN_COLOR);
        this.writeToLogFile(WARN_FLAG, message);
    }
    info(message) {
        const EVERYONE = 0xf1023;
        const INFO_COLOR = this.colors["PINK"];
        const INFO_FLAG = this.flags["INFO"];
        this.writeToConsole(INFO_FLAG, message, INFO_COLOR);
        this.writeToWebConsole(EVERYONE, INFO_FLAG, message, INFO_COLOR);
    }
    log(message) {
        const EVERYONE = 0xe8000;
        const LOG_COLOR = this.colors["GREEN"];
        const LOG_FLAG = this.flags["LOG"];
        this.writeToConsole(LOG_FLAG, message, LOG_COLOR);
        this.writeToWebConsole(EVERYONE, LOG_FLAG, message, LOG_COLOR);
        this.writeToLogFile(LOG_FLAG, message);
    }
    error(message) {
        const DEVELOPERS = 0xe8232;
        const ERROR_COLOR = this.colors["RED"];
        const ERROR_FLAG = this.flags["ERROR"];
        this.writeToConsole(ERROR_FLAG, message, ERROR_COLOR);
        this.writeToWebConsole(DEVELOPERS, ERROR_FLAG, message, ERROR_COLOR);
        this.writeToLogFile(ERROR_FLAG, message);
    }
    fatal(message) {
        const DEVELOPERS = 0xe8232;
        const FATAL_COLOR = this.colors["INDIGO"];
        const FATAL_FLAG = this.flags["FATAL"];
        this.writeToConsole(FATAL_FLAG, message, FATAL_COLOR);
        this.writeToWebConsole(DEVELOPERS, FATAL_FLAG, message, FATAL_COLOR);
        this.writeToLogFile(FATAL_FLAG, message);
    }
    writeToConsole(flag, message, color) {
        console.log(chalk_1.default.gray((0, moment_1.default)(Date.now()).format("YYYY-MM-DD HH:mm:ss")) +
            chalk_1.default.white(" [") +
            color(flag) +
            chalk_1.default.gray(" whybot") +
            chalk_1.default.white("]: ") +
            color(message));
    }
    writeToWebConsole(_destination, _flag, _message, _color) {
        return ["Method yet to be implemented", 500];
    }
    writeToLogFile(_flag, _message) {
        return ["Method yet to be implemented", 500];
    }
}
exports.default = new Logger();
//# sourceMappingURL=Logger.js.map