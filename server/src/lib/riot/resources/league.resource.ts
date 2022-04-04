import { BaseResource } from "./base.resource";
import {
  LeagueEntryDTO,
  LeagueListDTO,
  Queue,
  Division,
  Tier,
} from "../models";
import { createExactphantomstring, exactphantomstring, Region } from "../types";

/**
 * Utilities to help obtain league entries by an identifier provided (region specific).
 *
 * @category Resource
 */
export class LeagueResource extends BaseResource {
  private readonly ENDPOINT_VERSION: exactphantomstring<2> =
    createExactphantomstring("v4", 2);

  /**
   * Obtains the current endpoint version that DahvidClient is requesting too
   *
   * @example
   * // returns "v4"
   *
   * @returns { exactphantomstring<2> } endpoint version
   */
  public version(): exactphantomstring<2> {
    return this.ENDPOINT_VERSION;
  }

  /**
   * Get the challenger league for given queue.
   *
   * @param { Queue } queue Queue (Filter)
   * @param { Region } region Region to execute request to
   * @returns { Promise<LeagueListDTO> }
   */
  public async challengerLeagues(
    queue: Queue,
    region: Region
  ): Promise<LeagueListDTO> {
    return await this._client._apiCall<LeagueListDTO>({
      path: `/lol/league/v4/challengerleagues/by-queue/${queue}`,
      region,
    });
  }

  /**
   * Get the grandmaster league of a specific queue.
   *
   * @param { Queue } queue Queue (Filter)
   * @param { Region } region Region to execute request to
   * @returns { Promise<LeagueListDTO> }
   */
  public async grandmasterLeagues(
    queue: Queue,
    region: Region
  ): Promise<LeagueListDTO> {
    return await this._client._apiCall<LeagueListDTO>({
      path: `/lol/league/v4/grandmasterleagues/by-queue/${queue}`,
      region,
    });
  }

  /**
   * Get the master league for given queue.
   *
   * @param { Queue } queue Queue (Filter)
   * @param { Region } region Region to execute request to
   * @returns { Promise<LeagueListDTO> }
   */
  public async masterLeagues(
    queue: Queue,
    region: Region
  ): Promise<LeagueListDTO> {
    return await this._client._apiCall<LeagueListDTO>({
      path: `/lol/league/v4/masterleagues/by-queue/${queue}`,
      region,
    });
  }

  /**
   * Get league with given ID, including inactive entries.
   *
   * @param { string } leagueId Get league with given ID, including inactive entries.
   * @param { Region } region Region to execute request to
   * @returns { Promise<LeagueListDTO> }
   */
  public async byLeagueId(
    leagueId: string,
    region: Region
  ): Promise<LeagueListDTO> {
    return await this._client._apiCall<LeagueListDTO>({
      path: `/lol/league/v4/leagues/${leagueId}`,
      region,
    });
  }

  /**
   * Get league entries in all queues for a given summoner ID.
   *
   * @param { string } encryptedSummonerId Summoner Identifier
   * @param { Region } region Region to execute request to
   * @returns
   */
  public async bySummonerId(
    encryptedSummonerId: string,
    region: Region
  ): Promise<LeagueEntryDTO[]> {
    return await this._client._apiCall<LeagueEntryDTO[]>({
      path: `/lol/league/v4/entries/by-summoner/${encryptedSummonerId}`,
      region,
    });
  }

  /**
   * Get all the league entries.
   *
   * @param { Queue } queue Queue (Filter)
   * @param { Tier } tier Tier (Filter)
   * @param { Division } division Divison (Filter)
   * @param { Region } region Region to execute request to
   * @returns { Promise<LeagueEntryDTO> }
   */
  public async entries(
    queue: Queue,
    tier: Tier,
    division: Division,
    region: Region
  ): Promise<LeagueEntryDTO> {
    return await this._client._apiCall<LeagueEntryDTO>({
      path: `/lol/league/v4/entries/${queue}/${tier}/${division}`,
      region,
    });
  }
}
