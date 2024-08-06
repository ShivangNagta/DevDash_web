import React, { useState } from "react";
import { useWindowContext } from "../contexts/TerminalContext";
import AnimatedPageHorizontal from "./AnimatedPageHorizontal";

const MySQLTerminal = () => {
  const { mysqlHistory, setMysqlHistory, authenticated, setAuthenticated } = useWindowContext();
  const [input, setInput] = useState("");
  // const [history, setHistory] = useState([]);
  // const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (event) => {
    event.preventDefault();
    if (username === "admin" && password === "ohmygoddo") {
      setAuthenticated(true);
    } else {
      alert("Invalid username or password");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const command = input.trim().toLowerCase();
    console.log(command);

    let result;
    switch (command) {
      case "select * from employees":
        result = [
          {
            Employee: "Aegon Targaryen",
            Age: 25,
            IP: "192.168.1.1",
            Designation: "Analyst",
          },
          {
            Employee: "Rob Stark",
            Age: 30,
            IP: "192.168.1.2",
            Designation: "Senior Analyst",
          },
          // culprit for 3rd sesh
          {
            Employee: "Charles",
            Age: 28,
            IP: "192.168.1.3",
            Designation: "Financial Advisor",
          },
          {
            Employee: "Steve Jobs",
            Age: 32,
            IP: "192.168.1.4",
            Designation: "Branch Manager",
          },
          {
            Employee: "Sarvo",
            Age: 29,
            IP: "192.168.1.5",
            Designation: "Loan Officer",
          },
          {
            Employee: "Jonas Kahnwald",
            Age: 25,
            IP: "192.168.1.6",
            Designation: "Customer Service Representative",
          },
          // The culprit for 2nd sesh
          {
            Employee: "Stanley",
            Age: 27,
            IP: "192.168.1.7",
            Designation: "IT Specialist",
          },
          {
            Employee: "Heidi",
            Age: 24,
            IP: "192.168.1.8",
            Designation: "Cybersecurity Specialist",
          },
          {
            Employee: "Mutahar Anas",
            Age: 31,
            IP: "192.168.2.1",
            Designation: "Investment Banker",
          },
          {
            Employee: "Chloe Couture",
            Age: 36,
            IP: "192.168.3.1",
            Designation: "Compliance Officer",
          },
          // The culprit for 5th sesh, 
          // if you change name here, you need to change the culprit name in HelpBot.jsx as well(id: hacker-input)
          {
            Employee: "Kenny",
            Age: 33,
            IP: "192.168.4.1",
            Designation: "Risk Manager",
          },
          {
            Employee: "Lee Everett",
            Age: 29,
            IP: "192.168.4.2",
            Designation: "Treasury Analyst",
          },
          {
            Employee: "Malenia",
            Age: 22,
            IP: "192.168.4.3",
            Designation: "Bank Teller",
          },
        ];
        break;
      case "show tables":
        result = [
          { Tables_in_database: "Employees" },
          { Tables_in_database: "OutboundNetworkEvents" },
        ];
        break;
      case "describe employees":
        result = [
          { Field: "Employee", Type: "varchar(255)" },
          { Field: "Age", Type: "int" },
          { Field: "Designation", Type: "varchar(255)" },
          { Field: "IP", Type: "varchar(255)" },
        ];
        break;
      case "select * from outboundnetworkevents":
        console.log("found case");
        result = [
          {
            Event_ID: "001",
            URL: "eurobank.eu",
            Employee_IP: "192.168.1.1",
            Event_Date: "2024-07-08",
            Event_Time: "21:30 GMT",
          },
          {
            Event_ID: "002",
            URL: "jpmorgan.com",
            Employee_IP: "192.168.1.2",
            Event_Date: "2024-07-10",
            Event_Time: "21:45 GMT",
          },
          {
            Event_ID: "003",
            URL: "eurobank.eu",
            Employee_IP: "192.168.1.7",
            Event_Date: "2024-07-14",
            Event_Time: "22:00 GMT",
          },
          {
            Event_ID: "004",
            URL: "eurobank.eu",
            Employee_IP: "192.168.1.4",
            Event_Date: "2024-07-15",
            Event_Time: "19:30 GMT",
          },
          {
            Event_ID: "005",
            URL: "eurobank.eu",
            Employee_IP: "192.168.1.5",
            Event_Date: "2024-07-15",
            Event_Time: "20:45 GMT",
          },
          {
            Event_ID: "006",
            URL: "axisbank.com",
            Employee_IP: "192.168.2.1",
            Event_Date: "2024-07-11",
            Event_Time: "21:30 GMT",
          },
          {
            Event_ID: "007",
            URL:
              "google.com",
            Employee_IP: "192.168.1.6",
            Event_Date: "2024-07-14",
            Event_Time: "22:55 GMT",
          },
          // culprit
          {
            Event_ID: "008",
            URL: "jpmorgan.com",
            Employee_IP: "192.168.4.1",
            Event_Date: "2024-07-15",
            Event_Time: "22:10 GMT",
          },
          {
            Event_ID: "009",
            URL: "icicibank.com",
            Employee_IP: "192.168.3.1",
            Event_Date: "2024-07-15",
            Event_Time: "21:30 GMT",
          },
          {
            Event_ID: "010",
            URL: "jpmorgan.com",
            Employee_IP: "192.168.1.3",
            Event_Date: "2024-07-15",
            Event_Time: "21:20 GMT",
          },
        ];
        break;
        case "describe outboundnetworkevents":
          result = [
            { Field: "Event_ID", Type: "varchar(255)" },
            { Field: "URL", Type: "varchar(255)" },
            { Field: "Employee_IP", Type: "varchar(255)" },
            { Field: "Event_Date", Type: "date" },
            { Field: "Event_Time", Type: "time" },
          ];
          break;
      default:
        result = `Error: Invalid command - "${command}". Check syntax or if table exists. `;
        break;
    }

    const commandOutput = Array.isArray(result) ? formatOutput(result) : result;
    const historyEntry = { command, output: commandOutput };
    setMysqlHistory([...mysqlHistory, historyEntry]); // Append new entry to history
    setInput("");
  };

  const createTableLine = (columnWidths) => {
    // width+2 to accomodate for trailing spaces in table elements
    return (
      columnWidths.map((width) => `+${"-".repeat(width + 2)}`).join("") + "+"
    );
  };

  const formatOutput = (data) => {
    if (Array.isArray(data)) {
      if (data.length === 0) return "Empty set.";
      const headers = Object.keys(data[0]);
      const columnWidths = headers.map((header) =>
        Math.max(
          header.length,
          ...data.map((row) => row[header].toString().length)
        )
      );
      const separatorRow = createTableLine(columnWidths);
      const headerRow = `| ${headers
        .map((header, i) => header.padEnd(columnWidths[i]))
        .join(" | ")} |`;
      const bodyRows = data
        .map(
          (row) =>
            `| ${headers
              .map((header, i) =>
                row[header].toString().padEnd(columnWidths[i])
              )
              .join(" | ")} |`
        )
        .join("\n");
      return `${separatorRow}\n${headerRow}\n${separatorRow}\n${bodyRows}\n${separatorRow}`;
    } else {
      return data;
    }
  };

  const renderOutput = (output) => {
    return output
      .split("\n")
      .map((line, index) => <div key={index}>{line}</div>);
  };

  if (!authenticated) {
    return (
      <AnimatedPageHorizontal>
      <div className="bg-black text-white p-4 h-lvh flex flex-col items-center justify-center">
        <div className="mb-4 text-lg font-bold">Authenticate to proceed</div>
        <form onSubmit={handleLogin} className="flex flex-col">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="bg-gray-800 text-white px-2 py-1 mb-2 rounded"
            autoFocus
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="bg-gray-800 text-white px-2 py-1 mb-2 rounded"
          />
          <button
            type="submit"
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-1 rounded"
          >
            Login
          </button>
        </form>
      </div>
      </AnimatedPageHorizontal>
    );
  }

  return (
    <AnimatedPageHorizontal>
    <div className="bg-black text-white p-4 h-lvh flex flex-col">
      <div className="overflow-y-auto flex-grow">
        {mysqlHistory.map((entry, index) => (
          <div key={index}>
            <div className="command">{`> ${entry.command}`}</div>
            <div className="output whitespace-pre-wrap text-nowrap overflow-x-auto">
              <code>{entry.output}</code>
            </div>
          </div>
        ))}
        <form onSubmit={handleSubmit} className="mt-2 flex">
        <span className="prompt">{">"}</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="bg-black text-white flex-grow rounded focus:outline-none"
          autoFocus
        />
      </form>
      </div>
      
    </div>
    </AnimatedPageHorizontal>
  );
};

export default MySQLTerminal;
