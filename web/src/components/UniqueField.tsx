import { Field } from "formik";
import React, { FC, Fragment, ReactElement, useCallback } from "react";

interface UniqueTextFieldProps {
  data: {
    type: "select" | "string";
    options?: string[];
    label: string;
    id: string;
    display: (type: string) => boolean;
    placeholder?: string;
  };
  type: string;
  fieldIsValid: boolean;
}
export const UniqueTextField: FC<UniqueTextFieldProps> = ({
  fieldIsValid,
  data,
  type,
}: UniqueTextFieldProps): ReactElement => {
  const shouldDisplay = useCallback(() => data.display(type), [type, data]);
  const className = useCallback(
    () =>
      `bg-[#17161C] appearance-none border-2 ${
        fieldIsValid ? "border-[#2A2B34]" : "border-red-300"
      } placeholder-custom rounded-lg w-full py-2 px-4 text-[#D0D0D1] ${
        fieldIsValid ? "focus:border-[#2A2B34]" : "focus:border-red-300"
      }`,
    [fieldIsValid]
  )();

  if (!shouldDisplay()) return <Fragment />;

  return (
    <Fragment>
      <label htmlFor={data.id}>{data.label}</label>

      <Field
        className={className}
        name={data.id}
        autoComplete="off"
        type="text"
        placeholder={data.placeholder}
      />
    </Fragment>
  );
};

export interface UniqueSelectFieldProps {
  data: {
    type: "select" | "string";
    options?: string[];
    placeholder?: string;
    label: string;
    id: string;
    display: (type: string) => boolean;
  };
  type: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  fieldIsValid: boolean;
}
export const UniqueSelectField: FC<UniqueSelectFieldProps> = ({
  data,
  onChange,
  fieldIsValid,
  type,
}: UniqueSelectFieldProps): ReactElement => {
  const shouldDisplay = useCallback(() => data.display(type), [type, data]);
  const className = useCallback(
    () =>
      `bg-[#17161C] appearance-none border-2 ${
        fieldIsValid ? "border-[#2A2B34]" : "border-red-300"
      } placeholder-custom rounded-lg w-full py-2 px-4 text-[#D0D0D1] ${
        fieldIsValid ? "focus:border-[#2A2B34]" : "focus:border-red-300"
      }`,
    [fieldIsValid]
  )();
  if (!shouldDisplay()) return <Fragment />;

  return (
    <Fragment>
      <label htmlFor={data.id}>{data.label}</label>

      <select
        className={className}
        name={data.id}
        onChange={onChange}
        id={data.id}
      >
        {data.options!.map((option, index) => (
          <option
            defaultValue={data.placeholder}
            key={`${data.id}:${index}`}
            value={option}
            label={option}
          >
            {option}
          </option>
        ))}
      </select>
    </Fragment>
  );
};
