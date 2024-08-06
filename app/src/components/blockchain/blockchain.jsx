import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import "./Blockchain.css";
import AnimatedPage from '../AnimatedPage';

const Blockchain = ({ timer, setTimer, goToNextStep }) => {
  const [isOpen, setIsOpen] = useState(true); // Initially closed
  const [isPaperVisible, setIsPaperVisible] = useState(false);
  const [pvtKey, setPvtKey] = useState(''); // State to store the private key
  const [isKeyShown, setIsKeyShown] = useState(false); // State to track if the private key has been shown
  const [isNextVisible, setIsNextVisible] = useState(false); // State to control the visibility of the next button

  // Generate a random private key
  const genPvtKey = (length) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }

  // useEffect to run only once after the initial render
  useEffect(() => {
    let savedData = JSON.parse(localStorage.getItem('pvtKey'));
    if (!savedData || savedData.trim().length === 0) {
      let generatedPvtKey = genPvtKey(6);
      localStorage.setItem('pvtKey', JSON.stringify(generatedPvtKey));
    }
    savedData = JSON.parse(localStorage.getItem('pvtKey'));
    setPvtKey(savedData);

    let savedData2 = JSON.parse(localStorage.getItem('initialTimestamp'));
    if (!savedData2) {
      let initialTimestamp = Math.floor(Date.now() / 1000);
      localStorage.setItem('initialTimestamp', JSON.stringify(initialTimestamp));
    }
  }, []);

  const flapVariants = {
    closed: {
      translateY: "-100%",
      rotateX: 0,
      originY: 1
    },
    open: {
      translateY: "-100%",
      rotateX: -180,
      originY: 1
    }
  };

  const showPrivateKey = () => {
    setIsOpen(false); // Open the flap
    setIsKeyShown(true);
    setTimeout(() => {
      setIsPaperVisible(true); // Show the paper
      setTimeout(() => {setIsNextVisible(true);},2000) // Show the next button after a delay
    }, 1000); // Ensure the paper appears after the flap animation completes
  };

  const handleNextClick = () => {
    // navigate(`/level-3(2)?pvtKey=${pvtKey}`)
  };

  return (
    <AnimatedPage>
      <div className="flex flex-col justify-center items-center w-screen mt-40">
        <div className="relative flex flex-col gap-10 items-center">
          <motion.div
            className="z-30 absolute top-0 left-0 w-0 h-0 border-x-[35vw] border-x-transparent border-b-[10vh] border-b-gray-400 md:border-x-[10vw]"
            variants={flapVariants}
            initial="closed"
            animate={isOpen ? "open" : "closed"}
            transition={{ duration: 1, ease: "easeOut" }}
          />
          <div className=" rounded-lg z-20 h-[20vh] w-[70vw] bg-gray-400 border-gray-900 border-2 md:w-[20vw]"></div>
          <div className=" rounded-lg z-20 absolute top-0 left-0 w-0 h-0 border-x-[35vw] border-x-transparent border-t-[10vh] border-b-black md:border-x-[10vw]"></div>

          <AnimatePresence>
            {isPaperVisible && (
              <motion.div
                className="z-30 absolute top-0 bg-white w-[70vw] h-auto flex justify-center items-center flex-col md:w-[20vw] shadow-lg rounded-md p-4"
                initial={{ y: 0, opacity: 0 }}
                animate={{ y: -180, opacity: 1, transition: { delay: 0.5, duration: 0.5 } }}
                exit={{ x: 100, opacity: 0, transition: { duration: 0.2 } }}
              >
                <p className='text-gray-800 text-lg font-semibold'>Private Key-</p>
                <p className='text-red-600 text-bold text-xl font-mono'>{pvtKey}</p>
                <p className='text-gray-600 text-sm px-2 mt-2 text-center'>
                  Write down the private key somewhere before moving ahead.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Show Private Key Button */}
        {!isKeyShown && (
          <button
            className='bg-blue-700 text-white rounded-lg  text-xl px-4 py-2 mt-4 fixed bottom-10'
            onClick={showPrivateKey}
          >
            Show Private Key
          </button>
        )}

        {/* Next Button */}
        {isNextVisible && (
          <button
            className='bg-blue-700 text-white rounded-lg text-xl px-4 py-2 mb-4 fixed bottom-2'
            onClick={goToNextStep}
          >
            Next
          </button>
        )}
      </div>
    </AnimatedPage>
  );
};

export default Blockchain;
