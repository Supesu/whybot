import { BaseUnique, UserStateT, Unique, Status } from "../../contract";
import { Store } from "../../../../store";
import { compileTriggers, Logger } from "../../../../../utils";
import type { DahvidClient } from "dahvidclient";

const FIVE_MINUTES = 1000 * 60 * 5; // 5 minutes in ms
const FOURTY_SECONDS = 1000 * 40;

export default class VoteBanUnique extends BaseUnique {
  static UNIQUE_TRIGGERS = ["{PREFIX}startvote", "{PREFIX}voteban"];

  public static getConfig() {
    return {
      data: {
        response: "{CUSTOM_RESPONSE}",
        triggers: this.UNIQUE_TRIGGERS,
        type: "inbuilt",
      },
      cooldown: {
        global: true,
        time: FIVE_MINUTES,
      },
      store: true,
      metadata: {
        description: "Start a voteban against another individual",
      },
      id: "7DZI6PLtFp65NuJIwDhe",
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
    message: string,
    _self: boolean,
    _api: DahvidClient,
    _metadata: Unique[],
    store: Store
  ): Promise<Status> {
    Logger.debug("Attempting to trigger VoteBan unique");
    var [_trigger, target, ...reason] = message.split(" ");

    const voteInProgress = store.read("isVoteInProgress");
    if (voteInProgress) {
      this.client.say(channel, "A vote is currently in progress");

      return Promise.resolve(Status.IGNORE);
    }

    // no target & reason
    if ((!target && reason.length == 0) || !target.includes("@")) {
      this.client.say(
        channel,
        "{PREFIX}voteban @{USER} {REASON}".replace(
          "{PREFIX}",
          process.env.PREFIX
        )
      );
      return Promise.resolve(Status.IGNORE);
    }

    // no target
    if (!target) {
      this.client.say(channel, "{USER} is a required field");
      return Promise.resolve(Status.IGNORE);
    }

    // no reason
    if (reason.length == 0) {
      this.client.say(channel, "{REASON} is a required field");
      return Promise.resolve(Status.IGNORE);
    }

    this.client.say(
      channel,
      `${
        userstate["display-name"]
      } has started a vote against ${target} for the reason "${reason.join(
        " "
      )}" | Vote with !agree or !disagree`
    );

    store.write("isVoteInProgress", true);
    store.write("weight", 0);
    store.write("users", []);
    setTimeout(() => {
      const end_weight = store.read("weight");
      store.write("isVoteInProgress", false);

      if (end_weight > 0) {
        this.client
          .ban(channel, target, "voteban command | success")
          .then(() => {
            this.client.say(
              channel,
              `${target} was banned after losing the vote.`
            );
          })
          .catch(() => {});
      } else {
        this.client.say(channel, "The voteban was not successful");
        //TODO:
      }
    }, FOURTY_SECONDS);

    Logger.debug("VoteBan unique has been triggered");
    return Promise.resolve(Status.OK);
  }
}
