import { BaseUnique, UserStateT } from "../../contract";
import { compileTriggers, Logger } from "../../../../../utils";
import type { DahvidClient } from "../../../../riot";

const letter_map: Record<string, string[]> = {
  a: ["4", "Ä", "Ã", "Á", "Å"],
  b: [],
  c: [],
  d: ["Ð"],
  e: ["3", "Ē", "Ë", "€", "Ė", "Ě", "Ę", "Ê"],
  f: [],
  g: [],
  h: [],
  i: ["i"],
  j: [],
  k: [],
  l: ["Ĺ", "Ļ"],
  m: [],
  n: [],
  o: ["0", "Ò", "Ô", "Ö", "Ő", "Ø"],
  p: [],
  q: [],
  r: [],
  s: ["$", "Ṩ", "Ṧ"],
  t: [],
  u: ["Û", "Ü", "v"],
  v: [],
  w: [],
  x: [],
  y: [],
  z: [],
};

const levels: Record<number, number> = {
  1: 0.002,
  2: 0.02,
  3: 0.1,
  4: 0.2,
  5: 2,
};

export default class ElnienUnique extends BaseUnique {
  static UNIQUE_TRIGGERS = ["{PREFIX}elnien", "{PREFIX}l9"];

  public static getConfig() {
    return {
      data: {
        response: "{CUSTOM_RESPONSE}",
        triggers: this.UNIQUE_TRIGGERS,
        type: "inbuilt",
      },
      id: "aKdchawq5Lds1LcmSDMP",
    };
  }

  public static test(message: string): boolean {
    const COMPILED_TRIGGERS = compileTriggers(this.UNIQUE_TRIGGERS);

    return !!COMPILED_TRIGGERS.find(
      (x) => x === message.toLowerCase().split(/\s+/g)[0]
    );
  }

  public async run(
    channel: string,
    _userstate: UserStateT,
    message: string,
    _self: boolean,
    _api: DahvidClient
  ): Promise<void> {
    Logger.debug("Attempting to trigger Elnien unique");
    var [_command, _level, ..._message] = message.split(/\s+/g);
    const level = Number(_level);
    if (![1, 2, 3, 4, 5].includes(level) || _message.length === 0) {
      this.client.say(
        channel,
        `Usage: ${process.env.PREFIX}L9 {level 1-5} {text}`
      );
      return;
    }

    const first_pass = _message
      .join(" ")
      .split("")
      .map((letter, i) => {
        if (letter == " ")
          return {
            l: " ",
            i,
            c: " ",
          };
        const letter_array = letter_map[letter];
        const random_number = Math.floor(Math.random() * letter_array.length);
        const selected = letter_array.length
          ? letter_array[random_number]
          : letter.toUpperCase();

        return {
          l: letter,
          i,
          c: selected,
        };
      });

    var amount = Math.floor(_message.length * levels[level]) + Number(level);
    var toChange: number[] = [];

    for (let i = 0; i < amount; i++) {
      let t = Math.floor(Math.random() * first_pass.length);

      if (toChange.includes(t) || first_pass[t].c === " ") {
        i--;
      } else {
        toChange.push(t);
      }
    }

    const second_pass = first_pass.map((v) => {
      if (toChange.includes(v.i)) {
        return v.c;
      }

      return v.l.toUpperCase();
    });

    this.client.say(channel, second_pass.join(""));

    Logger.debug("Elnien unique has been triggered");
    return Promise.resolve();
  }
}
