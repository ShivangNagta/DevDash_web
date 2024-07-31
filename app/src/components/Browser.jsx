import React, { useState } from "react";
import ohMyGoddo from "../assets/ohMyGoddo.png";
import { useWindowContext } from "../contexts/TerminalContext";
import AnimatedPageHorizontal from "./AnimatedPageHorizontal";
// import "./Browser.css"; // Import the CSS file for the Browser component

const Browser = () => {
  // const [url, setUrl] = useState("");
  const { url, setUrl, currentContent, setCurrentContent, credAccessed, setCredAccessed } = useWindowContext();
  const [history, setHistory] = useState([]);
  // const [currentContent, setCurrentContent] = useState("Welcome to the Browser! Enter a URL to get started.");

  
  const eurobankSSHCred = { // if change here, do in sshVerify.js as well
    username: "admin",
    password: "bankEuro",
    host: "localhost",
    port: "1234"
  };

  const formatEurobankInfo = (info) => {
    return (
      <div>
        <h2 className="text-xl font-bold mb-4">SSH credentials (confidential)</h2>
      <table className="table-auto border-collapse border border-gray-400 w-full text-left">
        <thead>
          <tr>
            <th className="border border-gray-400 px-4 py-2">Field</th>
            <th className="border border-gray-400 px-4 py-2">Value</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(info).map(([key, value]) => (
            <tr key={key}>
              <td className="border border-gray-400 px-4 py-2">{key}</td>
              <td className="border border-gray-400 px-4 py-2">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2 className="text-xl font-bold mb-4">You have credentials now. Use this in terminal next, refer to Chatbot.</h2>

      </div>
      
    );
  };

  const urlMappings = {
    "https://www.google.com": "sundar pichai moment",
    "https://www.eurobank.eu/files": eurobankSSHCred,
    "https://www.eurobank.eu" : "Welcome to Euro Bank",
    "https://www.eurobank.eu/" : "Welcome to Euro Bank",
    "https://www.ohmygoddo.omg": { type: "image", src: ohMyGoddo },
  };

  const handleNavigate = (event) => {
    event.preventDefault();
    let trimmedUrl = url.trim();

    if (trimmedUrl === "") {
      return;
    }
    
    
    if (!trimmedUrl.startsWith("https://") && !trimmedUrl.startsWith("http://")) {
      if (trimmedUrl.startsWith("www.")) {
        trimmedUrl = "https://" + trimmedUrl;
        setUrl("https://" + url);
      } else {
        trimmedUrl = "https://www." + trimmedUrl;
        setUrl("https://www." + url);
      }
    }

    if (trimmedUrl === "https://www.eurobank.eu/files"){
      setCredAccessed(true);
    }

    let output;
    if (urlMappings[trimmedUrl]) {
      output = urlMappings[trimmedUrl];
    } else {
      output = `Invalid URL: ${trimmedUrl}`;
    }

    if (typeof output === "object" && output.host) {
      setCurrentContent(formatEurobankInfo(output));
    } else if (typeof output === "object" && output.type === "image") {
      setCurrentContent(<img src={output.src} alt="Browser content" />);
    } else {
      setCurrentContent(output);
    }

    setHistory([...history, { url: trimmedUrl, output }]);
  };

  const handleChange = (event) => {
    setUrl(event.target.value);
  };

  return (
    // <AnimatedPageHorizontal>
    <div className="bg-gray-900 text-white p-4 rounded-md h-lvh flex flex-col">
      <form onSubmit={handleNavigate} className="flex mb-4">
        <input
          type="text"
          value={url}
          onChange={handleChange}
          className="bg-gray-800 text-white flex-grow px-2 py-1 rounded-md"
          placeholder="eurobank.eu"
          autoFocus
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-1 rounded-md ml-2 hover:bg-blue-700"
        >
          Go
        </button>
      </form>
      <div className="bg-gray-800 p-4 rounded-lg text-xl flex-grow overflow-auto flex items-center justify-center">
        {currentContent}
      </div>
    </div>
    // {/* </AnimatedPageHorizontal> */}
  );
};

export default Browser;
