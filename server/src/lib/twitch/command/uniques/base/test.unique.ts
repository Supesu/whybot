import { BaseUnique, UserStateT } from "../../contract";
import { compileTriggers, Logger } from "../../../../../utils";

export default class TestUnique extends BaseUnique {
  static UNIQUE_TRIGGERS = ["{PREFIX}test", "{PREFIX}ping"];

  public static test(message: string): boolean {
    const COMPILED_TRIGGERS = compileTriggers(this.UNIQUE_TRIGGERS);

    return !!COMPILED_TRIGGERS.find((x) => x === message.split(/\s+/g)[0]);
  }

  public async run(
    channel: string,
    _userstate: UserStateT,
    _message: string,
    _self: boolean
  ): Promise<void> {
    Logger.debug("Attempting to trigger test command");

    this.client.say(channel, "pong")
    Logger.debug("Test command has been triggered");
    return Promise.resolve();
  }
}
