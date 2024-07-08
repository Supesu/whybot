import {
  BaseUnique,
  Unique,
  UniqueMetaData,
  Status,
  UniqueData,
} from "../../../contract";
import { compileTriggers, Logger } from "../../../../../../utils";
import type { Region } from "dahvidclient";

export const buildOpggUnique: Unique = (
  id: string,
  triggers: string[],
  puuid: string,
  region: Region,
  metadata: UniqueMetaData
) => {
  return class OpggCustomUnique extends BaseUnique {
    static UNIQUE_TRIGGERS = triggers;

    public static getConfig() {
      return {
        data: {
          puuid,
          triggers,
          region,
          type: "opgg",
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

    public async run({ channel, api }: UniqueData): Promise<Status> {
      const trigger = triggers[0].replace("{PREFIX}", "");
      Logger.debug(`Attempting to trigger ${trigger} unique`);

      const account = await api.account.byPuuid(puuid, "asia");

      this.client.say(
        channel,
        `https://op.gg/summoners/${region}/${account.gameName}-${account.tagLine}`
      );

      Logger.debug(`${trigger} unique has been triggered`);
      return Promise.resolve(Status.OK);
    }
  };
};
