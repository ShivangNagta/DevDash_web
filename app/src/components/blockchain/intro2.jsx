import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { motion } from "framer-motion";

const Intro2 = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const entryNumber = searchParams.get('entryNumber');

  const animations = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const AnimatedPage = ({ children }) => {
    return (
      <motion.div
        variants={animations}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 2.5 }}
      >
        {children}
      </motion.div>
    );
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    let cw = window.innerWidth;
    let ch = window.innerHeight;

    canvas.width = cw;
    canvas.height = ch;

    let charArr = [
      "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
      "1", "2", "3", "4", "5", "6", "7", "8",
      "А", "В", "Г", "Д", "Є", "Ѕ", "З", "И", "Ѳ", "І", "К", "Л", "М", "Н", "Ѯ", "Ѻ", "П", "Ч", "Р", "С", "Т", "Ѵ", "Ф", "Х", "Ѱ", "Ѿ", "Ц"
    ];

    let maxCharCount = 100;
    let fallingCharArr = [];
    let fontSize = 13;
    let maxColumns = cw / fontSize;

    let frames = 0;

    class FallingChar {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.value = '';
        this.speed = 0;
      }

      draw(ctx) {
        this.value = charArr[Math.floor(Math.random() * charArr.length)].toUpperCase();
        this.speed = (Math.random() * fontSize * 3) / 4 + (fontSize * 3) / 4;

        ctx.fillStyle = "rgba(0, 255, 0)";
        ctx.font = fontSize + "px VT323, monospace";
        ctx.fillText(this.value, this.x, this.y);
        this.y += this.speed;

        if (this.y > ch) {
          this.y = (Math.random() * ch) / 2 - 50;
          this.x = Math.floor(Math.random() * maxColumns) * fontSize;
          this.speed = (-Math.random() * fontSize * 3) / 4 + (fontSize * 3) / 4;
        }
      }
    }

    let update = () => {
      if (fallingCharArr.length < maxCharCount) {
        let fallingChar = new FallingChar(
          Math.floor(Math.random() * maxColumns) * fontSize,
          (Math.random() * ch) / 2 - 50
        );
        fallingCharArr.push(fallingChar);
      }
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, cw, ch);
      for (let i = 0; i < fallingCharArr.length && frames % 2 === 0; i++) {
        fallingCharArr[i].draw(ctx);
      }

      requestAnimationFrame(update);
      frames++;
    };

    const handleResize = () => {
      cw = window.innerWidth;
      ch = window.innerHeight;
      canvas.width = cw;
      canvas.height = ch;
      maxColumns = cw / fontSize;
      ctx.fillStyle = "rgba(0, 0, 0, 1)";
      ctx.fillRect(0, 0, cw, ch);
    };

    window.addEventListener('resize', handleResize);
    update();

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const startNextLevel = () => {
    document.body.style.overflow = 'auto';
    navigate(`/LevelSabkeNiklenge?entryNumber=${entryNumber}`);
  };

  return (
    <AnimatedPage>
      <div className="fixed top-0 left-0 w-full h-full z-10">
        <canvas id="canvas" className="block"></canvas>
        <h1 className="w-full text-center items-center justify-center absolute top-1/2 -translate-y-1/2 text-3xl z-20 text-center p-4 text-green-400 custom-text-shadow font-vt323">
          Welcome to DevDash - Noncense
        </h1>
        <div className="absolute bottom-20 w-full flex justify-center">
          <button
            onClick={startNextLevel}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Start
          </button>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default Intro2;
