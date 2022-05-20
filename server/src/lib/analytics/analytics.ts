// This kinda connects to src/lib/database
// essentially each command gets access to an object called {data} they can read and write to on firebase
import { doc, WriteBatch } from "firebase/firestore";
import { DatabaseClient } from "../database";

interface OptionsT {
  cache: any[];

  // milliseconds
  update_frequency: number;
}

const FIVE_MINUTES = 1000 * 60 * 5;
export class Analytics {
  private readonly cloud: DatabaseClient;
  private readonly options: Partial<OptionsT>;
  private batch: WriteBatch;
  private local: any[];
  private hasActiveChanges: boolean = false;

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

    database.createBatch().then((batch) => (this.batch = batch));
    this.startPersist();
  }

  public async record(key: string, commandId: string) {
    var currentIndex = this.local.findIndex(
      (analytics: any) => analytics.id === commandId
    );

    var current_analytics = this.local[currentIndex];

    // hasn't recorded analytics for unique before
    if (!current_analytics) {
      await this.cloud.injectIntoCollectionWithId("analytics", commandId, {
        data: {
          successfulRuns: 0,
          ignoredRuns: 0,
          failedRuns: 0,
        },
      });

      current_analytics = {
        data: {
          successfulRuns: 0,
          ignoredRuns: 0,
          failedRuns: 0,
        },
        id: commandId,
      };

      this.local.push(current_analytics);
    }

    const template = {
      successfulRuns:
        key === "successfulRuns"
          ? Number(current_analytics.data.successfulRuns) + 1
          : Number(current_analytics.data.successfulRuns),
      ignoredRuns:
        key === "ignoredRuns"
          ? Number(current_analytics.data.ignoredRuns) + 1
          : Number(current_analytics.data.ignoredRuns),
      failedRuns:
        key === "failedRuns"
          ? Number(current_analytics.data.failedRuns) + 1
          : Number(current_analytics.data.failedRuns),
    };

    this.addToQueue(template, commandId);
  }

  public successfulRun(commandId: string) {
    this.record("successfulRuns", commandId);
  }

  public ignoredRuns(commandId: string) {
    this.record("ignoredRuns", commandId);
  }

  public failedRun(commandId: string) {
    this.record("failedRuns", commandId);
  }

  public async addToQueue(data: Record<string, any>, commandId: string) {
    const db = this.cloud.getDb();

    const docRef = doc(db, "analytics", commandId);
    this.batch.set(docRef, data);

    this.hasActiveChanges = true;
  }

  public startPersist() {
    setInterval(() => {
      if (this.hasActiveChanges) {
        this.persist();
        this.hasActiveChanges = false;
      }
    }, this.options.update_frequency || FIVE_MINUTES);
  }

  public async persist() {
    await this.batch.commit();
  }
}

export default Analytics;
