import { BaseUnique, Unique, UserStateT } from "../../contract";
import { compileTriggers, Logger } from "../../../../../utils";
import type { DahvidClient } from "../../../../riot";
import type { Store } from "../../../../store";

export default class GetGullibleCountUnique extends BaseUnique {
  static UNIQUE_TRIGGERS = ["{PREFIX}DnJYi9uFMQuEcMgAZ0qL"];

  public static getConfig() {
    return {
      data: {
        response: "{CUSTOM_RESPONSE}",
        triggers: this.UNIQUE_TRIGGERS,
        type: "inbuilt",
      },
      store: true,
      storeId: "FMQuEcMgAZ0qLJYi9uDn",
      id: "DnJYi9uFMQuEcMgAZ0qL",
    };
  }
  public static test(message: string): boolean {
    const COMPILED_TRIGGERS = compileTriggers(this.UNIQUE_TRIGGERS);

    return false && !!COMPILED_TRIGGERS.find(
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
    Logger.debug("Attempting to trigger GetGullibleCount unique");
    var users: string[] = store.read("users");

    this.client.say(channel, `bozos: ${users.length}`);

    Logger.debug("GetGullibleCount unique has been triggered");
    return Promise.resolve();
  }
}
