import type { ChannelT, UserStateT, MessageT, SelfT } from "../../command/contract";

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
  getPing(): Promise<[number]>;
  say(channel: string, message: string): Promise<[string]>;
  startListeners(): void;
  timeout(channel: string, username: string, length: number, reason: string): Promise<[string, string, number, string]>;
  ban(
    channel: string ,
    username: string,
    reason: string
  ): Promise<[string, string, string]>;
}
