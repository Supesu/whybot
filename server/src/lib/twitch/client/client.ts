// External Imports
import { Client as TmiClient } from "tmi.js";

// Internal Imports
import { ClientInterface, OnMessageHandler } from "./contract";
import { Logger } from "../../../utils";

export default class Client implements ClientInterface {
  client: TmiClient;

  constructor(client: TmiClient, onMessage: OnMessageHandler) {
    this.client = client;
    Logger.debug("Initalized Client");

    this.client.on("message", onMessage)
    Logger.debug("Binded Message Handler To Client")
  }

  connect(): Promise<[string, number]> {
    return this.client.connect();
  }

  say(channel: string, message: string): Promise<[string]> {
    return this.client.say(channel, message);
  }
}
