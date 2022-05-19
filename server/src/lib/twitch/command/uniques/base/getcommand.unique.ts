import {
  BaseUnique,
  Status,
  UniqueData,
} from "../../contract";
import { compileTriggers, Logger } from "../../../../../utils";

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
        description: "Get the id of command from its trigger",
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

  public async run({
    channel,
    message,
    metadata,
  }: UniqueData): Promise<Status.IGNORE | Status.ERR | Status.OK> {
    Logger.debug("Attempting to trigger CMD unique");

    const query = compileTriggers([message.split(/\s+/g)[1]])[0];
    const cmd = metadata.find((c) => c.test(query));

    if (!cmd) {
      await this.client.say(channel, "Not searching for trigger");
      return Promise.resolve(Status.OK);
    }

    const data = cmd.getConfig();

    this.client.say(channel, data.id);

    Logger.debug("CMD unique has been triggered");
    return Promise.resolve(Status.OK);
  }
}
