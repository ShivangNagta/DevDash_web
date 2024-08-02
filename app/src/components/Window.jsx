import React, { useState, useEffect, useContext } from "react";
import Terminal from "./Terminal";
import Browser from "./Browser";
import MySQLTerminal from "./DataExplorer";
import HelpBot from "./HelpBot";
import { useLocation } from "react-router-dom";
import AnimatedPageHorizontal from "./AnimatedPageHorizontal";


const Window = () => {
  const components = [
    { name: "Browser", component: <Browser /> },
    { name: "Terminal", component: <Terminal /> },
    { name: "Azure", component: <MySQLTerminal /> }
    // Add more components as needed
  ];

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const entryNumber = searchParams.get('entryNumber');

  const [timer, setTimer] = useState(1800);

  // Store time in cookies to avoid refresh loss
  useEffect(() => {
    const storedTimer = JSON.parse(localStorage.getItem('level2Time'));
    if (storedTimer) {
        setTimer(storedTimer);
    }
}, [])
  

useEffect(() => {
  if (timer > 0) {
    const timerInterval = setInterval(() => {
      setTimer(prevTimer => {
        const newTimer = prevTimer - 1;
        localStorage.setItem('level2Time', JSON.stringify(newTimer));
        return newTimer;
      });
    }, 1000);

    // Cleanup function to clear the interval when the component unmounts or when `timer` changes
    return () => clearInterval(timerInterval);
  }
}, [timer]);


  const [currentComponentIndex, setCurrentComponentIndex] = useState(0);

  const toggleComponent = () => {
    setCurrentComponentIndex((prevIndex) => (prevIndex + 1) % components.length);
  };

  return (
    <AnimatedPageHorizontal>
      <div className="h-screen w-screen flex flex-col bg-gray-900 text-white">
        <div className="flex justify-between items-center bg-gray-800 text-white p-2">
          <span className="text-lg font-bold">{components[currentComponentIndex].name}</span>
          <button
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-1 rounded"
            onClick={toggleComponent}
          >
            Switch to {components[(currentComponentIndex + 1) % components.length].name}
          </button>
        </div>

        <div className=" bg-gray-900 h-full">
          {components[currentComponentIndex].component}
        </div>
        <HelpBot level={2} entryNumber={entryNumber} timer={timer} setTimer={setTimer} />
      </div>
    </AnimatedPageHorizontal>
  );
};


export default Window;
