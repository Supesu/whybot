import React, { Fragment, useEffect, useState } from "react";
import axios from "axios";
import type { ReactElement, FC } from "react";
import { PlusIcon } from "../icons";
import { API_PROTOCOL, API_URL } from "../constants";
import { Navigate } from "react-router-dom";
import { Command, UniqueForm } from "../components";
import type { UniqueFormConfig } from "../components";
import { UniqueFormResponse } from "../components/UniqueForm";

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
  const [uniqueFormUpdateInformation, setUniqueFormUpdateInformation] =
    useState<any>({});
  const [
    uniqueFormFieldUpdateInformation,
    setUniqueFormFieldUpdateInformation,
  ] = useState<any>({});
  const [shouldShowUpdateForm, setShouldShowUpdateForm] =
    useState<boolean>(false);
  const [overlayIsActive, setOverlayIsActive] = useState<boolean>(false);
  const [currentStateChange, setCurrentStateChange] = useState<any>("CREATE");
  const [currentWorkingCommand, setCurrentWorkingCommand] = useState<string>();

  const StateChangeMap: Record<string, any> = {
    CREATE: setOverlayIsActive,
    UPDATE: setShouldShowUpdateForm,
  };

  var FormConfig: UniqueFormConfig = {
    fields: [
      {
        id: "type",
        label: "Type",
        type: "select",
        placeholder: "base",
        options: ["base", "opgg", "track"],
        display: (_type) => true,
      },
      {
        id: "triggers",
        label: "Triggers",
        placeholder: "{PREFIX}test, {PREFIX}t",
        type: "string",
        display: (_type) => true,
      },
      {
        id: "description",
        label: "Description",
        placeholder: "Description",
        type: "string",
        display: (_type) => true,
      },
      {
        id: "response",
        label: "Response",
        placeholder: "Response",
        type: "string",
        display: (type) => ["base", "inbuilt"].includes(type),
      },
      {
        id: "summonerName",
        label: "Summoner Name",
        placeholder: "possum2002",
        type: "string",
        display: (type) => ["opgg", "track"].includes(type),
      },
      {
        id: "region",
        label: "Region",
        type: "select",
        options: [
          "oce",
          "na",
          "eune",
          "euw",
          "kr",
          "jp",
          "las",
          "lan",
          "tr",
          "ru",
        ],
        placeholder: "oce",
        display: (type) => ["opgg", "track"].includes(type),
      },
    ],
    onSelectChange: (values: UniqueFormResponse) => {},
    onSubmit: (values: UniqueFormResponse) => {
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

      console.log(generic_config);
      const stateChange = StateChangeMap[currentStateChange];

      stateChange(false);
      window.removeEventListener("mousedown", onMouseDown);
      createUnique(generic_config as CreateUniqueConfig);
    },
  };

  const GENERIC_CLASSES =
    "flex flex-col p-4 rounded cursor-pointer h-20 bg-[#17161c] w-full shadow-md";

  const onMouseDown = (e: MouseEvent) => {
    const target: Node = e.target as Node;

    if (!document.querySelector("#overlay")!.contains(target)) {
      window.removeEventListener("mousedown", onMouseDown);

      const stateChange = StateChangeMap[currentStateChange];

      stateChange(false);
    }
  };

  useEffect(() => {
    window.addEventListener("mousedown", onMouseDown);

    return () => {
      window.removeEventListener("mousedown", onMouseDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStateChange]);

  const toggleOverlay = (name: any) => {
    setCurrentStateChange(name);
    const stateChange = StateChangeMap[name]!;
    stateChange((s: any) => !s);
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    axios
      .get(API_PROTOCOL + "://" + API_URL + "/api/v1/uniques/fetch")
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
        await axios
          .get(`${API_PROTOCOL}://${API_URL}/api/v1/uniques/${commandId}/fetch`)
          .then((response) => {
            commands.unshift(response["data"]["data"]["local"]);
          });
      })
      .catch((error) => {
        const errors = JSON.parse(error.response.data.message);

        errors.forEach((error: { field: string; message: string }) => {
          console.log(error);
        });
      });
  };
  const updateUnique = (values: UniqueFormResponse & { id: string }) => {
    const commandId = values.id;

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

    const requestConfig = {
      api_key: apiKey,
      config: generic_config,
    };

    axios
      .post(
        `${API_PROTOCOL}://${API_URL}/api/v1/uniques/${commandId}/update`,
        requestConfig
      )
      .then((data) => data.data)
      .then((data) => {
        console.log(data);
      });
  };

  if (!isAuthenticated) {
    return <Navigate replace to="/auth/login" />;
  }

  const handleLogout = () => {
    setIsAuthenticated(false);
    window.localStorage.clear();
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
          <UniqueForm
            onSelectChange={FormConfig.onSelectChange}
            fields={FormConfig.fields}
            onSubmit={FormConfig.onSubmit}
          />
        )}
        {shouldShowUpdateForm && (
          <UniqueForm
            onSelectChange={FormConfig.onSelectChange}
            fields={uniqueFormFieldUpdateInformation}
            initialValues={uniqueFormUpdateInformation}
            onSubmit={(data) => {
              const _template = { id: currentWorkingCommand!, ...data };
              updateUnique(_template);
            }}
          />
        )}

        <div className="flex justify-center mx-auto">
          <div className="my-14 flex flex-col w-[62rem]">
            <div className="flex flex-col space-y-4">
              <div
                className={`${GENERIC_CLASSES} bg-[#2c2a35]`}
                onClick={() => toggleOverlay("CREATE")}
              >
                <PlusIcon h={"1.5rem"} w={"1.5rem"} c={"#514d63"} />
              </div>
              {commands.map((command, index) => (
                <Command
                  isAdmin={true}
                  adminTools={{
                    handleDelete: (id: string) => {
                      axios.get(
                        `${API_PROTOCOL}://${API_URL}/api/v1/uniques/${id}/delete?api_key=${apiKey}`
                      );
                    },
                    handleEdit: (id: string) => {
                      console.log("attempting to edit unique:" + id);

                      axios
                        .get(
                          `${API_PROTOCOL}://${API_URL}/api/v1/uniques/${id}/fetch`
                        )
                        .then((data) => data.data.data.local)
                        .then((data) => {
                          var _template: Record<string, string> = {
                            type: data.data.type,
                            description: data.metadata.description,
                            triggers: data.data.triggers.join(","),
                          };

                          if (["base", "inbuilt"].includes(_template.type)) {
                            _template["response"] = data.data.response;
                          }
                          if (["opgg", "track"].includes(_template.type)) {
                            _template["region"] = data.data.region;
                            _template["summonerName"] = data.data.summonerName;
                          }
                          const fields = FormConfig.fields;
                          fields[0].placeholder = data.data.type;
                          fields[5].placeholder = _template["region"];

                          setCurrentWorkingCommand(id);
                          setUniqueFormUpdateInformation(_template);
                          setUniqueFormFieldUpdateInformation(fields);
                          toggleOverlay("UPDATE");
                        });
                    },
                  }}
                  description={command.metadata && command.metadata.description}
                  id={command.id}
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
