import { Logger } from "../../../utils";
import { ClientInterface } from "../client/contract";
import {
  ChannelT,
  MessageT,
  Ordinary,
  SelfT,
  Status,
  Unique,
  UserStateT,
} from "./contract";
import fetchUniques from "./uniques";
import fetchOrdinaries from "./ordinaries";

export default class CommandRouter {
  private client: ClientInterface;
  private ordinaries: Ordinary[];
  private uniques: Unique[];

  static async create(client: ClientInterface): Promise<CommandRouter> {
    const uniqueModuleList: Unique[] = await fetchUniques();
    Logger.debug("Injected Uniques into Router");
    const orindaryModuleList: Ordinary[] = await fetchOrdinaries();
    Logger.debug("Injected Ordinaries into Router");

    Logger.info("Router initalized :: Master");
    return new this(client, uniqueModuleList, orindaryModuleList);
  }

  constructor(
    client: ClientInterface,
    uniques: Unique[],
    ordinaries: Ordinary[]
  ) {
    this.client = client;
    this.uniques = uniques;
    this.ordinaries = ordinaries;
  }

  public async routeMessage(
    channel: ChannelT,
    userstate: UserStateT,
    message: MessageT,
    self: SelfT
  ): Promise<[Status.OK] | [Status.IGNORE] | [Status.ERR, string]> {
    const unique = this.findUnique(message);

    if (!unique) {
      const ordinary = this.findOrdinary(message);

      if (!ordinary) return [Status.IGNORE];
      else {
        await ordinary.run(channel, userstate, message, self);

        return [Status.OK];
      }
    }

    try {
      await unique.run(channel, userstate, message, self);

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

    if (!Module) return null;

    return new Module!(this.client);
  }
}
