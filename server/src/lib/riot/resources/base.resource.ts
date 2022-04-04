import type { DahvidClient } from "../client";

export class BaseResource {
  protected readonly _client: DahvidClient;

  /**
   * @internal
   */
  constructor(client: DahvidClient) {
    this._client = client;
  }
}
