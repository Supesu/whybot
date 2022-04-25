import {
  BaseUnique,
  Unique,
  UniqueMetaData,
  UserStateT,
} from "../../../contract";
import { compileTriggers, Logger } from "../../../../../../utils";
import type { DahvidClient } from "../../../../../riot";

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

    public async run(
      channel: string,
      _userstate: UserStateT,
      _message: string,
      _self: boolean,
      _api: DahvidClient
    ): Promise<void> {
      const id = triggers[0].replace("{PREFIX}", "");
      Logger.debug(`Attempting to trigger ${id} unique`);

      this.client.say(channel, response);
      Logger.debug(`${id} unique has been triggered`);
      return Promise.resolve();
    }
  };
};
