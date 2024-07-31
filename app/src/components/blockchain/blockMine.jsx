import React, { useEffect, useState, useContext } from 'react';

import "./Blockchain.css";
import AnimatedPage from '../AnimatedPage';
import HelpBot from '../HelpBot';
import { SampleContext } from '../../contexts/URLContext';

function sha256(ascii) {
    function rightRotate(value, amount) {
        return (value >>> amount) | (value << (32 - amount));
    };


    var mathPow = Math.pow;
    var maxWord = mathPow(2, 32);
    var lengthProperty = 'length'
    var i, j; // Used as a counter across the whole file
    var result = ''

    var words = [];
    var asciiBitLength = ascii[lengthProperty] * 8;

    //* caching results is optional - remove/add slash from front of this line to toggle
    // Initial hash value: first 32 bits of the fractional parts of the square roots of the first 8 primes
    // (we actually calculate the first 64, but extra values are just ignored)
    var hash = sha256.h = sha256.h || [];
    // Round constants: first 32 bits of the fractional parts of the cube roots of the first 64 primes
    var k = sha256.k = sha256.k || [];
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
            hash[primeCounter] = (mathPow(candidate, .5) * maxWord) | 0;
            k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
        }
    }

    ascii += '\x80' // Append Ƈ' bit (plus zero padding)
    while (ascii[lengthProperty] % 64 - 56) ascii += '\x00' // More zero padding
    for (i = 0; i < ascii[lengthProperty]; i++) {
        j = ascii.charCodeAt(i);
        if (j >> 8) return; // ASCII check: only accept characters in range 0-255
        words[i >> 2] |= j << ((3 - i) % 4) * 8;
    }
    words[words[lengthProperty]] = ((asciiBitLength / maxWord) | 0);
    words[words[lengthProperty]] = (asciiBitLength)

    // process each chunk
    for (j = 0; j < words[lengthProperty];) {
        var w = words.slice(j, j += 16); // The message is expanded into 64 words as part of the iteration
        var oldHash = hash;
        // This is now the undefinedworking hash", often labelled as variables a...g
        // (we have to truncate as well, otherwise extra entries at the end accumulate
        hash = hash.slice(0, 8);

        for (i = 0; i < 64; i++) {
            var i2 = i + j;
            // Expand the message into 64 words
            // Used below if 
            var w15 = w[i - 15], w2 = w[i - 2];

            // Iterate
            var a = hash[0], e = hash[4];
            var temp1 = hash[7]
                + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) // S1
                + ((e & hash[5]) ^ ((~e) & hash[6])) // ch
                + k[i]
                // Expand the message schedule if needed
                + (w[i] = (i < 16) ? w[i] : (
                    w[i - 16]
                    + (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3)) // s0
                    + w[i - 7]
                    + (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10)) // s1
                ) | 0
                );
            // This is only used once, so *could* be moved below, but it only saves 4 bytes and makes things unreadble
            var temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) // S0
                + ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2])); // maj

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
            result += ((b < 16) ? 0 : '') + b.toString(16);
        }
    }
    return result;
};


const BlockMine = ({ timer, setTimer, goToNextStep, entryNumber}) => {
    const [minedSuccesfully, setMinedSuccessfully] = useState('')
    const [pvtKey, setPvtKey] = useState('')
    const [inputPubKey, setInputPubKey] = useState('');
    const [InputBlockNonce, setInputBlockNonce] = useState('');
    const [finalBlockNonce, setFinalBlockNonce] = useState('')
    const [initialBlockNonce, setInitialBlockNonce] = useState('');
    const [duration, setDuration] = useState(0);
    const [percentage, setPercentage] = useState(0);
    const [fetchCompleted, setFetchCompleted] = useState(false);
    let timeTaken = 0;

    const { URL } = useContext(SampleContext)

    // const pushTodb = () => {
    //     const initialTimestamp = JSON.parse(localStorage.getItem('initialTimestamp'));
    //     const finalTimestamp = Math.floor(Date.now() / 1000);
    //     setDuration(finalTimestamp - parseInt(initialTimestamp));
    //     console.log("Duration:", duration)
    // }

    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1; // Months are zero-based, so add 1
    let year = date.getFullYear();
    let currentDate = `${day}-${month}-${year}`;




    useEffect(() => {
        const updateData = async () => {
            timeTaken = 1800 - parseInt(timer); // Calculate time taken to complete the level
            if (minedSuccesfully === "Successfull" && !fetchCompleted) {
                const formData = {
                    entryNumber: entryNumber,
                    timeTaken: timeTaken
                };

                await fetch(`${URL}/updateTime`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                setTimer(0);

                await fetch(`${URL}/setIsEnd`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ entryNumber }),
                });

                setFetchCompleted(true); // Mark fetch as completed
            }
        };

        updateData();
    }, [minedSuccesfully, fetchCompleted]);


    // useEffect(() => {
    //     timeTaken = 1200 - parseInt(timer);
    //     if (timeTaken >= 19 && !fetchCompleted) {
    //         const intervalId = setInterval(async () => {
    //             try {
    //                 const formData = {
    //                     entryNumber: entryNumber,
    //                     timeTaken: timeTaken
    //                 };
    
    //                 // Update time taken
    //                 await fetch('http://localhost:3000/updateTime', {
    //                     method: 'POST',
    //                     headers: {
    //                         'Content-Type': 'application/json',
    //                     },
    //                     body: JSON.stringify(formData),
    //                 });
    
    //                 // Set isEnd to true
    //                 await fetch('http://localhost:3000/setIsEnd', {
    //                     method: 'POST',
    //                     headers: {
    //                         'Content-Type': 'application/json',
    //                     },
    //                     body: JSON.stringify({ entryNumber }),
    //                 });
    
    //                 console.log('Time updated and isEnd set.');
    
    //                 // Set fetchCompleted to true
    //                 setFetchCompleted(true);
    
    //                 // Redirect to resultPage after actions are completed
    //                 window.location.href = `/resultPage`;
    //             } catch (error) {
    //                 console.error('Failed to update time or set isEnd:', error);
    //             }
    //         }, 1000);
    
    //         // Cleanup interval on component unmount
    //         return () => clearInterval(intervalId);
    //     }
    //     console.log(timeTaken)
    // }, [timeTaken, fetchCompleted]);
    


    const fetchPercentageComplete = async () => {
        try {
            const response = await fetch(`${URL}/percentageComplete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ date: currentDate }),
            });

            if (response.ok) {
                const data = await response.json();
                setPercentage(data.percentageComplete);

            } else {
                console.error('Failed to fetch percentage complete:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching percentage complete:', error);
        }
    };

    


    useEffect(() => {
        if (minedSuccesfully === "Successfull"){
            const interval = setInterval(() => {
                fetchPercentageComplete();
            }, 3000); // Check percentage every 5 seconds
    
            return () => clearInterval(interval);
        }

    }, );

    useEffect(() => {
        console.log(minedSuccesfully)
        if (percentage > 51 && minedSuccesfully === "Successfull") {
            window.location.href = `/resultPage`
        }
    },);







    useEffect(() => {
        const savedData = JSON.parse(localStorage.getItem('pvtKey'));
        if (savedData) {
            setPvtKey(savedData);
        }

        const savedData2 = JSON.parse(localStorage.getItem('initialBlockNonce'));
        if (savedData2) {
            setInitialBlockNonce(savedData2);
        }

        const fetchFinalBlockNonce = () => {
            let savedData3 = JSON.parse(localStorage.getItem('finalBlockNonce'));
            if (!savedData3 || savedData3.trim().length === 0) {
                let generatedFinalNonce = generateBlockNonce(initialBlockNonce);
                localStorage.setItem('finalBlockNonce', JSON.stringify(generatedFinalNonce));
            }
            savedData3 = JSON.parse(localStorage.getItem('finalBlockNonce'));
            let savedData4 = generateBlockNonce(initialBlockNonce)
            setFinalBlockNonce(savedData4);
        };
        fetchFinalBlockNonce();


    }, [initialBlockNonce])

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
        // toNum = toNum % 1000000000;
        toNum = toNum.toString().split('');
        toNum = toNum.slice(-9);
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

    const generateBlockNonce = (lastBlockNonce) => {
        let lastBlockNonceM = lastBlockNonce.split('');
        let letters = '';
        let numbers = '';
        for (let i = 0; i < lastBlockNonceM.length; i++) {
            if (lastBlockNonceM[i].match(/[a-z]/i)) {
                letters += lastBlockNonceM[i];
            } else {
                numbers += lastBlockNonceM[i];
            }
        }
        let newNonce = caeserCipher(letters, 3) + numbers;
        console.log("oo my goddo ")
        // console.log(sha256(newNonce))
        return sha256(newNonce);

    }

    // caeser cipher used in the final nonce generation
    function caeserCipher(str, num) {
        num = num % 26;
        let lowerCaseString = str.toLowerCase();
        let alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
        let newString = '';
        for (let i = 0; i < lowerCaseString.length; i++) {
            let currentLetter = lowerCaseString[i];
            if (currentLetter === ' ') {
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


    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputPubKey === pubKeyDerivation(pvtKey) && InputBlockNonce === finalBlockNonce) {
            setMinedSuccessfully("Successfull");
            // pushTodb();
        } else {
            setMinedSuccessfully("Failed");
        }
        console.log("Mining:", minedSuccesfully);
    }

    return (
        <AnimatedPage>
            <div className="min-h-screen w-full bg-gray-900 flex flex-col justify-center items-center p-4">
                {minedSuccesfully !== "Successfull" && (
                    <div className="p-8 grid text-xl justify-items-center w-full max-w-2xl bg-gray-800 border-2 rounded-lg shadow-lg">
                        <div className="w-full">
                            <h2 className='text-center text-4xl font-bold text-white pb-6'>Mine Block</h2>
{/*                             <p className='text-xs text-gray-300 mb-2'>{finalBlockNonce}</p>
                            <p className='text-sm text-gray-300 mb-4'>{pubKey}</p> */}
                            <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center gap-4">
                                <div className='flex flex-col w-full'>
                                    <label className="mb-1">Block Nonce</label>
                                    <input
                                        className="rounded-lg text-sm w-full p-3 bg-gray-700 text-white"
                                        onChange={(e) => setInputBlockNonce(e.target.value)}
                                    />
                                </div>

                                <div className='flex flex-col w-full'>
                                    <label className="mb-1">Public key</label>
                                    <input
                                        className="rounded-lg text-sm w-full p-3 bg-gray-700 text-white"
                                        placeholder="Enter your Public key"
                                        onChange={(e) => setInputPubKey(e.target.value)}
                                    />
                                </div>

                                <div className='flex flex-col w-full'>
                                    <label className="mb-1">Transaction Number</label>
                                    <input 
                                        readOnly={true} 
                                        className="rounded-lg text-sm w-full p-3 bg-gray-700 text-white" 
                                        placeholder="54151"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4 w-full mt-4">
                                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg p-3 transition-colors duration-300">Mine</button>
                                    <button type="reset" className="bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg p-3 transition-colors duration-300">Reset</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {minedSuccesfully === "Failed" && (
                    <div className="p-6 mt-4 text-xl text-center w-full max-w-2xl bg-red-700 border-2 border-red-800 rounded-lg shadow-lg">
                        <p className='text-white italic'>Wrong Public Key or Block Nonce, try again...</p>
                    </div>
                )}

                {minedSuccesfully === "Successfull" && (
                    <div className="p-8 text-center w-full max-w-2xl bg-green-700 border-2 border-green-800 rounded-lg shadow-lg">
                        <h3 className='text-white italic text-3xl font-bold mb-2'>Details Correct...</h3>
                        <p className='text-white italic text-xl mb-4'>Waiting for confirmation</p>
                        <p className='text-white text-4xl font-bold'>{percentage.toFixed(2)}%</p>
                    </div>
                )}
            </div>
            <HelpBot level={'blockmine'} />
        </AnimatedPage>
    )
}

export default BlockMine;
