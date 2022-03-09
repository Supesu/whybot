// External Imports
import { Options } from "tmi.js";

// Internal Imports
import { Logger } from "../utils";

// Typings
type UsernameT = string;
type PasswordT = string;
type ChannelT = string;
type OptionsT = {
  debug: boolean;
};
type JsonT = {
  username: UsernameT;
  password: PasswordT;
  channels: ChannelT[];
  options: OptionsT;
};

class Config {
  private username: UsernameT;
  private password: PasswordT;
  private channels: ChannelT[];
  private options: OptionsT;

  static createConfigFromEnv(
    env: NodeJS.ProcessEnv,
    channels: ChannelT[]
  ): Config {
    const isValid = (item: string) => typeof item === "string" && item;

    const username = env.TWITCH_USERNAME;
    const password = env.TWITCH_PASSWORD;
    const debug = env.TWITCH_DEBUG === "true";

    if (!isValid(username) && !isValid(password)) {
      Logger.fatal("Failed Validation");
      process.exit(); // should exit before, but just incase
    }

    return new this(username, password, channels, { debug });
  }

  constructor(
    username: UsernameT,
    password: PasswordT,
    channels: ChannelT[],
    options: Partial<OptionsT>
  ) {
    this.username = username;
    this.password = password;
    this.channels = channels;
    this.options = {
      debug: options?.debug || false,
    };
  }

  public getUsername(): UsernameT {
    return this.username;
  }

  private getPassword(): PasswordT {
    return this.password;
  }

  public getChannels(): ChannelT[] {
    return this.channels;
  }

  public isDebug(): boolean {
    return !!this.options.debug;
  }

  public getOptions(): OptionsT {
    return this.options;
  }

  public convertToTmi(): Options {
    return {
      options: { debug: this.isDebug() },
      connection: {
        reconnect: true,
        secure: true,
      },
      identity: {
        username: this.getUsername(),
        password: this.getPassword(),
      },
      channels: this.getChannels(),
    };
  }
  
  public convertToJson(): JsonT {
    return {
      channels: this.getChannels(),
      options: this.getOptions(),
      password: this.getPassword(),
      username: this.getUsername(),
    };
  }
}

export default Config;
