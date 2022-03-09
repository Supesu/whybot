// Internal Imports
import { Logger } from "../../../utils";
import {
  ChannelT,
  Flag,
  MessageT,
  Ordinary,
  ResponseT,
  SelfT,
  Status,
  Unique,
  UserStateT,
} from "./contract";

import fetchUniques from "./uniques";

// TODO: Inject Router > Inject Router into uniques. > Inject Router into ordinaries
class Router {
  private FLAGS: Flag[];
  private Uniques: Unique[];
  private Ordinaries: Ordinary[];

  static createRouter(): Router {
    const FLAGS = process.env.FLAGS.split(",").map((i: string) => parseInt(i));
    if (FLAGS.includes(0xe9000)) {
      Logger.fatal("0xe9000 detected :: Master");
    }

    Logger.info("Created Router Instance :: Master");
    return new this(FLAGS);
  }

  constructor(flags: Flag[]) {
    Logger.debug("Flags injected");
    this.FLAGS = flags;

    this.Uniques = [];
    this.loadUniques();

    Logger.debug("Ordinaries Injected");
    this.Ordinaries = this.loadOrdinaries();
  }

  private async loadUniques(): Promise<Unique[]> {
    const localUniques = await fetchUniques();

    this.Uniques = [];
    Logger.debug("Uniques Injected");

    return [localUniques];
  }

  private loadOrdinaries(): Ordinary[] {
    return [] as Ordinary[];
  }

  private findOrdinary(message: MessageT): Ordinary {
    if (this.Ordinaries.length <= 0) {
      return Logger.fatal("No Ordinaries Loaded");
    }

    return this.Ordinaries.find((Ordinary) => Ordinary.test(message));
  }

  private executeUnique(unique: Unique): ResponseT {
    if (!unique) return Promise.resolve([Status.ERR, "Unique Not Provided"]);
    return Promise.resolve([Status.OK]);
  }

  private async executeOrIgnoreOrdinary(
    channel: ChannelT,
    userstate: UserStateT,
    message: MessageT,
    self: SelfT
  ): ResponseT {
    if (this.FLAGS.includes(0xfe833)) return [Status.ERR, "0xfe833 Detected!"];

    const Orindary = this.findOrdinary(message);

    if (!Orindary) return [Status.IGNORE];

    try {
      await Orindary.run(channel, userstate, message, self);

      return [Status.OK];
    } catch (e: any) {
      return [Status.ERR, e.message];
    }
  }

  public exectueOrIgnore(
    channel: ChannelT,
    userstate: UserStateT,
    message: MessageT,
    self: SelfT
  ): ResponseT {
    const unique = this.Uniques.find((Unique) => Unique.test(message));

    if (!unique) {
      return this.executeOrIgnoreOrdinary(channel, userstate, message, self);
    }

    return this.executeUnique(unique);
  }
}

export default Router;
