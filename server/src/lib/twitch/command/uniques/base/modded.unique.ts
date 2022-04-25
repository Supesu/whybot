import { BaseUnique, UserStateT } from "../../contract";
import { compileTriggers, Logger } from "../../../../../utils";
import type { DahvidClient } from "../../../../riot";

export default class ModdedUnique extends BaseUnique {
  static UNIQUE_TRIGGERS = ["{PREFIX}iamodded", "{PREFIX}iammod"];

  public static getConfig() {
    return {
      data: {
        response: "{CUSTOM_RESPONSE}",
        triggers: this.UNIQUE_TRIGGERS,
        type: "inbuilt",
      },
      metadata: {
        description: "Test if the current user is modded or not"
      },
      id: "S85zqms0GNpWTJRjsRPC",
    };
  }

  public static test(message: string): boolean {
    const COMPILED_TRIGGERS = compileTriggers(this.UNIQUE_TRIGGERS);

    return !!COMPILED_TRIGGERS.find(
      (x) => x === message.toLowerCase().split(/\s+/g)[0]
    );
  }

  public async run(
    channel: string,
    userstate: UserStateT,
    _message: string,
    _self: boolean,
    _api: DahvidClient
  ): Promise<void> {
    Logger.debug("Attempting to trigger Modded unique");

    const isMod =
      userstate.mod || `#${userstate.username!.toLowerCase()}` === channel;

    console.log(userstate);
    await this.client.say(channel, isMod ? "Weirdge" : "YEP");

    Logger.debug("Modded unique has been triggered");
    return Promise.resolve();
  }
}
