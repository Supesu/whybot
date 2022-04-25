import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import { ReactElement, FC, useState } from "react";

import { Landing, Unknown } from "../pages";
import { AppStack, AuthStack } from "../stacks";

export const App: FC = (): ReactElement => {
  const [apiKey, setApiKey] = useState<string|null>(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/app/*"
          element={<AppStack apiKey={apiKey} />}
        />
        <Route
          path="/auth/*"
          element={<AuthStack setApiKey={setApiKey} />}
        />
        <Route path="*" element={<Unknown />} />
      </Routes>
    </Router>
  );
};

export default App;
