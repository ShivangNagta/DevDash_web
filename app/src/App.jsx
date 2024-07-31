import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/login/Login.jsx';
import Mandelbrot from './components/web/Mandelbrot.jsx';
import MandelbrotFractal from './components/web/MandelbrotExplorer.jsx';
import Rain from './components/web/Rain.jsx';
import Noncense from './components/blockchain/Noncense.jsx';
import Intro2 from './components/blockchain/intro2.jsx';
import Window from './components/Window.jsx';
import Result from './components/Result.jsx';
import LandscapeWarning from './components/LandscapeWarning.jsx';
import { WindowProvider } from './contexts/TerminalContext.jsx';
import './index.css'; // Import the CSS file

function App() {
    useEffect(() => {
        const checkOrientation = () => {
            if (window.innerHeight < window.innerWidth) {
                // Landscape mode
                document.querySelector(".landscape-warning").style.display = "flex";
                document.querySelector(".app-content").style.display = "none";
            } else {
                // Portrait mode
                document.querySelector(".landscape-warning").style.display = "none";
                document.querySelector(".app-content").style.display = "block";
            }
        };

        // Initial check
        checkOrientation();

        // Listen for orientation changes
        window.addEventListener("resize", checkOrientation);

        // Cleanup the event listener on unmount
        return () => window.removeEventListener("resize", checkOrientation);
    }, []);

    return (
    <WindowProvider>
        <BrowserRouter>
            <LandscapeWarning />
            <div className="app-content">
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/Level-1(1)" element={<Mandelbrot />} />
                    <Route path="/Level-1(2)" element={<MandelbrotFractal />} />
                    <Route path="/intro1" element={<Rain />} />
                    <Route path="/LevelKuchLogoKeNiklenge" element={<Window />} />
                    <Route path="/intro2" element={<Intro2 />} />
                    <Route path="/LevelSabkeNiklenge" element={<Noncense />} />
                    <Route path="/resultPage" element={<Result />} />
                </Routes>
            </div>
        </BrowserRouter>
    </WindowProvider>
    );
}

export default App;
