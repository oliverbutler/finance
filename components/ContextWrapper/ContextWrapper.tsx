import React from "react";
import { useState } from "react";

interface SensitiveState {
  sensitive: boolean;
  setSensitive: React.Dispatch<React.SetStateAction<boolean>>;
}

const SensitiveContext = React.createContext<SensitiveState | undefined>(
  undefined
);

export const ContextWrapper: React.FunctionComponent = ({ children }) => {
  const [sensitive, setSensitive] = useState<boolean>(false);

  return (
    <SensitiveContext.Provider value={{ sensitive, setSensitive }}>
      {children}
    </SensitiveContext.Provider>
  );
};

export const useSensitive = (): SensitiveState => {
  const context = React.useContext(SensitiveContext);
  if (context === undefined) {
    throw new Error(
      "useSensitive must be used inside a SensitiveContext.Provider"
    );
  }
  return context;
};
