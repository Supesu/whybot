import { Fragment } from "react";
import type { ReactElement, FC } from "react";

export const Unknown: FC = (): ReactElement => {
  return (
    <Fragment>
      <p>404 Page</p>
    </Fragment>
  );
};

export default Unknown;