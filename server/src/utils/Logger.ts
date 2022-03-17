// External Imports
import moment from "moment";
import chalk from "chalk";

// Typings
type Key = string;
type Color = chalk.Chalk;
interface ColorMap {
  [key: Key]: Color;
}
type Destination = number;
type Flag = string;
interface FlagMap {
  [key: Key]: Flag;
}

class Logger {
  private colors: ColorMap;
  private flags: FlagMap;

  constructor() {
    this.colors = {
      BLUE: chalk.hex("#ADD8E6"),
      YELLOW: chalk.hex("#EADDCA"),
      PURPLE: chalk.hex("#A020F0"),
      GREEN: chalk.hex("#90EE90"),
      RED: chalk.hex("#FF0000"),
      INDIGO: chalk.hex("#4B0082"),
      PINK: chalk.hex("#DEADED")
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

  public debug(message: String) {
    const DEBUG_COLOR = this.colors["PINK"];
    const DEBUG_FLAG = this.flags["DEBUG"];

    this.writeToConsole(DEBUG_FLAG, message, DEBUG_COLOR);
  }

  public warn(message: String) {
    const ADMINISTRATORS = 0xe8232;
    const WARN_COLOR = this.colors["YELLOW"];
    const WARN_FLAG = this.flags["DEBUG"];

    this.writeToConsole(WARN_FLAG, message, WARN_COLOR);
    this.writeToWebConsole(ADMINISTRATORS, WARN_FLAG, message, WARN_COLOR);
    this.writeToLogFile(WARN_FLAG, message);
  }

  public info(message: String) {
    const EVERYONE = 0xf1023;
    const INFO_COLOR = this.colors["BLUE"];
    const INFO_FLAG = this.flags["INFO"];

    this.writeToConsole(INFO_FLAG, message, INFO_COLOR);
    this.writeToWebConsole(EVERYONE, INFO_FLAG, message, INFO_COLOR);
  }

  public log(message: String) {
    const EVERYONE = 0xe8000;
    const LOG_COLOR = this.colors["GREEN"];
    const LOG_FLAG = this.flags["LOG"];

    this.writeToConsole(LOG_FLAG, message, LOG_COLOR);
    this.writeToWebConsole(EVERYONE, LOG_FLAG, message, LOG_COLOR);
    this.writeToLogFile(LOG_FLAG, message);
  }

  public error(message: String) {
    const DEVELOPERS = 0xe8232;
    const ERROR_COLOR = this.colors["RED"];
    const ERROR_FLAG = this.flags["ERROR"];

    this.writeToConsole(ERROR_FLAG, message, ERROR_COLOR);
    this.writeToWebConsole(DEVELOPERS, ERROR_FLAG, message, ERROR_COLOR);
    this.writeToLogFile(ERROR_FLAG, message);
  }

  public fatal(message: String) {
    const DEVELOPERS = 0xe8232;
    const FATAL_COLOR = this.colors["INDIGO"];
    const FATAL_FLAG = this.flags["FATAL"];

    this.writeToConsole(FATAL_FLAG, message, FATAL_COLOR);
    this.writeToWebConsole(DEVELOPERS, FATAL_FLAG, message, FATAL_COLOR);
    this.writeToLogFile(FATAL_FLAG, message);
  }

  private writeToConsole(flag: Flag, message: String, color: Color) {
    console.log(
      chalk.gray(moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")) +
        chalk.white(" [") +
        color(flag) +
        chalk.gray(" whybot") +
        chalk.white("]: ") +
        color(message)
    );
  }

  private writeToWebConsole(
    _destination: Destination,
    _flag: Flag,
    _message: String,
    _color: Color
  ) {
    return ["Method yet to be implemented", 500];
  }

  private writeToLogFile(_flag: Flag, _message: String) {
    return ["Method yet to be implemented", 500];
  }
}

export default new Logger();
