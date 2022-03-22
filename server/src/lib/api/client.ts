// TODO: build onNetworkError callback
// TODO: replace baseUrl region with input region on request? intercept.
// TODO: build  a generic api_call method to be used [ ]

import axios, { AxiosError, AxiosResponse } from "axios";
import type { AxiosInstance, AxiosRequestConfig } from "axios";

import { isNode, pick } from "./utilts";
import { Logger } from "../../utils";
import type { StatusError } from "./models";

import { SummonerResource } from "./resources";
import { Region } from "./types";

export type RiotErrorResponse = {};
const allowedAxiosOptions = ["headers", "timeout", "proxy", "retries"] as const;
export type GenericApiResponse =
  | RiotErrorResponse
  | StatusError
  | { status: 200; data: any };
export type DahvidClientConfig = {
  /**
   * apiKey is required to make requests to the riot API
   */
  apiKey: string;

  /**
   * Additional headers that will be included in each request.
   */
  headers?: Record<string, string>;

  /**
   * Max amount of requests that will be fired within a 2
   * minute period, if it exceeds this it will throttle.
   *
   * @defaultvalue `100`
   */
  timeout?: number;

  /**
   * The number of times
   */
  retries?: number;

  /**
   * Optional configuration for an HTTP proxy
   *
   * {@link https://axios-http.com/docs/req_config request config}
   */
  proxy?: {
    host: string;
    port: number;
    auth?: {
      username: string;
      password: string;
    };
    protocol?: string;
  };
};

/**
 * The DahvidClient provides a simple interface to the Riot API and
 * the datadragon with common usage patterns
 *
 * DahvidClient uses {@link https://axios-http.com/docs/intro axios} under the hood to
 * make API requests. A subset of axios request options can be passed through to
 * the underlying axios instance using the options available in {@link DahvidClientConfig}
 *
 * In the case of an error while making an API request, you can expect to handle one of the
 * following two exceptions:
 *
 * - {@link RiotErrorResponse} When an error response is returned from the API
 * - {@link https://github.com/axios/axios/blob/v0.21.1/index.d.ts#L85 AxiosError} when an error
 *    occurred during the request process, but no response was received (i.e. due to network issues).
 *
 * @category API client
 */
export class DahvidClient {
  private readonly axios: AxiosInstance;
  /** @internal */
  private readonly auth_token: string;

  /**
   * @category Resource
   * @inheritDoc SummonerResource
   */
  summoner: SummonerResource;

  constructor(config: DahvidClientConfig) {
    if (!isNode()) {
      Logger.fatal(
        "For security reasons please only run DahvidClient on server-side applications. (running on client-side)"
      );
    }

    const { apiKey, ...axiosOptions } = config;
    this.auth_token = apiKey;

    const filteredAxiosOptions = pick<AxiosRequestConfig>(
      axiosOptions,
      ...allowedAxiosOptions
    );

    this.axios = axios.create({
      baseURL: "https://REGION.api.riotgames.com",
      headers: { ...config.headers, ...filteredAxiosOptions.headers },
    } as AxiosRequestConfig);

    // const axiosOnNetworkError = () => {};

    // this.axios.interceptors.response.use(undefined, axiosOnNetworkError);

    this.summoner = new SummonerResource(this);
  }

  private _authorizeRequest(config: AxiosRequestConfig): AxiosRequestConfig {
    return {
      ...config,
      headers: {
        ...config.headers,
        "X-Riot-Token": this.auth_token,
      },
    };
  }

  private _applyRegion(
    config: AxiosRequestConfig,
    region: Region
  ): AxiosRequestConfig {
    const region_map: Record<string, any> = {
      oce: "oc1",
      na: "na1",
      br: "br1",
      eun: "eun1",
      eune: "eun1",
      euw: "euw1",
      kr: "kr",
      jp: "jp1",
      las: "la1",
      lan: "la2",
      tr: "tr1",
      ru: "ru",
      oc1: "oc1",
      na1: "na1",
      br1: "br1",
      eun1: "eun1",
      euw1: "euw1",
      jp1: "jp1",
      la1: "la1",
      la2: "la2",
      tr1: "tr1",
    };

    const _region = region_map[region];
    const base_url = "https://REGION.api.riotgames.com".replace(
      "REGION",
      _region
    );

    return {
      ...config,
      baseURL: base_url,
    };
  }

  /**
   * @internal
   */
  async _apiCall<T extends GenericApiResponse>({
    path,
    region,
    method = "GET",
    query,
    data,
  }: {
    path: string;
    region: Region;
    method?: "GET" | "POST";
    query?: Record<string, any>;
    data?: any;
    auth?: string;
  }): Promise<T> {
    let requestConfig: AxiosRequestConfig = {
      url: path,
      method,
      params: query,
      data,
    };

    requestConfig = this._authorizeRequest(requestConfig);
    requestConfig = this._applyRegion(requestConfig, region);

    let response: AxiosResponse;

    try {
      response = await this.axios(requestConfig);
    } catch (e) {
      const err = e as AxiosError;

      if (typeof err.response !== "undefined") {
        throw err;
      }

      throw err;
    }

    return response.data;
  }
}
