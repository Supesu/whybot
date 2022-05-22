import React, { Fragment, ReactElement, FC } from "react";

interface TypeSelectorProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const TypeSelector: FC<TypeSelectorProps> = ({
  value,
  onChange,
}: TypeSelectorProps): ReactElement => {
  return (
    <Fragment>
      <select
        name="uniqueType"
        id="uniqueType"
        value={value}
        onChange={onChange}
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
    </Fragment>
  );
};

export default TypeSelector;
