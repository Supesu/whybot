import { Form, Formik } from "formik";
import React, { Fragment, FC, ReactElement } from "react";

import { UniqueSelectField, UniqueTextField } from "./UniqueField";

interface UniqueField {
  type: "select" | "string";
  options?: string[];
  label: string;
  placeholder?: string;
  display: (type: string) => boolean;
  id: string;
}

export interface UniqueFormResponse {
  type: string;
  description: string;
  triggers: string;
  region: string;
  response: string;
  summonerName: string;
}

export interface UniqueFormConfig {
  fields: UniqueField[];
  onSubmit: (response: UniqueFormResponse) => void;
  onSelectChange: (value: {
    type: string;
    description: string;
    triggers: string;
    region: string;
    response: string;
    summonerName: string;
  }) => void;
  initialValues?: {
    type: "base" | "track" | "opgg";
    description: string;
    triggers: string;
    region: string;
    response: string;
    summonerName: string;
  };
}

export const UniqueForm: FC<UniqueFormConfig> = ({
  fields,
  onSubmit,
  onSelectChange,
  initialValues,
}: UniqueFormConfig): ReactElement => {
  return (
    <Fragment>
      <div className="fixed top-0 left-0 right-0 bottom-0 justify-center flex">
        <Formik
          initialValues={
            initialValues || {
              type: "base",
              description: "",
              triggers: "",
              region: "oce",
              response: "",
              summonerName: "",
            }
          }
          onSubmit={onSubmit}
        >
          {({ values, setFieldValue }) => (
            <Form
              className="flex flex-col m-auto w-[40rem] h-[30rem] bg-[#282630] rounded-xl"
              id="overlay"
            >
              {fields.map((field, index) => {
                if (field.type === "select") {
                  return (
                    <UniqueSelectField
                      onChange={(e) => {
                        onSelectChange(values);
                        setFieldValue(field.id, e.target.value);
                      }}
                      data={field}
                      type={values.type}
                      fieldIsValid
                      key={`${field.id}:${index}`}
                    />
                  );
                }

                if (field.type === "string") {
                  return (
                    <UniqueTextField
                      data={field}
                      type={values.type}
                      fieldIsValid
                      key={`${field.id}:${index}`}
                    />
                  );
                }
                return <Fragment />;
              })}

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
    </Fragment>
  );
};
