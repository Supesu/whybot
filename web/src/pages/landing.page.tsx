import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import type { ReactElement, FC } from "react";
import { Link } from "react-router-dom";

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
    const __prod__ = true;
    const url = __prod__ ? "whybotapi.supesu.dev" : "192.168.50.112:4040";
    const protocol = __prod__ ? "https" : "http";

    axios
      .get(protocol + "://" + url + "/api/v1/uniques/fetch?local=true")
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
              {commands.map((command) => {
                const GENERIC_CLASSES =
                  "flex flex-col p-4 rounded h-20 bg-[#17161c] w-full shadow-md";
                const GENERIC_TEXT_CLASSES = "text-background text-md";
                const GENERIC_DESCRIPTION_CLASSES =
                  "text-sm text-background text-[#9291a3] mt-1";
                const title =
                  command.data &&
                  command.data.triggers &&
                  command.data.triggers[0].replace("{PREFIX}", "");
                const description =
                  command.metadata && command.metadata.description;

                if (command.data && command.data.type && command.data.type === "base") {
                  return (
                    <div className={`${GENERIC_CLASSES}`}>
                      <p className={`${GENERIC_TEXT_CLASSES}`}>{title}</p>
                      <p className={`${GENERIC_DESCRIPTION_CLASSES}`}>
                        {description || "No description set"}
                      </p>
                    </div>
                  );
                }

                if (command.data && command.data.type && command.data.type === "opgg") {
                  return (
                    <div className={`${GENERIC_CLASSES}`}>
                      <p className={`${GENERIC_TEXT_CLASSES}`}>{title}</p>
                      <p className={`${GENERIC_DESCRIPTION_CLASSES}`}>
                        {description || "No description set"}
                      </p>
                    </div>
                  );
                }

                if (command.data && command.data.type && command.data.type === "track") {
                  return (
                    <div className={`${GENERIC_CLASSES}`}>
                      <p className={`${GENERIC_TEXT_CLASSES}`}>{title}</p>
                      <p className={`${GENERIC_DESCRIPTION_CLASSES}`}>
                        {description || "No description set"}
                      </p>
                    </div>
                  );
                }

                if (command.data && command.data.type && command.data.type === "inbuilt") {
                  return (
                    <div className={`${GENERIC_CLASSES}`}>
                      <p className={`${GENERIC_TEXT_CLASSES}`}>{title}</p>
                      <p className={`${GENERIC_DESCRIPTION_CLASSES}`}>
                        {description || "No description set"}
                      </p>
                    </div>
                  );
                }

                return (
                  <div className={`${GENERIC_CLASSES}`}>
                  <p className={`${GENERIC_TEXT_CLASSES}`}>Meow</p>
                  <p className={`${GENERIC_DESCRIPTION_CLASSES}`}>
                    {description || "Contact me on discord supesu#7777"}
                  </p>
                </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Landing;
