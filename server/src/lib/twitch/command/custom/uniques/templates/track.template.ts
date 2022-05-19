import { BaseUnique, Unique, UniqueMetaData, UserStateT, Status } from "../../../contract";
import { compileTriggers, Logger, formatRank } from "../../../../../../utils";
import type { DahvidClient, Region } from "dahvidclient";

export const buildTrackUnique: Unique = (
  id: string,
  triggers: string[],
  summonerId: string,
  region: Region,
  metadata: UniqueMetaData
) => {
  return class TrackCustomUnique extends BaseUnique {
    static UNIQUE_TRIGGERS = triggers;

    public static getConfig() {
      return {
        data: {
          summonerId,
          triggers,
          region,
          type: "track",
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

      const summoner = await api.league
        .bySummonerId(summonerId, region)
        .then((queues) =>
          queues.find((entries) => entries.queueType === "RANKED_SOLO_5x5")
        );

      this.client.say(
        channel,
        `User: ${summoner!.summonerName} | Rank: ${formatRank(
          summoner!.tier,
          summoner!.rank
        )} | LP: ${summoner!.leaguePoints}`
      );

      Logger.debug(`${id} unique has been triggered`);
      return Promise.resolve(Status.OK);
    }
  };
};
