import React, { Fragment, ReactElement, FC } from "react";

interface TypeSelectorProps {
  value: string;
  className: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const TypeSelector: FC<TypeSelectorProps> = ({
  value,
  className,
  onChange,
}: TypeSelectorProps): ReactElement => {
  return (
    <Fragment>
      <select
        name="uniqueType"
        id="uniqueType"
        className={className}
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
