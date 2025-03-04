import React, { createContext, useContext, useState } from "react";

interface HeaderButtonsContextType {
  buttons: React.ReactNode;
  setButtons: (buttons: React.ReactNode) => void;
}

const HeaderButtonsContext = createContext<HeaderButtonsContextType>({
  buttons: null,
  setButtons: () => {},
});

export const useHeaderButtons = () => useContext(HeaderButtonsContext);

export const HeaderButtonsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [buttons, setButtons] = useState<React.ReactNode>(null);

  return (
    <HeaderButtonsContext.Provider value={{ buttons, setButtons }}>
      {children}
    </HeaderButtonsContext.Provider>
  );
};
