// External Imports
import { Logger } from "../../../../utils";
import type { ChatUserstate } from "tmi.js";
import type { ClientInterface } from "../..";
import type { DahvidClient } from "dahvidclient";
import type { Store } from "../../../store";

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

export type UniqueData = {
  channel: string;
  userstate: UserStateT;
  message: string;
  self: boolean;
  api: DahvidClient;
  metadata: Unique[];
  store: Store;
};

export interface UniqueMetaData {
  description: string;
}

export interface UniqueInterface {
  run(data: UniqueData): void;
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

  run(_data: UniqueData): Promise<Status.IGNORE | Status.ERR | Status.OK> {
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
