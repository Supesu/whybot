import {
  BaseOrdinary,
  ChannelT,
  MessageT,
  SelfT,
  UserStateT,
} from "../../contract";
import { Logger } from "../../../../../utils";
import type { DahvidClient } from "dahvidclient";

export default class TestOrdinary extends BaseOrdinary {
  //! no {PREFIX} | Ordinaries triggers cannot compile.
  static ORDINARY_TRIGGERS: string[] = ["0xf400"];

  public static test(message: string): boolean {
    return !!this.ORDINARY_TRIGGERS.find((x) => message.includes(x));
  }

  public async run(
    channel: ChannelT,
    _userstate: UserStateT,
    _message: MessageT,
    _self: SelfT,
    _api: DahvidClient
  ): Promise<void> {
    Logger.debug("Attempting to trigger Ordinary command");
    this.client.say(channel, "HAHA ur so cringe");
    Logger.debug("Test Ordinary has been triggered");
    return Promise.resolve();
  }
}
