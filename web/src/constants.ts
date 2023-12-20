export const __prod__ = true;

export const API_PROTOCOL = __prod__ ? "https" : "http";
export const API_URL = __prod__ ? "bot2.forest.gg" : "localhost:4040";
