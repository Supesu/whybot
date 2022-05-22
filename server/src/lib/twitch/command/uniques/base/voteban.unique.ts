import { BaseUnique, Status, UniqueData } from "../../contract";
import { compileTriggers, Logger } from "../../../../../utils";

const FIVE_MINUTES = 1000 * 60 * 5; // 5 minutes in ms
const THIRTY_MINUTES = 1000 * 60 * 30;
const ONE_MINUTE = 1000 * 60;
const THREE_MINUTES = 1000 * 60 * 3;

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

  public async run({
    channel,
    userstate,
    message,
    store,
  }: UniqueData): Promise<Status> {
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

    const interval = setInterval(() => {
      this.client.say(
        channel,
        `${
          userstate["display-name"]
        } has started a vote against ${target} for the reason "${reason.join(
          " "
        )}" | Vote with !agree or !disagree`
      );
    }, ONE_MINUTE);

    setTimeout(async () => {
      const end_weight = store.read("weight");
      clearInterval(interval);
      store.write("isVoteInProgress", false);

      if (end_weight > 0) {
        this.client
          .timeout(
            channel,
            target,
            THIRTY_MINUTES / 1000,
            `${reason} | VOTEBAN`
          )
          .then(() => {
            this.client.say(
              channel,
              `The voteban against ${target} was sucessful`
            );
          })
          .catch((err) => {
            console.error(err);
          });
      } else {
        this.client.say(
          channel,
          `The voteban against ${target} was not successful`
        );
        //TODO:
      }
    }, THREE_MINUTES);

    Logger.debug("VoteBan unique has been triggered");
    return Promise.resolve(Status.OK);
  }
}
