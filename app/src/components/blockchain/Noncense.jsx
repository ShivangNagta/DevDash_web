import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Blockchain from './blockchain';
import TransactionMine from './transactionMine';
import BlockMine from './blockMine';
import AnimatedPage from '../AnimatedPage';


const Noncense = () => {

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const entryNumber = searchParams.get('entryNumber');


  const [timer, setTimer] = useState(1800);
  const [step, setStep] = useState(1);

  // Store time in cookies to avoid refresh loss
  useEffect(() => {
    const storedTimer = JSON.parse(localStorage.getItem('level3Time'));
    if (storedTimer) {
        setTimer(storedTimer);
    }
}, [])

  

useEffect(() => {
  if (timer > 0) {
    const timerInterval = setInterval(() => {
      setTimer(prevTimer => {
        const newTimer = prevTimer - 1;
        localStorage.setItem('level3Time', JSON.stringify(newTimer));
        return newTimer;
      });
    }, 1000);

    // Cleanup function to clear the interval when the component unmounts or when `timer` changes
    return () => clearInterval(timerInterval);
  }
}, [timer]);

//   useEffect(() => {
//     const handleBeforeUnload = (event) => {
//       event.preventDefault();
//       event.returnValue = ''; // For most browsers
//       return ''; // For older browsers
//     };

//     window.addEventListener('beforeunload', handleBeforeUnload);

//     return () => {
//       window.removeEventListener('beforeunload', handleBeforeUnload);
//     };
//   }, []);

    // Format timer for display
    const formatTimer = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const renderStepComponent = () => {
        switch (step) {
            case 1:
                return <Blockchain timer={timer} setTimer={setTimer} goToNextStep={() => setStep(2)} />;
            case 2:
                return <TransactionMine timer={timer} setTimer={setTimer} goToNextStep={() => setStep(3)} />;
            case 3:
                return <BlockMine timer={timer} setTimer={setTimer} goToNextStep={() => setStep(2)} entryNumber={entryNumber}/>;
            default:
                return null;
        }
    };

    return (

        <div className="flex flex-col items-center justify-center min-h-screen gap-5 p-5 bg-gray-900 text-white">
            <div className="top-0 w-full max-w-xs text-center mt-5 mb-5">
                <div className="text-lg font-bold mb-2">DevDash - Noncense</div>
                <div className="text-2xl">Timer: {formatTimer(timer)}</div>
            </div>
                {renderStepComponent()}
        </div>
    );
};

export default Noncense;
