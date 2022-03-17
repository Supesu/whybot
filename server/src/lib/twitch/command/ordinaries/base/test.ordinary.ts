import {
  BaseOrdinary,
  ChannelT,
  MessageT,
  SelfT,
  UserStateT,
} from "../../contract";
import { Logger } from "../../../../../utils";

export default class TestOrdinary extends BaseOrdinary {
  //! no {PREFIX} | Ordinaries triggers cannot compile.
  static ORDINARY_TRIGGERS: string[] = ["0xf500"];

  public static test(message: string): boolean {
    return !!this.ORDINARY_TRIGGERS.find((x) => message.includes(x));
  }

  public async run(
    channel: ChannelT,
    _userstate: UserStateT,
    _message: MessageT,
    _self: SelfT
  ): Promise<void> {
    Logger.debug("Attempting to trigger Ordinary command");

    this.client.say(channel, "XD");
    Logger.debug("Test Ordinary has been triggered");
    return Promise.resolve();
  }
}
