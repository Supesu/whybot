import {
  BaseUnique,
  Unique,
  UniqueMetaData,
  UserStateT,
  Status
} from "../../../contract";
import { compileTriggers, Logger } from "../../../../../../utils";
import type { DahvidClient, Region } from "dahvidclient";

export const buildOpggUnique: Unique = (
  id: string,
  triggers: string[],
  summonerId: string,
  region: Region,
  metadata: UniqueMetaData
) => {
  return class OpggCustomUnique extends BaseUnique {
    static UNIQUE_TRIGGERS = triggers;

    public static getConfig() {
      return {
        data: {
          summonerId,
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

    public async run(
      channel: string,
      _userstate: UserStateT,
      _message: string,
      _self: boolean,
      api: DahvidClient
    ): Promise<Status.IGNORE | Status.ERR | Status.OK> {
      const id = triggers[0].replace("{PREFIX}", "");
      Logger.debug(`Attempting to trigger ${id} unique`);

      const summoner = await api.summoner.bySummonerId(summonerId, region);
      const name = encodeURI(summoner.name.trim());

      this.client.say(channel, `https://op.gg/summoners/${region}/${name}`);

      Logger.debug(`${id} unique has been triggered`);
      return Promise.resolve(Status.OK);
    }
  };
};
