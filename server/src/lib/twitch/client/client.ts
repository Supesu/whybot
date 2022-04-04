// External Imports
import { Client as TmiClient } from "tmi.js";

// Internal Imports
import { ClientInterface, OnMessageHandler } from "./contract";
import { Logger } from "../../../utils";

export default class Client implements ClientInterface {
  client: TmiClient;

  constructor(client: TmiClient) {
    this.client = client;
    Logger.info("Created Client Instance :: Master");
  }

  connect(): Promise<[string, number]> {
    return this.client.connect();
  }

  say(channel: string, message: string): Promise<[string]> {
    return this.client.say(channel, message);
  }

  handleMessage(handler: OnMessageHandler) {
    this.client.on("message", handler);
    Logger.debug("Binded Message Handler To Client")
  }

  getPing() {
    return this.client.ping();
  }
}
