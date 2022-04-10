import { BaseUnique, Unique, UserStateT } from "../../contract";
import { compileTriggers, Logger } from "../../../../../utils";
import type { DahvidClient } from "../../../../riot";
import type { Store } from "../../../../store";

export default class SetDittoUnique extends BaseUnique {
  static UNIQUE_TRIGGERS = ["{PREFIX}setditto"];

  public static getConfig() {
    return {
      data: {
        response: "{CUSTOM_RESPONSE}",
        triggers: this.UNIQUE_TRIGGERS,
        type: "inbuilt",
      },
      storeId: "ouebxbmmRN74j8nW9sGU",
      store: true,
      id: "jUbUMkHXmgRqAyvBeRZ1",
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
    message: string,
    _self: boolean,
    _api: DahvidClient,
    _metadata: Unique[],
    store: Store
  ): Promise<void> {
    Logger.debug("Attempting to trigger Set unique");
    if (
      "#" + userstate["display-name"]!.toLowerCase() !==
      channel.toLowerCase()
    ) {
      this.client.say(channel, "You don't have access to this sorry");

      return Promise.resolve();
    }

    const name = message.split(" ");
    name.shift();
    if (name.length === 0) {
      this.client.say(channel, "please provide a user");

      Logger.debug("Set Unique has been triggered");
      return Promise.resolve();
    }

    const cached_response =
      "I am currently copying: https://oce.op.gg/summoners/oce/" +
      encodeURI(name.join(" "));

    this.client.say(channel, "Set current ditto as: " + name.join(" "));
    store.write("response", cached_response);
    await store.persist();

    Logger.debug("Set Unique has been triggered");
    return Promise.resolve();
  }
}
