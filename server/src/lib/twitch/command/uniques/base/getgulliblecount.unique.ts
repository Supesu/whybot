import { BaseUnique, Status, UniqueData } from "../../contract";
import { compileTriggers, Logger } from "../../../../../utils";

export default class GetGullibleCountUnique extends BaseUnique {
  static UNIQUE_TRIGGERS = ["{PREFIX}bozos"];

  public static getConfig() {
    return {
      data: {
        response: "{CUSTOM_RESPONSE}",
        triggers: this.UNIQUE_TRIGGERS,
        type: "inbuilt",
      },
      metadata: {
        description: "BOOZOZOOZOZOZO",
      },
      store: true,
      storeId: "FMQuEcMgAZ0qLJYi9uDn",
      id: "DnMgAZ0qLJYi9uFMQuEc",
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
    store,
  }: UniqueData): Promise<Status.IGNORE | Status.ERR | Status.OK> {
    Logger.debug("Attempting to trigger GetGullibleCount unique");
    var users: string[] = store.read("users");

    this.client.say(channel, `bozos: ${users.length}`);

    Logger.debug("GetGullibleCount unique has been triggered");
    return Promise.resolve(Status.OK);
  }
}
