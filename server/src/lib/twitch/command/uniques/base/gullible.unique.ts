import { BaseUnique, Status, UniqueData } from "../../contract";
import { compileTriggers, Logger } from "../../../../../utils";

export default class GullibleUnique extends BaseUnique {
  static UNIQUE_TRIGGERS = ["{PREFIX}gullible"];

  public static getConfig() {
    return {
      data: {
        response: "{CUSTOM_RESPONSE}",
        triggers: this.UNIQUE_TRIGGERS,
        type: "inbuilt",
      },
      store: true,
      metadata: {
        description: "I mean it does something tbf",
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

  public async run({
    userstate,
    store,
  }: UniqueData): Promise<Status.IGNORE | Status.ERR | Status.OK> {
    Logger.debug("Attempting to trigger Gullible unique");
    var users: string[] = store.read("users");

    if (!users) {
      store.write("users", []);
      users = store.read("users");
    }

    if (!users.includes(userstate["display-name"]!)) {
      store.write("users", [...users, userstate["display-name"]]);

      store.persist();
    }

    Logger.debug("Gullible unique has been triggered");
    return Promise.resolve(Status.OK);
  }
}
