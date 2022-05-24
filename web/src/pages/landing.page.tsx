import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import type { ReactElement, FC } from "react";
import { API_PROTOCOL, API_URL } from "../constants";
import { Link } from "react-router-dom";
import { Command } from "../components";

type CommandData =
  | {
      response: string;
      triggers: string[];
      id: string;
      type: "base";
    }
  | {
      id: string;
      summonerId: string;
      triggers: string[];
      region: string;
      type: "opgg";
    }
  | {
      id: string;
      summonerId: string;
      region: string;
      triggers: string[];
      type: "track";
    }
  | {
      type: "inbuilt";
      triggers: string[];
      response: string;
    };

type LocalCommand = {
  data: CommandData;
  id: string;
  metadata: {
    description: string;
  };
};

export const Landing: FC = (): ReactElement => {
  const [commands, setCommands] = useState<LocalCommand[]>([]);

  useEffect(() => {
    axios
      .get(`${API_PROTOCOL}://${API_URL}/api/v1/uniques/fetch`)
      .then((data) => data.data.data)
      .then((data) => {
        setCommands(data.local);
      });
  }, []);

  return (
    <Fragment>
      <div className="flex h-10 bg-[#1D1B22]">
        <p className="ml-8 mt-4 roboto uppercase font-bold text-lg text-background">
          Whybot
        </p>
        <Link
          to="/auth/login"
          className="ml-auto mt-8 text-background font-bold roboto text-sm hover:text-[#51339c] uppercase"
        >
          login
        </Link>
        <p className="ml-8 mr-12 mt-8 text-background font-bold roboto text-sm hover:text-[#51339c] cursor-not-allowed uppercase">
          Status
        </p>
      </div>
      <div className="bg-[#1D1B22] h-auto min-h-full w-full flex">
        <div className="flex justify-center mx-auto">
          <div className="my-14 flex flex-col w-[62rem]">
            <div className="flex flex-col space-y-4">
              {commands.map((command) => (
                <Command
                  description={command.metadata && command.metadata.description}
                  title={command.data.triggers[0].replace("{PREFIX}", "")}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Landing;
