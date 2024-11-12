// GlobalStateContext.js
import React, { createContext, useContext, useState } from 'react';

const GlobalStateContext = createContext();

export const GlobalStateProvider = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(null); // Shared global state
  const [currentShortBlock, setCurrentShortBlock] = useState(0);
  const [currentLongBlock, setCurrentLongBlock] = useState(0);

  return (
    <GlobalStateContext.Provider value={{ currentStep, setCurrentStep, currentShortBlock, setCurrentShortBlock, currentLongBlock, setCurrentLongBlock }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => useContext(GlobalStateContext);
