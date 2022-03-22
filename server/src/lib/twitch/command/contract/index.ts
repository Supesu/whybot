// External Imports
import { Logger } from "../../../../utils";
import { ChatUserstate } from "tmi.js";
import { ClientInterface } from "../..";

export enum Status {
  OK = 200,
  IGNORE = 204,
  ERR = 500,
}

export type ChannelT = string;
export type UserStateT = ChatUserstate;
export type Unique = any;
export type Ordinary = any;
export type MessageT = string;
export type SelfT = boolean;
export type Flag = number;
export type ResponseT = Promise<
  [Status.OK] | [Status.IGNORE] | [Status.ERR, string]
>;

export interface UniqueInterface {
  run(
    channel: string,
    userstate: UserStateT,
    message: string,
    self: boolean,
    timeoutCache: any,
  ): void;
}

export class BaseUnique implements UniqueInterface {
  client: ClientInterface;

  static test(_message: string): boolean {
    return false;
  }

  constructor(client: ClientInterface) {
    this.client = client;
  }

  run(
    _channel: string,
    _userstate: UserStateT,
    _message: string,
    _self: boolean,
  ): Promise<void> {
    return Promise.reject(Logger.fatal("This method needs to be implemented"));
  }
}

export interface OrdinaryInterface {

}

export class BaseOrdinary implements OrdinaryInterface {
  client: ClientInterface;

  static test(_message: string): boolean {
    return false;
  }

  constructor (client: ClientInterface) {
    this.client = client;
  }

  run(
    _channel: ChannelT,
    _userstate: UserStateT,
    _message: MessageT,
    _self: SelfT, 
  ): Promise<void> {
    return Promise.reject(Logger.fatal("This method needs to be implemented"));
  }
}