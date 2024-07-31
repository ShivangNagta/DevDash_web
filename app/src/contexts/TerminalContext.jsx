import React, { createContext, useState, useContext } from 'react';

const WindowContext = createContext();

export const useWindowContext = () => {
  return useContext(WindowContext);
};

export const WindowProvider = ({ children }) => {
  const [terminalHistory, setTerminalHistory] = useState([]);
  const [sshVerified, setSshVerified] = useState(false);
  const [mysqlHistory, setMysqlHistory] = useState([]);
  const [authenticated, setAuthenticated] = useState(false);
  const [url, setUrl] = useState("");
  const [currentContent, setCurrentContent] = useState("Welcome to Cybertrace. Talk to the chatbot in the bottom right to get started.");
  const [credAccessed, setCredAccessed] = useState(false);

  return (
    <WindowContext.Provider value={{
      terminalHistory, setTerminalHistory,
      sshVerified, setSshVerified,
      mysqlHistory, setMysqlHistory,
      authenticated, setAuthenticated,
      url, setUrl,
      currentContent, setCurrentContent,
      credAccessed, setCredAccessed
    }}>
      {children}
    </WindowContext.Provider>
  );
};
