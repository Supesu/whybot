declare global {
  namespace NodeJS {
    interface ProcessEnv {
      FLAGS: string;
      PREFIX: string;
      NODE_ENV: string;
      VERBOSE: string;
      DEBUG: string;
      DISCORD_TOKEN: string;
      TWITCH_USERNAME: string;
      TWITCH_PASSWORD: string;
      TWITCH_DEBUG: string;
    }
  }
}

export {}
