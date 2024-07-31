import React, { createContext, useContext, useState } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [selectedChild, setSelectedChild] = useState(null);
  // const [connectedUser, setConnectedUser] = useState({
  //   sessionId: "",
  //   email: "",
  //   password: "",
  //   partnerid: "",
  //   role: "",
  // });

  return (
    <AppContext.Provider
      value={{
        selectedChild,
        setSelectedChild,
        // connectedUser,
        // setConnectedUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
