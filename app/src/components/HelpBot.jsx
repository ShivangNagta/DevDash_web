import React, { useState, useEffect, useRef, useContext } from "react";
import ChatBot from "react-simple-chatbot";
import alluArjun from "../assets/alluArjun.png";
import ohMyGoddo from "../assets/ohMyGoddo.png";
import { useNavigate } from "react-router-dom";
import { SampleContext } from "../contexts/URLContext";
import { useWindowContext } from "../contexts/TerminalContext";

function sha256(ascii) {
  function rightRotate(value, amount) {
    return (value >>> amount) | (value << (32 - amount));
  }

  var mathPow = Math.pow;
  var maxWord = mathPow(2, 32);
  var lengthProperty = "length";
  var i, j; // Used as a counter across the whole file
  var result = "";

  var words = [];
  var asciiBitLength = ascii[lengthProperty] * 8;

  //* caching results is optional - remove/add slash from front of this line to toggle
  // Initial hash value: first 32 bits of the fractional parts of the square roots of the first 8 primes
  // (we actually calculate the first 64, but extra values are just ignored)
  var hash = (sha256.h = sha256.h || []);
  // Round constants: first 32 bits of the fractional parts of the cube roots of the first 64 primes
  var k = (sha256.k = sha256.k || []);
  var primeCounter = k[lengthProperty];
  /*/
  var hash = [], k = [];
  var primeCounter = 0;
  //*/

  var isComposite = {};
  for (var candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (i = 0; i < 313; i += candidate) {
        isComposite[i] = candidate;
      }
      hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
      k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
    }
  }

  ascii += "\x80"; // Append Ƈ' bit (plus zero padding)
  while ((ascii[lengthProperty] % 64) - 56) ascii += "\x00"; // More zero padding
  for (i = 0; i < ascii[lengthProperty]; i++) {
    j = ascii.charCodeAt(i);
    if (j >> 8) return; // ASCII check: only accept characters in range 0-255
    words[i >> 2] |= j << (((3 - i) % 4) * 8);
  }
  words[words[lengthProperty]] = (asciiBitLength / maxWord) | 0;
  words[words[lengthProperty]] = asciiBitLength;

  // process each chunk
  for (j = 0; j < words[lengthProperty]; ) {
    var w = words.slice(j, (j += 16)); // The message is expanded into 64 words as part of the iteration
    var oldHash = hash;
    // This is now the undefinedworking hash", often labelled as variables a...g
    // (we have to truncate as well, otherwise extra entries at the end accumulate
    hash = hash.slice(0, 8);

    for (i = 0; i < 64; i++) {
      var i2 = i + j;
      // Expand the message into 64 words
      // Used below if
      var w15 = w[i - 15],
        w2 = w[i - 2];

      // Iterate
      var a = hash[0],
        e = hash[4];
      var temp1 =
        hash[7] +
        (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) + // S1
        ((e & hash[5]) ^ (~e & hash[6])) + // ch
        k[i] +
        // Expand the message schedule if needed
        (w[i] =
          i < 16
            ? w[i]
            : (w[i - 16] +
              (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3)) + // s0
                w[i - 7] +
                (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))) | // s1
              0);
      // This is only used once, so *could* be moved below, but it only saves 4 bytes and makes things unreadble
      var temp2 =
        (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) + // S0
        ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2])); // maj

      hash = [(temp1 + temp2) | 0].concat(hash); // We don't bother trimming off the extra ones, they're harmless as long as we're truncating when we do the slice()
      hash[4] = (hash[4] + temp1) | 0;
    }

    for (i = 0; i < 8; i++) {
      hash[i] = (hash[i] + oldHash[i]) | 0;
    }
  }

  for (i = 0; i < 8; i++) {
    for (j = 3; j + 1; j--) {
      var b = (hash[i] >> (j * 8)) & 255;
      result += (b < 16 ? 0 : "") + b.toString(16);
    }
  }
  return result;
}

function caeserCipher(str, num) {
  num = num % 26;
  let lowerCaseString = str.toLowerCase();
  let alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
  let newString = "";
  for (let i = 0; i < lowerCaseString.length; i++) {
    let currentLetter = lowerCaseString[i];
    if (currentLetter === " ") {
      newString += currentLetter;
      continue;
    }
    let currentIndex = alphabet.indexOf(currentLetter);
    let newIndex = currentIndex + num;
    if (newIndex > 25) newIndex = newIndex - 26;
    if (newIndex < 0) newIndex = 26 + newIndex;
    if (str[i] === str[i].toUpperCase()) {
      newString += alphabet[newIndex].toUpperCase();
    } else newString += alphabet[newIndex];
  }
  return newString;
}

const HelpBot = ({ level = 1, entryNumber, timer, setTimer}) => {
  const navigate = useNavigate();
  const latestTimerRef = useRef(timer);


  // Update the ref whenever timer changes
  useEffect(() => {
    latestTimerRef.current = timer;
  }, [timer]);

  const NextLevelComponent = () => {
    const [localTimeTaken, setLocalTimeTaken] = useState(null);
    const { URL } = useContext(SampleContext)

    useEffect(() => {
      const capturedTimer = latestTimerRef.current;
      console.log(
        "NextLevelComponent effect running. Captured Timer value:",
        capturedTimer
      );

      const updateData = async () => {
        const currentTimeTaken = 1800 - capturedTimer;
        console.log(
          "Calculating time taken. Captured Timer:",
          capturedTimer,
          "Time taken:",
          currentTimeTaken
        );

        setLocalTimeTaken(currentTimeTaken);

        try {
          const formData = {
            entryNumber: entryNumber,
            timeTaken: currentTimeTaken,
          };

          console.log("Sending data to server:", formData);

          const response = await fetch(`${URL}/updateTime`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          });

          if (response.ok) {
            const data = await response.json();
            console.log("Server response:", data);
            setTimer(0); // Reset timer after successful update
          } else {
            console.error("Failed to update time. Status:", response.status);
            const errorText = await response.text();
            console.error("Error details:", errorText);
          }
        } catch (error) {
          console.error("Error updating time:", error.message);
        }
      };

      updateData();

      const timerId = setTimeout(() => {
        navigate(`/intro2?entryNumber=${entryNumber}`);
      }, 2000);

      return () => clearTimeout(timerId);
    }, []);

    return (
      <div>
        Redirecting to the next level.... Time taken:{" "}
        {localTimeTaken !== null ? localTimeTaken : "Calculating..."}
      </div>
    );
  };

  const getInitialSteps = (level) => {

  const blockNonce = localStorage.getItem('initialBlockNonce');
  const pvtKey = localStorage.getItem('pvtKey');
   
    if (level === 1) {
      return [
        {
          id: "1",
          message: "no bot required for this level",
          end: true,
        },
      ];
    } else if (level === 2) {
      return [
        {
          id: 1,
          message:"You have to name the hacker to complete this level. Steps to find the hacker's name:",
          trigger: 2,
        },
        {
          id: 2,
          message: "1. Use browser to find the ssh credentials to be used in terminal.",
          trigger: 3,
        },
        {
          id: 3,
          message: "2. Use terminal to open file containing Azure credentials.",
          trigger: 4,
        },
        {
          id: 4,
          message: "3. Use Azure to access the company's database to find the hacker's IP.",
          trigger: 5,
        },
        {
          id: 5,
          message: "Company's url: eurobank.eu",
          trigger: 6
        },
        {
          id: 6,
          message: "Hacking Date: 15/08/2024;  Hacking Time: 2200-2300 hrs GMT.",
          trigger: "choice-msg",
        },
        {
          id: "choice-msg",
          message: "Anything specific you need help with?",
          trigger: "choice",
        },
        {
          id: "choice",
          options: [
            { value: "browser", label: "Browser", trigger: "browser-help" },
            { value: "terminal", label: "Terminal", trigger: "terminal-help" },
            { value: "azure", label: "Azure", trigger: "azure-help" },
            {
              value: "hacker",
              label: "Name the hacker",
              trigger: "hacker-input-msg",
            },
          ],
        },
        {
          id: "browser-help",
          message:
            "Here you need to access bank's files to get ssh credentials, try manipulating url to get access to files.",
          trigger: "browser-help-extra",
        },
        {
          id: "browser-help-extra",
          message: "Add /files to the end of the url to access the company's files.",
          trigger: "choice-msg",
        },
        {
          id: "terminal-help",
          message: "Here you need to infiltrate the company's ssh-protected server to get files containing its Azure credentials.",
          trigger: "terminal-help-commands-msg",
        },
        {
          id: "terminal-help-commands-msg",
          message: "Here are the several commands you can use: (press enter in your keyboard to run the command)",
          trigger: "terminal-help-commands-table",
        },
        {
          id: "terminal-help-commands-table",
          component: <CommandTable />,
          trigger: "choice-msg",
        },
        {
          id: "azure-help",
          message: "The company's database is stored in Azure. You need to access it to find the hacker's IP.",
          trigger: "azure-help-date",
        },
        {
          id: "azure-help-date",
          message: "And remember, the hacking took place on 15th August 2024, between 2200 and 2300 hours GMT.",
          trigger: "azure-commands-msg",
        },
        {
          id: "azure-commands-msg",
          message: "Here are the several commands you can use:",
          trigger: "azure-commands-table",
        },
        {
          id: "azure-commands-table",
          component: <AzureCommandTable/>,
          trigger: "choice-msg",
        },
        {
          id: "hacker-input-msg",
          message: "Type the name of the hacker(enter random name if you don't know yet)",
          trigger: "hacker-input",
        },
        {
          id: "hacker-input",
          user: true,
          trigger: (inputValue) => {
            if (inputValue.value.toLowerCase() === "grace") {
              return "congo-msg";
            } else {
              return "wrong-ans";
            }
          },
        },
        {
          id: "congo-msg",
          message: "Correct answer! You found the hacker!",
          trigger: "next-level",
        },
        {
          id: "next-level",
          component: <NextLevelComponent />,
          end: true,
        },
        {
          id: "wrong-ans",
          message: "Wrong answer. Try again!",
          trigger: "choice-msg",
        },
      ];
    } else if (level === 3) {
      return [
        {
          id: 1,
          message: "Welcome to Noncense! Here you will learn how to perform a transaction using your private key.",
          trigger: 'ask-pvtKey',
        },
        {
          id: 'ask-pvtKey',
          message: "First off, do you remember your private key?",
          trigger: 'ask-pvtKey-options',
        },
        {
          id: 'ask-pvtKey-options',
          options: [
            { value: "yes", label: "Yes", trigger: "do-know" },
            { value: "no", label: "No", trigger: "dont-know" },
          ]
        },
        {
          id: 'do-know',
          message: "Great, but I'm gonna tell you anyways.",
          trigger: 'give-pvtKey'
        },
        {
          id: 'dont-know',
          message: "Thou art disappointing, foolish child. Yet, fret not, for I am here for thee.",
          trigger: 'give-pvtKey'
        },
        {
          id: 'give-pvtKey',
          message: "Your private key is: " + pvtKey,
          trigger: 2
        },
        {
          id: 2,
          message: "Now that you have your private key, follow these steps to obtain your public key:",
          trigger: 3,
        },
        {
          id: 3,
          message:
            "1. First, replace the letters by their number equivalent such that 'A/a=1, B/b=2, ...' (capitalized or not doesn't matter).",
          trigger: 4,
        },
        {
          id: "3-extra",
          message: "For example: k1a7fk2a9 -> 11117611219",
          trigger: "choice-msg",
        },
        {
          id: 4,
          message:
            "2. Next, multiply by 1729. You can use your calculator for this.",
          trigger: 5,
        },
        {
          id: "4-extra",
          message: "For example: 11117611219 -> 19222349797651",
          trigger: "choice-msg",
        },
        {
          id: 5,
          message: "3. Take the last 9 digits of the result.",
          trigger: 6,
        },
        {
          id: "5-extra",
          message: "For example: 19222349797651 -> 349797651",
          trigger: "choice-msg",
        },
        {
          id: 6,
          message: "4. Convert every odd number to its letter equivalent. Keep the letters lowercase.",
          trigger: 7,
        },
        {
          id: "6-extra",
          message: "For example: 349797651 -> c4igi6ea",
          trigger: "choice-msg",
        },
        {
          id: 7,
          message:
            "Done! You have your public key. Use it to issue your transaction.",
          trigger: "choice-msg",
        },
        {
          id: "choice-msg",
          message: "Any specific step you need help with?",
          trigger: "choice",
        },
        {
          id: "choice",
          options: [
            { value: 1, label: "1st", trigger: "3-extra" },
            { value: 2, label: "2nd", trigger: "4-extra" },
            { value: 3, label: "3rd", trigger: "5-extra" },
            { value: 4, label: "4th", trigger: "6-extra" },
          ],
        },
      ];
    } else if (level === "blockmine") {
      return [
        {
          id: 1,
          message:
            "You are ready to mine your block. To get block nonce, you will require sha256 and caesar cipher encryption methods. Let's start!",
          trigger: "ask-nonce",
        },
        {
          id: 'ask-nonce',
          message: "First off, do you remember your previous transaction's block nonce?",
          trigger: 'ask-nonce-options',
        },
        {
          id: 'ask-nonce-options',
          options: [
            { value: "yes", label: "Yes", trigger: "do-know" },
            { value: "no", label: "No", trigger: "dont-know" },
          ]
        },
        {
          id: 'do-know',
          message: "Great, but I'm gonna tell you anyways.",
          trigger: 'give-nonce'
        },
        {
          id: 'dont-know',
          message: "Thou art disappointing, foolish child. Yet, fret not, for I am here for thee.",
          trigger: 'give-nonce'
        },
        {
          id: 'give-nonce',
          message: "Your previous transaction's block nonce is: " + blockNonce,
          trigger: 'step-1'
        },
        {
          id: 'step-1',
          message: "1. Isolate letters and numbers",
          trigger: "step-2",
        },
        {
          id: 'step-2',
          message: "2. Use caesar cipher to encrypt the letters. I can help you with that if you want.",
          trigger: "step-3",
        },
        {
          id: 'step-3',
          message: "3. Add numbers to the end(in order) of this encryption and pass it through SHA-256.",
          trigger: "steps-done",
        },
        {
          id: 'steps-done',
          message: "4. The hash you get is your block nonce! Use this with your public key to mine the block.",
          trigger: "choice-msg",
        },
        {
          id: "steps-help",
          options: [
            { value: "1", label: "1st", trigger: "1-extra" },
            { value: "2", label: "2nd", trigger: "2-extra" },
            { value: "3", label: "3rd", trigger: "3-extra" },
          ]
        },
        {
          id: '1-extra',
          message: "For example: “m6r949mat7r1x” ->  “mrmatrx” and “694971”",
          trigger: "after-initial-choice",
        },
        {
          id: '2-extra',
          message: "For example: “mrmatrx” -> “pupdwua” with shift 3",
          trigger: "after-initial-choice",
        },
        {
          id: '3-extra',
          message: "For example: hash of “pupdwua694971” -> 594562439dc1c180df219f27e918efa15bfdc615ef7aa40fa8338540a40faae5",
          trigger: "after-initial-choice",
        },
        {
          id: "choice-msg",
          message: "Anything you need help with?",
          trigger: "choice",
        },
        {
          id: "after-initial-choice",
          message: "Anything else you need help with?",
          trigger: "choice",
        },
        {
          id: "choice",
          options: [
            { value: "SHA-256", label: "SHA-256", trigger: "sha256-msg" },
            {
              value: "Caeser Cipher",
              label: "Caesar Cipher",
              trigger: "caeser-string-msg",
            },
            { value: "extra-help", label: "Help with steps", trigger: "steps-help" },
          ],
        },
        {
          id: "sha256-msg",
          message: "Enter the string to encrypt with sha256:",
          trigger: "sha256",
        },
        {
          id: "sha256",
          user: true,
          trigger: "sha256-response",
        },
        {
          id: "sha256-response",
          component: <SHA256Component />,
          asMessage: true,
          trigger: "after-initial-choice",
        },
        {
          id: "caeser-string-msg",
          message: "Enter the string to encrypt with Caesar Cipher:",
          trigger: "caeser-string-input",
        },
        {
          id: "caeser-string-input",
          user: true,
          trigger: "caeser-computation",
        },
        // {
        //   id: "caeser-shift-msg",
        //   message: "Enter the shift number:",
        //   trigger: "caeser-shift-input",
        // },
        // {
        //   id: "caeser-shift-input",
        //   user: true,
        //   validator: (value) => {
        //     if (isNaN(value)) {
        //       return "Please enter a valid number.";
        //     }
        //     return true;
        //   },
        //   trigger: "caeser-computation",
        // },
        {
          id: "caeser-computation",
          component: <CaeserCipherComponent />,
          asMessage: true,
          trigger: "after-initial-choice",
        },
      ];
    } else {
      return [
        {
          id: 1,
          message: "Invalid level moment.",
          end: true,
        },
      ];
    }
  };

  const [steps] = useState(getInitialSteps(level));

  const theme = {
    background: "#333",
    headerBgColor: "#444",
    headerFontColor: "#fff",
    botBubbleColor: "#555",
    botFontColor: "#fff",
    userBubbleColor: "#666",
    userFontColor: "#fff",
  };


  return (
    <div>
      <ChatBot
        steps={steps}
        floating={true}
        style={{ background: theme.background }}
        contentStyle={{ background: theme.background }}
        botAvatar={alluArjun}
        userAvatar={ohMyGoddo}
        headerTitle="Mr. Perfect"
        hideUserAvatar={true}
        customStyle={{
          backgroundColor: theme.background,
          color: theme.headerFontColor,
        }}
      />
    </div>
  );
};

const CaeserCipherComponent = ({ steps }) => {
  const caeserString = caeserCipher(
    steps["caeser-string-input"].value,
    3
  );
  return (
    <div style={{ wordWrap: "break-word", whiteSpace: "pre-wrap" }}>
      Caesar Cipher Encrypted String: {caeserString}
    </div>
  );
};

const SHA256Component = ({ previousStep }) => {
  const encryptedString = sha256(previousStep.message);
  return (
    <div style={{ wordWrap: "break-word", whiteSpace: "pre-wrap" }}>
      SHA-256 Encrypted String: {encryptedString}
    </div>
  );
};

const CommandTable = () => {
  
  const {credAccessed, setCredAccessed} = useWindowContext();
  const commands = [
    // { command: "1. ssh username@host -p port => password", function: " : to gain files access" },
    // { command: "   ssh admin@localhost -p 1234 => bankEuro", function: "" },
    { command: "1. ls", function: " : list files" },
    // { command: "3. ls -a", function: " : list all files (including hidden)" },
    // { command: "3. clear", function: " : clear terminal" },
    { command: "2. cat filename", function: " : to open file" }
  ];

  return (
    <div className="table-responsive" style={{ overflowX: "auto" }}>
      <table className="table text-nowrap">
        <thead>
      { credAccessed ? <tr> 
          <tr>Copy this to terminal to access the system:</tr>
          <tr>ssh admin@localhost -p 1234 =&gt; bankEuro</tr> 
          </tr> : <tr> <td> You haven't accessed SSH creds yet! </td></tr> }
        </thead>
      </table>
      <table className="table text-nowrap">
        <thead>
          <tr>
            <th>Command</th>
            <th>Function</th>
          </tr>
        </thead>
        <tbody>
        

          {commands.map((row, index) => (
            
            <tr key={index}>
              
              <td>{row.command}</td>
              <td>{row.function}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const AzureCommandTable = () => {
  const commands = [
    { command: "1. show tables", function: " : Show all tables stored in database" },
    { command: "2. select * from table-name", function: " : Show all records from a table" },
    // { command: "3. describe table-name", function: " : Describe the table" },
  ];

  return (
    <div className="table-responsive" style={{ overflowX: "auto" }}>
      <table className="table text-nowrap">
        <thead>
          <tr>
            <th>Command</th>
            <th>Function</th>
          </tr>
        </thead>
        <tbody>
          {commands.map((row, index) => (
            <tr key={index}>
              <td>{row.command}</td>
              <td>{row.function}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


// const RedirectComponent = ({ navigate, entryNumber, timer, setTimer }) => {
//   let timeTaken = 0
//   useEffect(() => {
//     const updateData = async () => {
//       try {
//         timeTaken = 1200 - timer; // Calculate time taken to complete the level
//         const formData = {
//           entryNumber: entryNumber,
//           timeTaken: timeTaken
//         };

//         const response = await fetch('http://localhost:3000/updateTime', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(formData),
//         });

//         if (response.ok) {
//           console.log('Time updated successfully');
//           setTimer(0); // Update the timer after the fetch request completes successfully
//         } else {
//           console.error('Failed to update time');
//         }
//       } catch (error) {
//         console.error('Error updating time:', error);
//       }
//     };

//     updateData();
//   }, [entryNumber, setTimer, timer]);

//   useEffect(() => {
//     const timerId = setTimeout(() => {
//       navigate(`/intro2?entryNumber=${entryNumber}`);
//     }, 2000);

//     return () => clearTimeout(timerId);
//   }, [navigate, entryNumber]);

//   return <div>Redirecting to the next level....{timeTaken}</div>;
// };

export default HelpBot;
