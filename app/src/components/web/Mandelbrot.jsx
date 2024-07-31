import React, { useState, useEffect, useContext } from 'react';

import png1 from '../../assets/1.png';
import png2 from '../../assets/2.png';
import png3 from '../../assets/3.png';
import png4 from '../../assets/4.png';
import png5 from '../../assets/5.png';
import png6 from '../../assets/6.png';
import png7 from '../../assets/7.png';
import png8 from '../../assets/8.png';
import png9 from '../../assets/9.png';
import AnimatedPage from '../AnimatedPage';
import { useNavigate, useLocation } from 'react-router-dom';
import { SampleContext } from '../../contexts/URLContext';

const Mandelbrot = () => {
    document.body.style.overflow = 'auto';

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const entryNumber = searchParams.get('entryNumber');

    const { URL } = useContext(SampleContext)

    const navigate = useNavigate();

    const [grid1, setGrid1] = useState([
        [png4, png2, png8],
        [png5, png6, png3],
        [png7, png9, png1]
    ]);

    const [grid2, setGrid2] = useState([
        [null, null, null],
        [null, null, null],
        [null, null, null]
    ]);

    const [turns, setTurns] = useState(0);
    const [input, setInput] = useState('');
    const [previousMoves, setPreviousMoves] = useState([]);
    
    const [gameCompleted, setGameCompleted] = useState(false);

    const exampleCommand = 'move grid1[0,0] grid2[1,0]';

    const [timer, setTimer] = useState(600);


    

    useEffect(() => {
        if (timer > 0) {
            const timerInterval = setInterval(() => {
                setTimer(prevTimer => prevTimer - 1);
            }, 1000);

            // Cleanup function to clear the interval when the component unmounts or when `timer` changes
            return () => clearInterval(timerInterval);
        }
    }, [timer]);

    // Format timer for display
    const formatTimer = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    // Function to handle game end
    useEffect(() => {
        const handleGameEnd = async () => {
            const correctOrder = [png1, png2, png3, png4, png5, png6, png7, png8, png9];
            const flatGrid2 = grid2.flat();
            const isCorrect = flatGrid2.every((piece, index) => piece === correctOrder[index]);

            if (isCorrect || timer <= 0) {
                setGameCompleted(true);
                console.log(isCorrect ? 'Game completed successfully!' : 'Game over. Time ran out!');
                const timeTaken = 600 - parseInt(timer); // Calculate time taken to complete the level
                const formData = {
                    entryNumber: entryNumber,
                    timeTaken: timeTaken
                };
                fetch(`${URL}/updateTime`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                })

                navigate(`/Level-1(2)?entryNumber=${entryNumber}`);
            }
        };

        handleGameEnd();
    }, [grid2, gameCompleted, timer, entryNumber, navigate]);

    const handleDragStart = (e, piece, gridName, row, col) => {
        e.dataTransfer.setData('piece', piece);
        e.dataTransfer.setData('gridName', gridName);
        e.dataTransfer.setData('row', row.toString());
        e.dataTransfer.setData('col', col.toString());
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e, targetGrid, targetRow, targetCol) => {
        e.preventDefault();
        const piece = e.dataTransfer.getData('piece');
        const sourceGrid = e.dataTransfer.getData('gridName');
        const sourceRow = parseInt(e.dataTransfer.getData('row'));
        const sourceCol = parseInt(e.dataTransfer.getData('col'));

        if (sourceGrid === 'grid1') {
            if (grid2[targetRow][targetCol] === null) {
                const newGrid2 = grid2.map(row => [...row]);
                newGrid2[targetRow][targetCol] = piece;
                setGrid2(newGrid2);

                const newGrid1 = grid1.map(row => [...row]);
                newGrid1[sourceRow][sourceCol] = null;
                setGrid1(newGrid1);

                setPreviousMoves([...previousMoves, { sourceGrid, targetGrid, sourceRow, sourceCol, targetRow, targetCol }]);
                setTurns(turns + 1);
            }
        } else if (sourceGrid === 'grid2') {
            if (grid1[targetRow][targetCol] === null) {
                const newGrid1 = grid1.map(row => [...row]);
                newGrid1[targetRow][targetCol] = piece;
                setGrid1(newGrid1);

                const newGrid2 = grid2.map(row => [...row]);
                newGrid2[sourceRow][sourceCol] = null;
                setGrid2(newGrid2);

                setPreviousMoves([...previousMoves, { sourceGrid, targetGrid, sourceRow, sourceCol, targetRow, targetCol }]);
                setTurns(turns + 1);
            }
        }
    };

    const executeMove = () => {
        try {
            const [command, source, target] = input.split(' ');

            if (command !== 'move') {
                throw new Error('Invalid command. Use "move" to move pieces.');
            }

            const [sourceGrid, sourceRow, sourceCol] = parseGridReference(source);
            const [targetGrid, targetRow, targetCol] = parseGridReference(target);

            if (sourceGrid !== 'grid1' && sourceGrid !== 'grid2') {
                throw new Error('Invalid source grid. Use "grid1" or "grid2".');
            }

            if (targetGrid !== 'grid1' && targetGrid !== 'grid2') {
                throw new Error('Invalid target grid. Use "grid1" or "grid2".');
            }

            if ((sourceGrid === 'grid1' && !grid1[sourceRow][sourceCol]) ||
                (sourceGrid === 'grid2' && !grid2[sourceRow][sourceCol]) ||
                (targetGrid === 'grid1' && grid1[targetRow][targetCol]) ||
                (targetGrid === 'grid2' && grid2[targetRow][targetCol])) {
                throw new Error('Invalid move. Ensure the source cell has a piece and the target cell is empty.');
            }

            handleDropFromInput(sourceGrid, targetGrid, sourceRow, sourceCol, targetRow, targetCol);

            setPreviousMoves([...previousMoves, { sourceGrid, targetGrid, sourceRow, sourceCol, targetRow, targetCol }]);

            setTurns(turns + 1);
        } catch (error) {
            alert(error.message);
        }
    };

    const handleDropFromInput = (sourceGrid, targetGrid, sourceRow, sourceCol, targetRow, targetCol) => {
        if (sourceGrid === 'grid1') {
            const piece = grid1[sourceRow][sourceCol];
            if (grid2[targetRow][targetCol] === null) {
                const newGrid2 = grid2.map(row => [...row]);
                newGrid2[targetRow][targetCol] = piece;
                setGrid2(newGrid2);

                const newGrid1 = grid1.map(row => [...row]);
                newGrid1[sourceRow][sourceCol] = null;
                setGrid1(newGrid1);
            }
        } else if (sourceGrid === 'grid2') {
            const piece = grid2[sourceRow][sourceCol];
            if (grid1[targetRow][targetCol] === null) {
                const newGrid1 = grid1.map(row => [...row]);
                newGrid1[targetRow][targetCol] = piece;
                setGrid1(newGrid1);

                const newGrid2 = grid2.map(row => [...row]);
                newGrid2[sourceRow][sourceCol] = null;
                setGrid2(newGrid2);
            }
        }
    };

    const redoMove = () => {
        if (previousMoves.length > 0) {
            const lastMove = previousMoves[previousMoves.length - 1];
            handleDropFromInput(lastMove.targetGrid, lastMove.sourceGrid, lastMove.targetRow, lastMove.targetCol, lastMove.sourceRow, lastMove.sourceCol);
            setPreviousMoves(previousMoves.slice(0, -1));
            setTurns(turns + 1);
        }
    };

    const parseGridReference = (ref) => {
        const match = ref.match(/(grid[12])\[(\d),(\d)\]/);
        if (!match) throw new Error('Invalid grid reference format. Use "grid1[row,col]" or "grid2[row,col]".');
        const gridName = match[1];
        const row = parseInt(match[2]);
        const col = parseInt(match[3]);
        return [gridName, row, col];
    };

    const copyExampleCommand = () => {
        setInput(exampleCommand);
    };

    const renderGrid = (grid, gridName) => (
        <div className="grid grid-cols-3 border-2 border-gray-700 w-full aspect-square">
            {grid.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                    <div
                        key={`${gridName}-${rowIndex}-${colIndex}`}
                        className={`${cell ? 'bg-transparent' : 'bg-gray-600'
                            } border-2 border-gray-700 aspect-square relative`}
                        draggable={!!cell}
                        onDragStart={(e) => handleDragStart(e, cell, gridName, rowIndex, colIndex)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, gridName, rowIndex, colIndex)}
                    >
                        {cell && <img src={cell} alt="" className="w-full h-full object-cover" />}
                    </div>
                ))
            )}
        </div>
    );




    return (<AnimatedPage>
        <div className="flex flex-col items-center justify-center min-h-screen gap-5 p-5 bg-gray-900 text-white">
            <div className="w-full max-w-xs text-center">
                <div className="text-lg font-bold mb-2">DevDash - CodeCrafters</div>
                <div className="text-2xl">Timer: {formatTimer(timer)}</div>
            </div>
            <div className="w-full max-w-xs">
                {renderGrid(grid1, 'grid1')}
            </div>
            <div className="flex items-center w-full max-w-xs">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder='move grid1[0,0] grid2[1,0]'
                    className="p-2 w-full mt-2 border bg-gray-600 border-gray-600 rounded-lg placeholder-gray-400"
                />
                <button
                    onClick={copyExampleCommand}
                    className="ml-2 mt-2 p-2 cursor-pointer bg-gray-800 hover:bg-gray-700 text-white rounded-lg"
                >
                    Autofill
                </button>
            </div>
            <div className="flex gap-2">
                <button
                    onClick={executeMove}
                    className="p-2 cursor-pointer bg-gray-800 hover:bg-gray-700 text-white rounded-lg"
                >
                    Execute Command
                </button>
                <button
                    onClick={redoMove}
                    className="p-2 cursor-pointer bg-gray-800 hover:bg-gray-700 text-white rounded-lg"
                >
                    Undo
                </button>
            </div>
            <div className="w-full max-w-xs">
                {renderGrid(grid2, 'grid2')}
            </div>
            <div className="mt-2">Turns: {turns}</div>
        </div>
    </AnimatedPage>
    );
};

export default Mandelbrot;










