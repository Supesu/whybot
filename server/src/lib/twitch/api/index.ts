//? internal
import { fetchEndpoints } from "./endpoints";

interface EndpointMap {
  [key: string]: any;
}

type header = string;

class Api {
  private API_URL: string = ".api.riotgames.com";
  private DEFAULT_REGION: string = "oce";
  private AUTH_KEY: string;
  private ENDPOINTS: EndpointMap;

  static async build(auth_token: string) {
    const _endpoints = fetchEndpoints;

    return new this(auth_token, _endpoints);
  }

  constructor(auth_token: string, endpoints: EndpointMap) {
    this.ENDPOINTS = endpoints;
    this.AUTH_KEY = auth_token; //! idk how safe this is HAHA
  }

  public get(region = this.DEFAULT_REGION, path: string) {
    return `${this.convertRegion(region)}${this.API_URL}${path}?api_key=${
      this.AUTH_KEY
    }`;
  }

  public post(
    region = this.DEFAULT_REGION,
    path: string,
    _data: any,
    header?: header[]
  ) {
    const valid = this.ENDPOINTS[""]
    if (!valid)
      throw "nice man /api/endpoints 500";
      
    return `${this.convertRegion(region)}${this.API_URL}${path}?api_key=${
      this.AUTH_KEY
    }`;
  }

  private convertRegion(region: string) {}
}
