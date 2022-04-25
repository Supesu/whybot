import { BaseUnique, Unique, UserStateT } from "../../contract";
import { compileTriggers, Logger } from "../../../../../utils";
import type { DahvidClient } from "../../../../riot";

export default class PingUnique extends BaseUnique {
  static UNIQUE_TRIGGERS = ["{PREFIX}getcmd"];

  public static getConfig() {
    return {
      data: {
        response: "{CUSTOM_RESPONSE}",
        triggers: this.UNIQUE_TRIGGERS,
        type: "inbuilt",
      },
      metadata: {
        description: "Get the id of command from its trigger"
      },
      id: "Z0qLJYi9uDnFMQuEcMgA",
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
    _userstate: UserStateT,
    message: string,
    _self: boolean,
    _api: DahvidClient,
    metadata: Unique[]
  ): Promise<void> {
    Logger.debug("Attempting to trigger CMD unique");

    const query = compileTriggers([message.split(/\s+/g)[1]])[0];
    const cmd = metadata.find((c) => c.test(query));

    if (!cmd) {
      await this.client.say(channel, "Not searching for trigger");
      return;
    }

    const data = cmd.getConfig();

    this.client.say(channel, data.id);

    Logger.debug("CMD unique has been triggered");
    return Promise.resolve();
  }
}
