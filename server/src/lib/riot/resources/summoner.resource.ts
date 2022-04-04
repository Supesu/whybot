// TODO: finish generic functions in client;
// TODO: finish summoner resource and test

import { BaseResource } from "./base.resource";
import { SummonerResponse } from "../models";
import { createExactphantomstring, exactphantomstring, Region } from "../types";

/**
 * Utilities to help obtain the summoner information by an identifier provided (region specific).
 *
 * @category Resource
 */
export class SummonerResource extends BaseResource {
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
   * Obtain summoner information using the summoners name
   *
   * @param { string } summonerName Summoner Identifier
   * @param { Region } region Region to execute request to
   * @returns { Promise<SummonerResponse> } Summoner information | StatusError | AxiosError
   */
  public async byName(
    summonerName: string,
    region: Region
  ): Promise<SummonerResponse> {
    return await this._client._apiCall<SummonerResponse>({
      path: `/lol/summoner/v4/summoners/by-name/${summonerName}`,
      region,
    });
  }

  /**
   *Obtain summoner information using the encrypted puuid (not region specific)
   *
   * @param encryptedPUUID Summoner Identifier
   * @param region Region to execute request to
   * @returns { Promise<SummonerResponse> } Summoner information | StatusError | AxiosError
   */
  public async byPuuid(
    encryptedPUUID: string,
    region: Region
  ): Promise<SummonerResponse> {
    return await this._client._apiCall<SummonerResponse>({
      path: `/lol/summoner/v4/summoners/by-puuid/${encryptedPUUID}`,
      region,
    });
  }

  /**
   * Obtain summoner information using the encrypted account id
   *
   * @param encryptedAccountId Summoner Identifier
   * @param region Region to execute request to
   * @returns { Promise<SummonerResponse> } Summoner information | StatusError | AxiosError
   */
  public async byAccount(
    encryptedAccountId: string,
    region: Region
  ): Promise<SummonerResponse> {
    return await this._client._apiCall<SummonerResponse>({
      path: `/lol/summoner/v4/summoners/by-account/${encryptedAccountId}`,
      region,
    });
  }

  /**
   * Obtain summoner information using the encrypted summoner id
   *
   * @param encryptedSummonerId Summoner Identifier
   * @param region Region to execute request to
   * @returns { Promise<SummonerResponse> } Summoner information | StatusError | AxiosError
   */
  public async bySummonerId(
    encryptedSummonerId: string,
    region: Region
  ): Promise<SummonerResponse> {
    return await this._client._apiCall<SummonerResponse>({
      path: `/lol/summoner/v4/summoners/${encryptedSummonerId}`,
      region,
    });
  }

  /**
   * @deprecated Dahvidclient does not support this method any longer and should not be called
   */
  public async me() {
    throw new Error(
      "DahvidClient no longer supports summoner.me() please don't call this method"
    );
  }
}
