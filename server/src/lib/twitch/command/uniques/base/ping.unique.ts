import { BaseUnique, Status, UniqueData } from "../../contract";
import { compileTriggers, Logger } from "../../../../../utils";

export default class PingUnique extends BaseUnique {
  static UNIQUE_TRIGGERS = ["{PREFIX}ping"];

  public static getConfig() {
    return {
      data: {
        response: "{CUSTOM_RESPONSE}",
        triggers: this.UNIQUE_TRIGGERS,
        type: "inbuilt",
      },
      metadata: {
        description: "Retrieve the ping from the internal client -> twitch",
      },
      id: "FMQuEcMgAZ0qLJYi9uDn",
    };
  }
  public static test(message: string): boolean {
    const COMPILED_TRIGGERS = compileTriggers(this.UNIQUE_TRIGGERS);

    return !!COMPILED_TRIGGERS.find(
      (x) => x === message.toLowerCase().split(/\s+/g)[0]
    );
  }

  public async run({ channel }: UniqueData): Promise<Status> {
    Logger.debug("Attempting to trigger Ping unique");

    const ping = (await this.client.getPing())[0] * 1000;
    this.client.say(channel, `${ping}ms`);

    Logger.debug("Ping unique has been triggered");
    return Promise.resolve(Status.OK);
  }
}
