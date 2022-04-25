import { Fragment } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import type { ReactElement, FC, Dispatch, SetStateAction } from "react";
import type { User } from "../types";
import { Auth } from "../pages";

interface AuthstackProps {
  setApiKey: Dispatch<SetStateAction<string|null>>;
}

export const AuthStack: FC<AuthstackProps> = ({
  setApiKey,
}: AuthstackProps): ReactElement => {
  return (
    <Fragment>
      <Routes>
        <Route path="/login" element={<Auth setApiKey={setApiKey} />} />
        <Route path="*" element={<Navigate to="/auth/login" replace />} />
      </Routes>
    </Fragment>
  );
};

export default AuthStack;
