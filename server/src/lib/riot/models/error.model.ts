export type StatusError =
  | {
      code: 400;
      message: "Bad request";
    }
  | {
      code: 401;
      message: "Unauthorized";
    }
  | {
      code: 403;
      message: "Forbidden";
    }
  | {
      code: 404;
      message: "Data not found";
    }
  | {
      code: 405;
      message: "Method not allowed";
    }
  | {
      code: 415;
      message: "Unsupported media type";
    }
  | {
      code: 429;
      message: "Rate limit exceeded";
    }
  | {
      code: 500;
      message: "Internal server error";
    }
  | {
      code: 502;
      message: "Bad gateway";
    }
  | {
      code: 503;
      message: "Service unavailable";
    }
  | {
      code: 504;
      message: "Gateway timeout";
    };
