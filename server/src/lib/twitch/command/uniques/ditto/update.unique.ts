import { BaseUnique, Unique, UserStateT } from "../../contract";
import { compileTriggers, Logger } from "../../../../../utils";
import type { DahvidClient, LeagueItemDTO } from "../../../../riot";
import type { Store } from "../../../../store";

export default class UpdateDittoUnique extends BaseUnique {
  static UNIQUE_TRIGGERS = ["{PREFIX}updateditto"];

  public static getConfig() {
    return {
      data: {
        response: "{CUSTOM_RESPONSE}",
        triggers: this.UNIQUE_TRIGGERS,
        type: "inbuilt",
      },
      store: true,
      id: "ouebxbmmRN74j8nW9sGU",
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
    _message: string,
    _self: boolean,
    api: DahvidClient,
    _metadata: Unique[],
    store: Store
  ): Promise<void> {
    Logger.debug("Attempting to trigger Update unique");
    if (
      "#" + userstate["display-name"]!.toLowerCase() !==
      channel.toLowerCase()
    ) {
      this.client.say(channel, "You don't have access to this sorry");

      return Promise.resolve();
    }

    const WHYNOT_SUMMONERID = "YVZewD2fJva4J9A1_atFPyVz6JfKy2CcxWkmiWcX_3ohyA";

    const masterLeagues = api.league.masterLeagues("RANKED_SOLO_5x5", "oce");
    const grandmasterLeagues = api.league.grandmasterLeagues(
      "RANKED_SOLO_5x5",
      "oce"
    );
    const challengerLeagues = api.league.challengerLeagues(
      "RANKED_SOLO_5x5",
      "oce"
    );

    const leagues = await Promise.all([
      masterLeagues,
      grandmasterLeagues,
      challengerLeagues,
    ]).then((leagues) => [
      ...leagues[0].entries,
      ...leagues[1].entries,
      ...leagues[2].entries,
    ]);

    // sort
    const s = (a: LeagueItemDTO[]): LeagueItemDTO[] => {
      if (a.length <= 1) {
        return a;
      }

      var p = a[0];

      var l = [],
        r = [];

      for (var i = 1; i < a.length; i++) {
        a[i].leaguePoints < p.leaguePoints ? l.push(a[i]) : r.push(a[i]);
      }

      return s(l).concat(p, s(r));
    };

    const sorted = s(leagues);
    const findRaaz = sorted.findIndex(
      (p) => p.summonerId === WHYNOT_SUMMONERID
    );

    if (findRaaz === -1) {
      this.client.say(
        channel,
        "Auto update requires master+ please run !setditto"
      );
      Logger.debug("Update unique has been triggered");

      return Promise.resolve();
    }

    this.client.say(
      channel,
      "This command is unfinished, if you're seeing this message it means I can continue with development lmk"
    );

    Logger.debug("Update unique has been triggered");
    return Promise.resolve();
  }
}
