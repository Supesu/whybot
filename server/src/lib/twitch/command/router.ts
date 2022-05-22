import moment from "moment";
import { Logger } from "../../../utils";
import { ClientInterface } from "../client/contract";
import { Analytics } from "../../analytics";
import {
  ChannelT,
  MessageT,
  Ordinary,
  SelfT,
  Status,
  Unique,
  UniqueData,
  UserStateT,
} from "./contract";
import fetchUniques from "./uniques";
import fetchOrdinaries from "./ordinaries";
import { DahvidClient } from "dahvidclient";
import { Store } from "../../store";
import { app } from "../../api";
import { buildCustomUniques } from "./custom";
import type { Express } from "express";
import type { DatabaseClient } from "../../database";

type UniqueId = string;
type CooldownMap = {
  "{GLOBAL}": Record<UniqueId, number>;
  [userId: string]: Record<UniqueId, number>;
};

export default class CommandRouter {
  private readonly _api: DahvidClient;
  private readonly client: ClientInterface;
  private readonly database: DatabaseClient;
  private readonly app: Express;
  private analytics: Analytics;
  private storemap: Record<string, Store>;
  private ordinaries: Ordinary[];
  private uniques: Unique[];
  private cooldownmap: CooldownMap;

  static async create(
    client: ClientInterface,
    database: DatabaseClient
  ): Promise<CommandRouter> {
    const uniqueModuleList: Unique[] = await fetchUniques();
    const customUniqueModuleList: Unique[] = await buildCustomUniques(database);
    Logger.debug("Injected Uniques into Router");

    const orindaryModuleList: Ordinary[] = await fetchOrdinaries();
    Logger.debug("Injected Ordinaries into Router");

    Logger.info("Router initalized :: Master");

    return new this(
      client,
      database,
      [...uniqueModuleList, ...customUniqueModuleList],
      orindaryModuleList
    );
  }

  constructor(
    client: ClientInterface,
    database: DatabaseClient,
    uniques: Unique[],
    ordinaries: Ordinary[]
  ) {
    this.database = database;
    this.app = app;
    this.storemap = {};
    this._api = new DahvidClient({ apiKey: process.env.RIOT_API_KEY });
    this.client = client;
    this.uniques = uniques;
    this.ordinaries = ordinaries;
    this.cooldownmap = {
      "{GLOBAL}": {},
    };
    this.initalizeAnalyticsClient(database);

    this.startApi();
  }

  /**
   * @internal
   */
  private async initalizeAnalyticsClient(database: DatabaseClient) {
    this.analytics = await Analytics.create(database);
  }

  /**
   * @internal
   */
  private async startApi() {
    this.app.locals.router = this;
    this.app.locals.database = this.database;

    this.app
      .listen(process.env.PORT, () => {
        Logger.debug("Server running on port " + process.env.PORT);
      })
      .on("error", (e) => Logger.error(e.message));
  }

  public async injectUnique(unique: Unique) {
    this.uniques.push(unique);

    return;
  }

  public async fetchUniques() {
    return this.uniques;
  }

  public async unloadUnique(id: string) {
    const uniqueToReplace = await this.findUniqueById(id);
    this.uniques.splice(uniqueToReplace, 1);
  }

  public async replaceUnique(id: string, unique: Unique) {
    const uniqueToReplace = await this.findUniqueById(id);
    this.uniques.splice(uniqueToReplace, 1);

    this.uniques.push(unique);
  }

  private async findUniqueById(id: string): Promise<number> {
    return this.uniques.findIndex((u) => u.getConfig().id === id);
  }

  public async routeMessage(
    channel: ChannelT,
    userstate: UserStateT,
    message: MessageT,
    self: SelfT
  ): Promise<[Status.OK] | [Status.IGNORE] | [Status.ERR, string]> {
    if (self) return Promise.resolve([Status.IGNORE]);

    const [unique, rawunique] = this.findUnique(message);

    if (!unique) {
      const ordinary = this.findOrdinary(message);

      if (!ordinary) return [Status.IGNORE];
      else {
        await ordinary.run(channel, userstate, message, self, this._api);

        return [Status.OK];
      }
    }

    try {
      const config = rawunique.getConfig();

      // cooldown has been set
      if (this.cooldownmap["{GLOBAL}"][config.id]) {
        const now = new Date().getTime();

        if (this.cooldownmap["{GLOBAL}"][config.id] < now) {
          delete this.cooldownmap["{GLOBAL}"][config.id];
        } else {
          const cooldownLeft = moment(
            new Date(this.cooldownmap["{GLOBAL}"][config.id])
          ).from(new Date());

          this.client.say(
            channel,
            `You can run this command again ${cooldownLeft}`
          );
          return Promise.resolve([Status.IGNORE]);
        }
      }

      if (config.cooldown) {
        // test whether or not to apply globally
        if (config.cooldown.global) {
          const now = new Date().getTime();
          this.cooldownmap["{GLOBAL}"][config.id] = now + config.cooldown.time;
        } else {
          // individually apply cooldown
          //TODO: Implement this
        }
      }

      if (config.store && !this.storemap[config.storeId || config.id])
        this.storemap[config.storeId || config.id] = await Store.create(
          this.database,
          {
            ...config.storeOptions,
            id: config.storeId || config.id,
          }
        );

      const uniqueData: UniqueData = {
        channel,
        userstate,
        message,
        self,
        api: this._api,
        metadata: this.uniques,
        store: this.storemap[config.storeId || config.id],
      };

      const status = await unique.run(uniqueData);

      switch (status) {
        case Status.IGNORE:
          this.analytics.ignoredRun(config.id);
          delete this.cooldownmap["{GLOBAL}"][config.id];
          break;
        case Status.ERR:
          this.analytics.failedRun(config.id);
          break;
        case Status.OK:
          this.analytics.successfulRun(config.id);
          break;
      }

      return [Status.OK];
    } catch (e: any) {
      return [Status.ERR, e.message];
    }
  }

  private findOrdinary(message: string): any {
    const Module = this.ordinaries.find((mod) => mod.test(message));

    if (!Module) return null;

    // Bind client ;
    return new Module!(this.client);
  }

  private findUnique(message: string): any {
    const Module = this.uniques.find((UniqueModule) =>
      UniqueModule.test(message)
    );

    if (!Module) return [null, null];

    return [new Module!(this.client), Module];
  }
}
