import { BaseUnique, Status, UniqueData } from "../../contract";
import { compileTriggers, Logger } from "../../../../../utils";

export default class TestUnique extends BaseUnique {
  static UNIQUE_TRIGGERS = ["{PREFIX}test"];

  public static getConfig() {
    return {
      data: {
        response: "{CUSTOM_RESPONSE}",
        triggers: this.UNIQUE_TRIGGERS,
        type: "inbuilt",
      },
      metadata: {
        description: "test command (tests internal sdk)",
      },
      id: "BVsFobmFUpukf5uCheao",
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
    api,
  }: UniqueData): Promise<Status.IGNORE | Status.ERR | Status.OK> {
    Logger.debug("Attempting to trigger Test unique");

    const summoner = await api.summoner.bySummonerId(
      "UhzAVbrbkhph5mN28udN8jPvEpGh0VZADVRTf_2Oi9v1oUCV6XruZG14zQ",
      "oce"
    );

    this.client.say(channel, summoner.id);
    Logger.debug("Test unique has been triggered");
    return Promise.resolve(Status.OK);
  }
}
