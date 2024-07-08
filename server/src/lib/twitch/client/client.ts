// External Imports
import type { Client as TmiClient } from "tmi.js";

// Internal Imports
import type { ClientInterface, OnMessageHandler } from "./contract";
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

  ban(
    channel: string,
    username: string,
    reason: string
  ): Promise<[string, string, string]> {
    return this.client.ban(channel, username, reason);
  }

  startListeners() {
    this.client.on("disconnected", (err) => {
      console.log(err);
      Logger.warn("Lost connection to twitch");
    });

    this.client.on("reconnect", () => {
      Logger.info("Reconnected to twitch");
    });
  }

  timeout(
    channel: string,
    username: string,
    length: number,
    reason: string
  ): Promise<[string, string, number, string]> {
    return this.client.timeout(channel, username, length, reason);
  }

  handleMessage(handler: OnMessageHandler) {
    this.client.on("message", handler);
    Logger.debug("Binded Message Handler To Client");
  }

  getPing() {
    return this.client.ping();
  }
}
