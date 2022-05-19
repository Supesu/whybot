import {
  BaseUnique,
  Unique,
  UniqueMetaData,
  Status,
  UniqueData,
} from "../../../contract";
import { compileTriggers, Logger } from "../../../../../../utils";

export const buildBaseUnique: Unique = (
  id: string,
  triggers: string[],
  response: string,
  metadata: UniqueMetaData
) => {
  return class BaseCustomUnique extends BaseUnique {
    static UNIQUE_TRIGGERS = triggers;

    public static getConfig() {
      return {
        data: {
          response,
          triggers,
          type: "base",
        },
        metadata,
        id,
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
    }: UniqueData): Promise<Status> {
      const id = triggers[0].replace("{PREFIX}", "");
      Logger.debug(`Attempting to trigger ${id} unique`);

      this.client.say(channel, response);
      Logger.debug(`${id} unique has been triggered`);
      return Promise.resolve(Status.OK);
    }
  };
};
