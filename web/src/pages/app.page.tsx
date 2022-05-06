import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import type { ReactElement, FC } from "react";
import { PlusIcon } from "../icons";
import { Formik, Form, Field } from "formik";
import { Navigate } from "react-router-dom";

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

interface AppProps {
  apiKey: string | null;
}

export const App: FC<AppProps> = ({ apiKey }: AppProps): ReactElement => {
  const [commands, setCommands] = useState<LocalCommand[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    apiKey !== "" && apiKey !== null
  );
  const [overlayIsActive, setOverlayIsActive] = useState<boolean>(false);

  const GENERIC_CLASSES =
    "flex flex-col p-4 rounded cursor-pointer h-20 bg-[#17161c] w-full shadow-md";
  const GENERIC_TEXT_CLASSES = "text-background text-md";
  const GENERIC_DESCRIPTION_CLASSES =
    "text-sm text-background text-[#9291a3] mt-1";

  // synthetic types too confusing for me to properly type this... lol (please make pr if you can)
  const onMouseDown = (e: any) => {
    if (!document.querySelector("#overlay")!.contains(e.target)) {
      window.removeEventListener("mousedown", onMouseDown);

      setOverlayIsActive(false);
    }
  };

  const toggleOverlay = () => {
    setOverlayIsActive((s) => !s);

    window.addEventListener("mousedown", onMouseDown);
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    const __prod__ = true;
    const url = __prod__ ? "whybotapi.supesu.dev" : "192.168.50.112:4040";
    const protocol = __prod__ ? "https" : "http";

    axios
      .get(protocol + "://" + url + "/api/v1/uniques/fetch?local=true")
      .then((data) => data.data.data)
      .then((data) => {
        setCommands(data.local);
      });
  }, [isAuthenticated]);

  interface createUniqueConfig {
    triggers: string;
    response?: string;
    region?: string;
    summonerName?: string;
    description: string;
    type: "base" | "opgg" | "track";
  }

  const createUnique = ({
    triggers,
    response,
    type,
    description,
    region,
    summonerName,
  }: createUniqueConfig) => {
    console.log("someone tried to submit");
    if (!triggers || triggers === "" || !description || description === "")
      return;

    if (type === "base" && (!response || response === "")) return;
    
    // FAILS HERE 
    if (
      (type === "track" || type === "opgg") &&
      (!summonerName || summonerName === "" || !region || region === "")
    )
      return;

    const _template: Record<string, Record<string, string | string[]>> = {
      data: {
        triggers: triggers.includes(",") ? triggers.split(",") : [triggers],
      },
      metadata: {
        description,
      },
    };

    if (type === "base") {
      _template["data"]["response"] = response!;
    }

    if (type === "opgg" || type === "track") {
      _template["data"]["summonerName"] = summonerName!;
      _template["data"]["region"] = region!;
    }

    _template["data"]["type"] = type!;

    console.log(_template);
  };

  if (!isAuthenticated) {
    return <Navigate replace to="/auth/login" />;
  }

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <Fragment>
      <div className="flex h-10 bg-[#1D1B22]">
        <p className="ml-8 mt-4 roboto uppercase font-bold text-lg text-background">
          Whybot
        </p>
        <p
          onClick={() => handleLogout()}
          className="ml-auto mt-8 text-background cursor-pointer font-bold roboto text-sm hover:text-[#51339c] uppercase"
        >
          logout
        </p>
        <p className="ml-8 mr-12 mt-8 text-background font-bold roboto text-sm hover:text-[#51339c] cursor-not-allowed uppercase">
          Status
        </p>
      </div>
      <div className="bg-[#1D1B22] h-auto min-h-full w-full flex">
        {overlayIsActive && (
          <div className="fixed top-0 left-0 right-0 bottom-0 justify-center flex">
            <Formik
              initialValues={{
                type: "base",
                description: "",
                triggers: "",
                region: "",
                response: "",
                summonerName: "",
              }}
              onSubmit={async (values) => {
                type validType = "base" | "opgg" | "track";
                createUnique({
                  description: values.description,
                  triggers: values.triggers,
                  region: values.region,
                  response: values.response,
                  summonerName: values.summonerName,
                  type: values.type as validType,
                });
              }}
            >
              {({ values, setFieldValue }) => (
                <Form
                  className="flex flex-col m-auto w-[40rem] h-[30rem] bg-[#282630] rounded-xl"
                  id="overlay"
                >
                  <select
                    name="uniqueType"
                    id="uniqueType"
                    value={values.type}
                    onChange={(e) => setFieldValue("type", e.target.value)}
                    style={{ display: "block" }}
                  >
                    <option value="base" label="base">
                      {" "}
                      base
                    </option>
                    <option value="opgg" label="opgg">
                      {" "}
                      opgg
                    </option>
                    <option value="track" label="track">
                      {" "}
                      track
                    </option>
                  </select>

                  {values.type === "base" && (
                    <Fragment>
                      <Field
                        name="triggers"
                        autoComplete="off"
                        type="text"
                        placeholder="{PREFIX}test,{PREFIX}t"
                      />
                      <Field
                        name="description"
                        autoComplete="off"
                        type="text"
                        placeholder="Description"
                      />
                      <Field
                        name="response"
                        autoComplete="off"
                        type="text"
                        placeholder="Response"
                      />
                    </Fragment>
                  )}

                  {values.type === "opgg" && (
                    <Fragment>
                      <Field
                        name="triggers"
                        autoComplete="off"
                        type="text"
                        placeholder="{PREFIX}test,{PREFIX}t"
                      />
                      <Field
                        name="description"
                        autoComplete="off"
                        type="text"
                        placeholder="Description"
                      />
                      <Field
                        name="summonerName"
                        autoComplete="off"
                        type="text"
                        placeholder="Summoner name"
                      />
                      <select
                        name="uniqueType"
                        id="uniqueType"
                        value={values.region}
                        onChange={(e) =>
                          setFieldValue("region", e.target.value)
                        }
                        style={{ display: "block" }}
                      >
                        <option value="oce" label="oce">
                          oce
                        </option>
                        <option value="na" label="na">
                          na
                        </option>
                        <option value="br" label="br">
                          br
                        </option>
                        <option value="eune" label="eune">
                          eune
                        </option>
                        <option value="euw" label="euw">
                          euw
                        </option>
                        <option value="kr" label="kr">
                          kr
                        </option>
                        <option value="jp" label="jp">
                          jp
                        </option>
                        <option value="las" label="las">
                          las
                        </option>
                        <option value="lan" label="lan">
                          lan
                        </option>
                        <option value="tr" label="tr">
                          tr
                        </option>
                        <option value="ru" label="ru">
                          ru
                        </option>
                      </select>
                    </Fragment>
                  )}

                  {values.type === "track" && (
                    <Fragment>
                      <Field
                        name="triggers"
                        autoComplete="off"
                        type="text"
                        placeholder="{PREFIX}test,{PREFIX}t"
                      />
                      <Field
                        name="description"
                        autoComplete="off"
                        type="text"
                        placeholder="Description"
                      />
                      <Field
                        name="summonerName"
                        autoComplete="off"
                        type="text"
                        placeholder="Summoner name"
                      />

                      <select
                        name="uniqueType"
                        id="uniqueType"
                        value={values.region}
                        onChange={(e) =>
                          setFieldValue("region", e.target.value)
                        }
                        style={{ display: "block" }}
                      >
                        <option value="oce" label="oce">
                          oce
                        </option>
                        <option value="na" label="na">
                          na
                        </option>
                        <option value="br" label="br">
                          br
                        </option>
                        <option value="eune" label="eune">
                          eune
                        </option>
                        <option value="euw" label="euw">
                          euw
                        </option>
                        <option value="kr" label="kr">
                          kr
                        </option>
                        <option value="jp" label="jp">
                          jp
                        </option>
                        <option value="las" label="las">
                          las
                        </option>
                        <option value="lan" label="lan">
                          lan
                        </option>
                        <option value="tr" label="tr">
                          tr
                        </option>
                        <option value="ru" label="ru">
                          ru
                        </option>
                      </select>
                    </Fragment>
                  )}

                  <button
                    type="submit"
                    className="mx-auto mt-auto mb-8 w-[35rem] text-white bg-[#8A899F] rounded-md h-12 text-sm font-medium text-center"
                  >
                    CREATE UNIQUE
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        )}
        <div className="flex justify-center mx-auto">
          <div className="my-14 flex flex-col w-[62rem]">
            <div className="flex flex-col space-y-4">
              <div
                className={`${GENERIC_CLASSES} bg-[#2c2a35]`}
                onClick={() => toggleOverlay()}
              >
                <PlusIcon h={"1.5rem"} w={"1.5rem"} c={"#514d63"} />
              </div>
              {commands.map((command) => {
                const description =
                  command.metadata && command.metadata.description;
                const title = command.data.triggers[0].replace("{PREFIX}", "");

                if (command.data.type === "base") {
                  return (
                    <div className={`${GENERIC_CLASSES}`}>
                      <p className={`${GENERIC_TEXT_CLASSES}`}>{title}</p>
                      <p className={`${GENERIC_DESCRIPTION_CLASSES}`}>
                        {description || "No description set"}
                      </p>
                    </div>
                  );
                }

                if (command.data.type === "opgg") {
                  return (
                    <div className={`${GENERIC_CLASSES}`}>
                      <p className={`${GENERIC_TEXT_CLASSES}`}>{title}</p>
                      <p className={`${GENERIC_DESCRIPTION_CLASSES}`}>
                        {description || "No description set"}
                      </p>
                    </div>
                  );
                }

                if (command.data.type === "track") {
                  return (
                    <div className={`${GENERIC_CLASSES}`}>
                      <p className={`${GENERIC_TEXT_CLASSES}`}>{title}</p>
                      <p className={`${GENERIC_DESCRIPTION_CLASSES}`}>
                        {description || "No description set"}
                      </p>
                    </div>
                  );
                }

                if (command.data.type === "inbuilt") {
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
                    <p>invalid command</p>
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

export default App;
