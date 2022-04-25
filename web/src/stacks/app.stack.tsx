import { Fragment } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import type { ReactElement, FC } from "react";
import { App } from "../pages";

interface AppstackProps {
  apiKey: string|null;
}

export const AppStack: FC<AppstackProps> = ({
  apiKey,
}: AppstackProps): ReactElement => {
  return (
    <Fragment>
      <Routes>
        <Route path="home" element={<App apiKey={apiKey} />} />
        <Route path="*" element={<Navigate to="/app/home" replace />} />
      </Routes>
    </Fragment>
  );
};

export default AppStack;
