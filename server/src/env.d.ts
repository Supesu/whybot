declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PREFIX: string;
      FLAGS: string;
      NODE_ENV: string;
      FLAGS: string;
      VERBOSE: string;
      DEBUG: string;
      DISCORD_TOKEN: string;
      CORS_URL: string;
      FIREBASE_CONFIG: string;
      TWITCH_USERNAME: string;
      TWITCH_PASSWORD: string;
      TWITCH_DEBUG: string;
      RIOT_API_KEY: string;
    }
  }
}

export {}
