// This kinda connects to src/lib/database
// essentially each command gets access to an object called {data} they can read and write to on firebase
import { doc, setDoc } from "firebase/firestore";
import { DatabaseClient } from "../database";

interface OptionsT {
  cache: any[];

  /**
   * the time in which the queue will execute
   * defaults to every five minutes
   */
  update_frequency: number;
}

interface LocalCommandType {
  data: {
    ignoredRuns: number;
    failedRuns: number;
    successfulRuns: number;

    [key: string]: number;
  };
  id: string;

  [key: string]: any;
}

export class Analytics {
  private readonly cloud: DatabaseClient;
  private readonly options: Partial<OptionsT>;
  private queue: string[] = [];
  private local: any[];

  public static async create(
    database: DatabaseClient,
    options?: Partial<OptionsT>
  ) {
    const data = await database.fetchCollection("analytics");
    return new this(database, {
      ...options,
      cache: data,
    });
  }

  constructor(database: DatabaseClient, options: Partial<OptionsT>) {
    this.cloud = database;
    this.local = options.cache || [];
    this.options = options;

    this.startQueue();
  }

  private async record(key: string, commandId: string) {
    // update the analytics
    const index = this.local.findIndex((item) => item.id == commandId);

    // initalise command
    if (index < 0) return this.initalize(key, commandId);

    this.local[index]["data"][key] += 1;

    if (!this.queue.includes(commandId)) this.queue.push(commandId);
  }

  private initalize(key: string, commandId: string) {
    const local_template: LocalCommandType = {
      data: {
        ignoredRuns: 0,
        failedRuns: 0,
        successfulRuns: 0,
      },
      id: commandId,
    };

    local_template["data"][key] += 1;

    this.local.push(local_template);
    this.queue.push(commandId);
  }

  public successfulRun(commandId: string) {
    this.record("successfulRuns", commandId);
  }

  public ignoredRun(commandId: string) {
    this.record("ignoredRuns", commandId);
  }

  public failedRun(commandId: string) {
    this.record("failedRuns", commandId);
  }

  private executeQueue() {
    // execute the queue
    this.queue.forEach((commandId) => {
      const index = this.local.findIndex(
        (item: LocalCommandType) => item.id === commandId
      );

      this.persist(commandId, this.local[index]);
    });

    // reset the queue
    this.queue = [];
  }

  private persist(commandId: string, data: LocalCommandType) {
    const documentReference = doc(this.cloud.getDb(), "analytics", commandId);

    setDoc(documentReference, data.data);
  }

  private startQueue() {
    const FIVE_MINUTES = 1000 * 60 * 5;

    setInterval(
      () => this.executeQueue(),
      this.options.update_frequency || FIVE_MINUTES
    );
  }
}

export default Analytics;
