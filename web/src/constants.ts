export const __prod__ = false;

export const API_PROTOCOL = __prod__ ? "https" : "http";
export const API_URL = __prod__ ? "whybotapi.supesu.dev" : "localhost:4040";
