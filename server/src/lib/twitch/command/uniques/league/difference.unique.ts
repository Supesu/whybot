import { BaseUnique, UserStateT } from "../../contract";
import { compileTriggers, Logger } from "../../../../../utils";
import type { DahvidClient, LeagueEntryDTO } from "dahvidclient";

export default class DifferenceUnique extends BaseUnique {
  static UNIQUE_TRIGGERS = ["{PREFIX}difference"];

  public static getConfig() {
    return {
      data: {
        response: "{CUSTOM_RESPONSE}",
        triggers: this.UNIQUE_TRIGGERS,
        type: "inbuilt",
      },
      
      metadata: {
        description: "The difference in LP from whynot and Udysof"
      },
      id: "SHJpgAP10J25Yje7kMgC",
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
  ): Promise<void> {
    Logger.debug("Attempting to trigger Difference unique");
    const UDYSOF_ID = "oM5uETank-LGYJ4gp5SUcZUKhXzzEsSmB4j71jfLX1i5";
    const WHYNOT_ID = "YVZewD2fJva4J9A1_atFPyVz6JfKy2CcxWkmiWcX_3ohyA";

    const APEXRANKS: Record<string, boolean> = {
      CHALLENGER: true,
      GRANDMASTER: true,
      MASTER: true,
    };

    const DISTANCEFROMAPEX: Record<string, number> = {
      CHALLENGER: 0,
      GRANDMASTER: 0,
      MASTER: 0,
      DIAMOND: 0,
      PLATINUM: 1,
      GOLD: 2,
      SILVER: 3,
      BRONZE: 4,
      IRON: 6,
    };

    const DISTANCEFROMNEXTRANK: Record<string, number> = {
      III: 2,
      II: 1,
    };

    const [Whynot, Udysof] = await Promise.all([
      api.league.bySummonerId(WHYNOT_ID, "oce"),
      api.league.bySummonerId(UDYSOF_ID, "oce"),
    ]).then(([Whynot, Udysof]) => {
      const _Whynot = Whynot.find(
        (entry) => entry.queueType === "RANKED_SOLO_5x5"
      );
      const _Udysof = Udysof.find(
        (entry) => entry.queueType === "RANKED_SOLO_5x5"
      );

      if (!_Udysof || !_Whynot)
        throw TypeError(
          "This shouldn't ever occur tbh, just doing to make typescript happy lol"
        );

      return [_Whynot, _Udysof];
    });

    const calcDifferenceToApex = (user: LeagueEntryDTO) => {
      return (
        (DISTANCEFROMAPEX[user.tier] ?? 0) * 400 +
        (APEXRANKS[user.tier]
          ? 0
          : (DISTANCEFROMNEXTRANK[user.rank] ?? 0) * 100) +
        (APEXRANKS[user.tier] ? 0 : 100 - user.leaguePoints)
      );
    };

    const udysofDifference = calcDifferenceToApex(Udysof);
    const whynotDifference = calcDifferenceToApex(Whynot);

    if (APEXRANKS[Whynot.tier] && APEXRANKS[Udysof.tier]) {
      this.client.say(
        channel,
        Whynot.leaguePoints > Udysof.leaguePoints
          ? `Udysof is ${
              Whynot.leaguePoints - Udysof.leaguePoints
            }LP behind Whynot`
          : `Whynot is ${
              Udysof.leaguePoints - Whynot.leaguePoints
            }LP behind Udysof`
      );
      return;
    }

    if (APEXRANKS[Whynot.tier] && !APEXRANKS[Udysof.tier]) {
      this.client.say(
        channel,
        `Udysof is ${udysofDifference + Whynot.leaguePoints}LP behind Whynot`
      );
    }

    if (!APEXRANKS[Whynot.tier] && APEXRANKS[Udysof.tier]) {
      this.client.say(
        channel,
        `Whynot is ${whynotDifference + Udysof.leaguePoints}LP behind Udysof`
      );
    }

    if (!APEXRANKS[Whynot.tier] && !APEXRANKS[Udysof.tier]) {
      this.client.say(
        channel,
        `Udysof is bad sry! check again when he's master L + Bozo`
      );
    }

    Logger.debug("Difference unique has been triggered");
    return Promise.resolve();
  }
}
