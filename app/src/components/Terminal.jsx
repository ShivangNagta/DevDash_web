import React, { useState, useRef, useEffect, useContext } from "react";
import "./Terminal.css"; // Import the CSS file for the Terminal component
import sshVerify from "../Scripts/sshVerify"; // Import the SSH verification function
import Notepad from "./Notepad";
import { useWindowContext } from "../contexts/TerminalContext";
import AnimatedPageHorizontal from "./AnimatedPageHorizontal";

const Terminal = () => {

  const { terminalHistory, setTerminalHistory, sshVerified, setSshVerified } = useWindowContext();
  const [input, setInput] = useState("");
  // const [history, setHistory] = useState([]);
  // const [sshVerified, setSshVerified] = useState(false);
  const [notepadContent, setNotepadContent] = useState('');
  const [isNotepadOpen, setIsNotepadOpen] = useState(false);
  const terminalRef = useRef(null);

  const fileContent = `Azure database info:\n 
  Username: admin\n
  Password: ohmygoddo\n`;

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalHistory]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const command = input.trim();
    let output;

    if (command.startsWith('ssh')) {
      output = sshVerify(command);
      if (output === 'Verification successful.') {
        setSshVerified(true);
      } else {
        setSshVerified(false);
      }
    } else {
      output = executeCommand(command);
    }

    setTerminalHistory([...terminalHistory, { command, output }]);
    setInput('');

    if (command === 'clear') {
      setTerminalHistory([]);
      setIsNotepadOpen(false);
    }
  };

  const executeCommand = (command) => {
    if (command.startsWith('ssh')) {
      return sshVerify(command);
    }

    switch (command) {
      case 'ls':
        return sshVerified ? 'Files found.\n filename: azurecreds' : 'Please verify SSH first by running the ssh command.';
      case 'ls -a':
        return sshVerified ? 'Hidden files found:\n type oh my goddo in terminal' : 'Please verify SSH first by running the ssh command.';
      case 'cat azurecreds':
        if (sshVerified) {
          setNotepadContent(fileContent);
          setIsNotepadOpen(true);
          return 'Opening file...';
        } else {
          return 'Please verify SSH first by running the ssh command.';
        }
      case 'oh my goddo':
        return 'its salman kun\n yaha bhi hoga\n wha bhi hoga\n ab to saare jahan me hoga\n kya?\n mera hi jalwa';
      default:
        return `Command not found: ${command}`;
    }
  };

  const renderOutput = (output) => {
    return output
      .split("\n")
      .map((line, index) => <div key={index}>{line}</div>);
  };

  return (
    <AnimatedPageHorizontal>
      <div className="terminal">
        {isNotepadOpen ? (
        <Notepad
        content={notepadContent}
        onClose={() => setIsNotepadOpen(false)}
        fileName={"azureCreds.txt"}
      />
      ) : (
        <div className="history" ref={terminalRef}>
          {terminalHistory.map((item, index) => (
            <div key={index}>
              <div className="command">{`> ${item.command}`}</div>
              <div className="output">{renderOutput(item.output)}</div>
            </div>
          ))}
        </div>
      )}
      {!isNotepadOpen && (
        <form onSubmit={handleSubmit} className="form">
          <span className="prompt">{">"}</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="input"
            autoFocus
          />
        </form>
      )}
      </div>
    </AnimatedPageHorizontal>
  );
};

export default Terminal;
