import { BaseUnique, Status, UniqueData } from "../../contract";
import { compileTriggers, Logger } from "../../../../../utils";

export default class AgreeUnique extends BaseUnique {
  static UNIQUE_TRIGGERS = ["{PREFIX}agree", "{PREFIX}yes"];
  static INCREMENT_COUNT = 1;

  public static getConfig() {
    return {
      data: {
        response: "{CUSTOM_RESPONSE}",
        triggers: this.UNIQUE_TRIGGERS,
        type: "inbuilt",
      },
      metadata: {
        description: "vote yes for a voteban",
      },
      store: true,
      storeId: "7DZI6PLtFp65NuJIwDhe",
      id: "gprWfgq55FOvOp8dmndj",
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
    store
  }: UniqueData): Promise<Status> {
    Logger.debug("Attempting to trigger Agree unique");

    // test if vote is in progress
    if (!store.read("isVoteInProgress")) {
      this.client.say(channel, "There is not currently a vote in progress");
      return Promise.resolve(Status.IGNORE);
    }

    // test if user has already voted :D
    const usersThatHaveVoted: string[] = store.read("users");
    const userHasVoted = usersThatHaveVoted.includes(
      userstate["display-name"]!.toLowerCase()
    );

    if (userHasVoted) {
      this.client.say(channel, "You have already voted");
      return Promise.resolve(Status.IGNORE);
    }

    // change the weight
    const current_weight = store.read("weight");
    const new_weight = current_weight + AgreeUnique.INCREMENT_COUNT;

    store.write("weight", new_weight);

    usersThatHaveVoted.push(userstate["display-name"]!.toLowerCase());
    store.write("users", usersThatHaveVoted);

    // refer to user vote has been counted
    this.client.say(channel, "Your vote has been counted");

    Logger.debug("Agree unique has been triggered");
    return Promise.resolve(Status.OK);
  }
}
