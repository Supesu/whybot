import { BaseUnique, UserStateT } from "../../contract";
import { compileTriggers, Logger } from "../../../../../utils";
import type { DahvidClient, Region } from "dahvidclient";
import { regionMap, regionToContinentMap } from "dahvidclient";

export default class SearchUnique extends BaseUnique {
  static UNIQUE_TRIGGERS = ["{PREFIX}search"];

  public static getConfig() {
    return {
      data: {
        response: "{CUSTOM_RESPONSE}",
        triggers: this.UNIQUE_TRIGGERS,
        type: "inbuilt",
      },
      metadata: {
        description:
          "Search how many games a user has played in last {X} hours",
      },
      id: "MgAF0ODdYi9uD2FMQsEc",
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
    message: string,
    _self: boolean,
    api: DahvidClient
  ): Promise<void> {
    Logger.debug("Attempting to trigger Search unique");

    var [_trigger, _hours, ..._message] = message.split(" ");
    var region = _message.pop();
    var summonerName = _message.join(" ").replaceAll("\"", ""); // this is to handle names with spaces lol (better than "")

    var hours = Number(_hours);

    if (!region) region = "OCE";

    if (!_hours || !summonerName) {
      this.client.say(
        channel,
        "USAGE: {PREFIX}search {hours} {summonerName} {region}".replace(
          "{PREFIX}",
          process.env.PREFIX
        )
      );
      return Promise.resolve();
    }

    if (isNaN(hours)) {
      this.client.say(channel, "Hours must be a number");
      return Promise.resolve();
    }

    if (hours > 24) {
      this.client.say(channel, "I cannot search past 24 hours!");
      return Promise.resolve();
    }

    if (!regionMap[region.toLowerCase()]) {
      this.client.say(channel, "invalid region (Example: OCE)!");
      return Promise.resolve();
    }

    const continent = regionToContinentMap[region.toLowerCase()];
    const encryptedPuuid = await api.summoner
      .byName(summonerName, region as Region)
      .then((data) => data.puuid)
      .catch(() => "");

    if (!encryptedPuuid) {
      this.client.say(
        channel,
        `User "${summonerName}" does not exist in region ${region.toUpperCase()}`
      );
      return Promise.resolve();
    }

    const X_HOURS = 60 * 60 * hours; // 60 * 60 = 3600 seconds in an hour
    const CURRENT_TIME = new Date().getTime() / 1000; // current epoch time (in milliseconds so we divide by 1000)
    const SEARCH_RANGE = (CURRENT_TIME - X_HOURS) | 0; // || 0 rounds down
    const playedInXHoursCount = await api.match
      .byPuuid(encryptedPuuid, continent, {
        startTime: SEARCH_RANGE,
        queue: 420, // RANKED = 420
        count: 100,
      })
      .then((data) => data.length)
      .catch((_err) => console.log("something went wrong (api.match.byPuuid)"));

    this.client.say(
      channel,
      `"${summonerName}" (${region.toUpperCase()}) has played ${playedInXHoursCount} ranked matches in the last ${hours} hours`
    );

    Logger.debug("Search unique has been triggered");
    return Promise.resolve();
  }
}
