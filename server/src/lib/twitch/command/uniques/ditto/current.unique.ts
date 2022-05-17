import { BaseUnique, Unique, UserStateT } from "../../contract";
import { compileTriggers, Logger } from "../../../../../utils";
import type { DahvidClient } from "dahvidclient";
import type { Store } from "../../../../store";

export default class CurrentDittoUnique extends BaseUnique {
  static UNIQUE_TRIGGERS = ["{PREFIX}currentditto"];

  public static getConfig() {
    return {
      data: {
        response: "{CUSTOM_RESPONSE}",
        triggers: this.UNIQUE_TRIGGERS,
        type: "inbuilt",
      },
      storeId: "ouebxbmmRN74j8nW9sGU",
      store: true,
      metadata: {
        description: "Retrieve the current ditto"
      },
      id: "AyvBeRZ1jUbUMkHXmgRq",
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
    _message: string,
    _self: boolean,
    _api: DahvidClient,
    _metadata: Unique[],
    store: Store
  ): Promise<void> {
    Logger.debug("Attempting to trigger Current unique");
    var response: string = store.read("response");

    this.client.say(channel, response || "No ditto selected, run !updateditto")

    Logger.debug("Current Unique has been triggered");
    return Promise.resolve();
  }
}
