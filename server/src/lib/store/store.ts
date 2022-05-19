// This kinda connects to src/lib/database
// essentially each command gets access to an object called {data} they can read and write to on firebase
// kinda shitty but oh well ig lol
import { DatabaseClient } from "../database";

interface OptionsT {
  persist?: boolean;
  cache?: Record<string, any>;
  id: string;
}

export class Store {
  private readonly cloud: DatabaseClient;
  private readonly options: OptionsT;
  private local: Record<string, any>;

  public static async create(database: DatabaseClient, options: OptionsT) {
    const data = await database.retrieveStoreFromCloud("store", options.id);
    return new this(database, { ...options, cache: data });
  }

  constructor(database: DatabaseClient, options: OptionsT) {
    this.cloud = database;
    this.local = options.cache || {};
    this.options = options;
  }

  /**
   * @example write("users", []);
   */
  public write(key: string, data: any): boolean {
    this.local[key] = data;
    return true;
  }

  public read(key: string): any {
    return this.local[key];
  }

  public async persist() {
    this.cloud.storeInCollectionWithId(`store`, this.options.id, this.local);
  }
}

export default Store;
