import { ChannelT, UserStateT, MessageT, SelfT } from "../../command/contract";

export interface OnMessageHandler {
  (
    channel: ChannelT,
    userstate: UserStateT,
    message: MessageT,
    self: SelfT
  ): Promise<any>;
}

export interface ClientInterface {
  connect(): Promise<[string, number]>;
}
