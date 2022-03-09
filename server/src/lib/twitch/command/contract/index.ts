// External Imports
import { ChatUserstate } from "tmi.js";

export enum Status {
  OK = 200,
  IGNORE = 204,
  ERR = 500,
}

export type ChannelT = String;
export type UserStateT = ChatUserstate;
export type Unique = any;
export type Ordinary = any;
export type MessageT = string;
export type SelfT = boolean;
export type Flag = number;
export type ResponseT = Promise<
  [Status.OK] | [Status.IGNORE] | [Status.ERR, string]
>;
