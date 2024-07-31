import React, { useEffect, useState } from 'react';
import "./Blockchain.css";
import AnimatedPage from '../AnimatedPage';
import HelpBot from '../HelpBot';

const TransactionMine = ({ timer, setTimer, goToNextStep }) => {

  const frameRuleTime = 10;

  const [pvtKey, setPvtKey] = useState(''); // State to store the private key
  const [transaction, setTransaction] = useState(''); // State to store the transaction
  const [timeLeft, setTimeLeft] = useState(60000000);
  const [inputPubKey, setInputPubKey] = useState('');
  const [initialBlockNonce, setInitialBlockNonce] = useState(''); // State to store the block nonce
  const [currentTime, setTime] = useState( Math.floor(Date.now() / 1000));


  // Read cookies
  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem('pvtKey'));
    
    if (savedData) {
      setPvtKey(savedData);
    }

    let savedData2 = JSON.parse(localStorage.getItem('initialBlockNonce'));
    if (!savedData2 || savedData2.trim().length === 0) {
      let generatedInitialNonce = genInitialNonce();
      localStorage.setItem('initialBlockNonce', JSON.stringify(generatedInitialNonce));
    }
    savedData2 = JSON.parse(localStorage.getItem('initialBlockNonce'));
    setInitialBlockNonce(savedData2);

    // Exit early when we reach 0
    if (timeLeft === 0) return;

    // Save intervalId to clear the interval when the component re-renders
    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    // Clear interval on re-render to avoid memory leaks
    return () => clearInterval(intervalId);
    // Add timeLeft as a dependency to re-run the effect when we update it
  }, [timeLeft]);

  const pubKeyDerivation = (pvtKey) => {
    let pvtKeySplit = pvtKey.toLowerCase().split('');
    let toNum = "";
    for (let i = 0; i < pvtKeySplit.length; i++) {
      if (pvtKeySplit[i].match(/[a-z]/i)) {
        toNum += (pvtKeySplit[i].charCodeAt(0) - 96).toString();
      } else {
        toNum += pvtKeySplit[i];
      }
    }
    toNum = parseInt(toNum);

    toNum *= 1729;
    toNum = toNum % 1000000000;
    toNum = toNum.toString().split('');
    let pubKey = [];
    for (let i = 0; i < toNum.length; i++) {
      if (parseInt(toNum[i]) % 2 !== 0) {
        pubKey.push(String.fromCharCode(parseInt(toNum[i]) + 96));
      } else {
        pubKey.push(toNum[i]);
      }
    }
    return pubKey.join('');
  }

  const pubKey = pubKeyDerivation(pvtKey);

  // function to generate the nonce shown after the transaction is completed
  const genInitialNonce = () => {
    const date = new Date();
    var seed = date.getDate();

    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    let result = '';
    while (counter < 16) {
      result += characters.charAt(Math.floor(seededRandom(seed + counter) * charactersLength));
      counter += 1;
    }
    console.log(result)
    return result;
  }

  // Function to generate a random number from a seed
  function seededRandom(seed) {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputPubKey === pubKeyDerivation(pvtKey)) {
      setTransaction("Successful");
      setTimeLeft(frameRuleTime - (Math.floor(Date.now() / 1000) % frameRuleTime))
    } else {
      setTransaction("Failed");
    }
    console.log("Transaction: ", transaction);
  }

  const handleClick = () => {
    { goToNextStep };
  }

  

  return (
    <AnimatedPage>
      <div className="flex flex-col justify-center items-center h-screen w-screen p-4 bg-gray-900 text-white">
        {transaction !== "Successful" && (
          <div className="w-full max-w-lg">
            {/* <p className="text-center mb-4">{pubKey}</p> */}
            <div className="p-5 grid text-xl justify-items-center bg-gray-800 border-2 rounded-lg">
              <div>
                <div className='flex justify-between'>
                  <p className='text-center text-4xl pb-5'>Issue a transaction</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center gap-2">
                  <div className='flex flex-col'>
                    <label>Recipient</label>
                    <input readOnly={true} className="rounded-lg text-sm w-full p-2 bg-gray-700 text-white" placeholder="softcom_vault"></input>
                  </div>

                  <div className='flex flex-col'>
                    <label>Amount of SoftCoin</label>
                    <input type="number" className="rounded-lg text-sm w-full p-2 bg-gray-700 text-white" placeholder="42069"></input>
                  </div>

                  <div className='flex flex-col'>
                    <label>Public key</label>
                    <input
                      className="rounded-lg text-sm w-full p-2 bg-gray-700 text-white"
                      placeholder="Enter your Public key"
                      onChange={(e) => setInputPubKey(e.target.value)}
                    ></input>
                  </div>

                  <div className="grid grid-cols-2 gap-5 w-full mt-4">
                    <input type="submit" className="bg-blue-700 text-white rounded-lg p-2 cursor-pointer" value="Send"></input>
                    <input type="reset" className="bg-red-700 text-white rounded-lg p-2 cursor-pointer" value="Reset"></input>
                  </div>
                </form>
              </div>

              {transaction === "Failed" && (
                <div className='flex flex-col place-items-center mt-4'>
                  <p className='text-red-500 italic'>Wrong Public Key, try again...</p>
                </div>
              )}
            </div>
          </div>
        )}

{transaction === "Successful" && (
  <div className={`p-8 grid text-xl justify-items-center w-full max-w-lg border-2 ${timeLeft > 0 ? 'border-red-600 bg-red-800' : 'border-green-600 bg-green-800'} rounded-lg shadow-lg transition-colors duration-300`}>
    <div className='flex flex-col justify-items-center gap-6'>
      <p className='text-white text-2xl font-semibold text-center'>Transaction details correct, waiting to be added to block</p>
      <p className='text-white w-full text-center text-3xl font-bold'>{timeLeft > 0 ? `Time left: ${timeLeft}` : 'Transaction Complete!'}</p>
      {timeLeft <= 0 && <div>
        <div className='flex flex-col gap-3 w-full'>
        <p className='text-gray-300 text-lg font-medium'>Block Nonce: (Write it somewhere)</p>
        <p className='text-white font-mono text-lg bg-opacity-30 bg-white px-3 py-2 rounded'>{initialBlockNonce}</p>
        
      </div>
      <div className='flex flex-col gap-3 w-full'>
        <p className='text-gray-300 text-lg font-medium'>Transaction Number:</p>
        {timeLeft < 0 ? (
          <p className='text-white bg-opacity-30 bg-white px-3 py-3 rounded'></p>
        ) : (
          <p className='text-white font-mono text-lg bg-opacity-30 bg-white px-3 py-2 rounded'>54150</p>
        )}
      </div>
      <div className='flex flex-col gap-3 w-full'>
        <p className='text-gray-300 text-lg font-medium'>Timestamp:</p>
        {timeLeft < 0 ? (
          <p className='text-white bg-opacity-30 bg-white px-3 py-3 rounded'></p>
        ) : (
          <p className='text-white font-mono text-lg bg-opacity-30 bg-white px-3 py-2 rounded'>{currentTime}</p>
        )}
      </div>
      </div>}

      {/* <div className='flex flex-col gap-3 w-full'>
        <p className='text-gray-300 text-lg font-medium'>Block Nonce: (Write it somewhere)</p>
        {timeLeft > 0 ? (
          <p className='text-white bg-opacity-30 bg-white px-3 py-3 rounded'></p>
        ) : (
          <p className='text-white font-mono text-lg bg-opacity-30 bg-white px-3 py-2 rounded'>{initialBlockNonce}</p>
        )}
      </div>
      <div className='flex flex-col gap-3 w-full'>
        <p className='text-gray-300 text-lg font-medium'>Transaction Number:</p>
        {timeLeft > 0 ? (
          <p className='text-white bg-opacity-30 bg-white px-3 py-3 rounded'></p>
        ) : (
          <p className='text-white font-mono text-lg bg-opacity-30 bg-white px-3 py-2 rounded'>54150</p>
        )}
      </div>
      <div className='flex flex-col gap-3 w-full'>
        <p className='text-gray-300 text-lg font-medium'>Timestamp:</p>
        {timeLeft > 0 ? (
          <p className='text-white bg-opacity-30 bg-white px-3 py-3 rounded'></p>
        ) : (
          <p className='text-white font-mono text-lg bg-opacity-30 bg-white px-3 py-2 rounded'>{Math.floor(Date.now() / 1000)}</p>
        )}
      </div> */}

      {timeLeft === 0 && (
        <div className='flex place-items-center flex-col gap-4 mt-6'>
          <p className='italic text-xl'>Congrats! You are upgraded to a miner</p>
          <button
            className='bg-teal-700 text-white text-lg font-semibold px-6 py-3 rounded-lg transition-colors shadow-md'
            onClick={goToNextStep}
          >
            Next
          </button>
        </div>
      )}
    </div>
  </div>
)}
      </div>
      <HelpBot level={3} />
    </AnimatedPage>
  )
}

export default TransactionMine;
