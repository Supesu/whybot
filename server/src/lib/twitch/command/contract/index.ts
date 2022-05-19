// External Imports
import { Logger } from "../../../../utils";
import { ChatUserstate } from "tmi.js";
import { ClientInterface } from "../..";
import { DahvidClient } from "dahvidclient";
import { Store } from "../../../store";

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

export interface UniqueMetaData {
  description: string;
}

export interface UniqueInterface {
  run(
    channel: string,
    userstate: UserStateT,
    message: string,
    self: boolean,
    api: DahvidClient,
    metadata: Unique[],
    store: Store
  ): void;
}

export interface UniqueConfig {
  data: {
    response?: string;
    triggers: string[];
    summonerId?: string;
    type: string;
    region?: string;
  };
  id: string;
}
export class BaseUnique implements UniqueInterface {
  client: ClientInterface;

  static test(_message: string): boolean {
    return false;
  }

  static getConfig(): UniqueConfig {
    return {} as UniqueConfig;
  }

  constructor(client: ClientInterface) {
    this.client = client;
  }

  run(
    _channel: string,
    _userstate: UserStateT,
    _message: string,
    _self: boolean,
    _api: DahvidClient,
    _metadata: Unique[],
    _store: Store
  ): Promise<Status.IGNORE | Status.ERR | Status.OK> {
    return Promise.reject(Logger.fatal("This method needs to be implemented"));
  }
}

export interface OrdinaryInterface {}

export class BaseOrdinary implements OrdinaryInterface {
  client: ClientInterface;

  static test(_message: string): boolean {
    return false;
  }

  constructor(client: ClientInterface) {
    this.client = client;
  }

  run(
    _channel: ChannelT,
    _userstate: UserStateT,
    _message: MessageT,
    _self: SelfT,
    _api: DahvidClient
  ): Promise<Status.IGNORE | Status.ERR | Status.OK> {
    return Promise.reject(Logger.fatal("This method needs to be implemented"));
  }
}
