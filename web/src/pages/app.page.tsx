import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import type { ReactElement, FC } from "react";
import { PlusIcon } from "../icons";
import { Formik, Form, Field } from "formik";
import { API_PROTOCOL, API_URL } from "../constants";
import { Navigate } from "react-router-dom";
import { Command, RegionSelector, TypeSelector } from "../components";

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
  const FORM_INPUT = "";
  const FORM_INPUT_LABEL = "text-white";

  // synthetic (React) types too confusing for me to properly type this... lol (please make pr if you can)
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
    const url = __prod__ ? "whybotapi.supesu.dev" : "localhost:4040";
    const protocol = __prod__ ? "https" : "http";

    axios
      .get(protocol + "://" + url + "/api/v1/uniques/fetch")
      .then((data) => data.data.data)
      .then((data) => {
        setCommands(data.local);
      });
  }, [isAuthenticated]);

  interface CreateOpggUniqueConfig {
    type: "opgg";
    summonerName: string;
    region: string;
    triggers: string;
    metadata: {
      description: string;
    };
  }

  interface CreateBaseUniqueConfig {
    type: "base";
    response: string;
    triggers: string;
    metadata: {
      description: string;
    };
  }

  interface CreateTrackUniqueConfig {
    type: "track";
    summonerName: string;
    triggers: string;
    metadata: {
      description: string;
    };
  }

  type CreateUniqueConfig =
    | CreateBaseUniqueConfig
    | CreateOpggUniqueConfig
    | CreateTrackUniqueConfig;

  const createUnique = (config: CreateUniqueConfig) => {
    console.log("attempting to make unique");
    console.log(config);

    const requestConfig = {
      api_key: apiKey,
      config,
    };

    axios
      .post(`${API_PROTOCOL}://${API_URL}/api/v1/uniques/create`, requestConfig)
      .then(async (response) => {
        const commandId = response["data"]["data"];

        // fetch command data
        const data = await axios.get(
          `${API_PROTOCOL}://${API_URL}/api/v1/uniques/${commandId}/fetch`
        );

        commands.unshift(data["data"]["data"]["local"]);
      })
      .catch(() => {
        console.log("failure");
      });
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
                region: "oce",
                response: "",
                summonerName: "",
              }}
              onSubmit={async (values) => {
                type ValidType = "base" | "opgg" | "track";

                const triggers = values.triggers.split(",");
                const filtered_triggers = triggers.filter(
                  (trigger) => trigger && trigger.includes("{PREFIX}")
                );

                const generic_config: Record<any, any> = {
                  metadata: {
                    description: values.description,
                  },
                  triggers: filtered_triggers,
                  type: values.type as ValidType,
                };

                switch (values.type) {
                  case "base":
                    generic_config["response"] = values.response;
                    break;
                  case "opgg":
                  case "track":
                    generic_config["summonerName"] = values.summonerName;
                    generic_config["region"] = values.region;
                    break;
                }

                createUnique(generic_config as CreateUniqueConfig);
              }}
            >
              {({ values, setFieldValue }) => (
                <Form
                  className="flex flex-col m-auto w-[40rem] h-[30rem] bg-[#282630] rounded-xl"
                  id="overlay"
                >
                  <label htmlFor="type" className={FORM_INPUT_LABEL}>
                    Type
                  </label>
                  <TypeSelector
                    value={values.type}
                    className={FORM_INPUT}
                    onChange={(e) => {
                      console.log("changed");
                      setFieldValue("type", e.target.value);
                    }}
                  />

                  <label htmlFor="triggers" className={FORM_INPUT_LABEL}>
                    Triggers
                  </label>
                  <Field
                    name="triggers"
                    className={FORM_INPUT}
                    autoComplete="off"
                    type="text"
                    placeholder="{PREFIX}test,{PREFIX}t"
                  />
                  <label htmlFor="Description" className={FORM_INPUT_LABEL}>
                    Description
                  </label>
                  <Field
                    className={FORM_INPUT}
                    name="description"
                    autoComplete="off"
                    type="text"
                    placeholder="Description"
                  />

                  {values.type === "base" && (
                    <Fragment>
                      <label htmlFor="response" className={FORM_INPUT_LABEL}>
                        Response
                      </label>
                      <Field
                        className={FORM_INPUT}
                        name="response"
                        autoComplete="off"
                        type="text"
                        placeholder="Response"
                      />
                    </Fragment>
                  )}

                  {["track", "opgg"].includes(values.type) && (
                    <Fragment>
                      <label
                        htmlFor="summonerName"
                        className={FORM_INPUT_LABEL}
                      >
                        Summoner Name
                      </label>
                      <Field
                        className={FORM_INPUT}
                        name="summonerName"
                        autoComplete="off"
                        type="text"
                        placeholder="Summoner name"
                      />
                      <label htmlFor="region" className={FORM_INPUT_LABEL}>
                        Region
                      </label>
                      <RegionSelector
                        className={FORM_INPUT}
                        value={values.region}
                        onChange={(e) =>
                          setFieldValue("region", e.target.value)
                        }
                      />
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
              {commands.map((command) => (
                <Command
                  isAdmin={true}
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

export default App;
