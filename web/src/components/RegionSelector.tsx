import React, { Fragment, FC, ReactElement } from "react";

interface RegionSelectorProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const RegionSelector: FC<RegionSelectorProps> = ({
  value,
  onChange,
}: RegionSelectorProps): ReactElement => {
  const regions = [
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
  ];

  return (
    <Fragment>
      <select
        name="uniqueType"
        id="uniqueType"
        value={value}
        onChange={onChange}
        style={{ display: "block" }}
      >
        {regions.map((region, index) => (
          <option key={index} value={region} label={region}>
            {region}
          </option>
        ))}
      </select>
    </Fragment>
  );
};

export default RegionSelector;
