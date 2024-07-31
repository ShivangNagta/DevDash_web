import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Rain = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const entryNumber = searchParams.get("entryNumber");

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

  const [showH2, setShowH2] = useState(false);
  const [moveH1ToTop, setMoveH1ToTop] = useState(false);
  const [showNextButton, setShowNextButton] = useState(true);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    let cw = window.innerWidth;
    let ch = window.innerHeight;

    canvas.width = cw;
    canvas.height = ch;

    let charArr = [
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "x",
      "y",
      "z",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "А",
      "В",
      "Г",
      "Д",
      "Є",
      "Ѕ",
      "З",
      "И",
      "Ѳ",
      "І",
      "К",
      "Л",
      "М",
      "Н",
      "Ѯ",
      "Ѻ",
      "П",
      "Ч",
      "Р",
      "С",
      "Т",
      "Ѵ",
      "Ф",
      "Х",
      "Ѱ",
      "Ѿ",
      "Ц",
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
        this.value = "";
        this.speed = 0;
      }

      draw(ctx) {
        this.value = charArr[
          Math.floor(Math.random() * charArr.length)
        ].toUpperCase();
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

    window.addEventListener("resize", handleResize);
    update();

    // Cleanup function
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleNext = () => {
    setMoveH1ToTop(true);
    setShowH2(true);
    setShowNextButton(false);
  };

  const startNextLevel = () => {
    document.body.style.overflow = "auto";
    navigate(`/LevelKuchLogoKeNiklenge?entryNumber=${entryNumber}`);
  };

  return (
    <AnimatedPage>
      <div className="fixed top-0 left-0 w-full h-full z-10 overflow-y-auto">
       {!showH2 && <canvas id="canvas" className="block"></canvas>}
        <h1
          className={`w-full text-center items-center justify-center absolute ${moveH1ToTop ? 'relative top-0 mt-4' : 'top-1/2 -translate-y-1/2'} text-3xl z-20 p-4 text-green-400 custom-text-shadow font-vt323 transition-all duration-1000`}
        >
          Welcome to DevDash - CyberTrace
        </h1>
          {showH2 && (
          <div className="w-11/12 mx-auto mt-5 text-center items-center justify-center text-xl z-20 p-1 text-green-400 custom-text-shadow font-vt323 overflow-y-auto">
            In the heart of New York City's financial network, JP Morgan's servers
            have been compromised by a massive data breach via a Cross-Site
            Scripting (XSS) attack. Date of Attack - 15/07/24 Time of Attack - 2200
            to 2300hrs (GMT) Initial investigations point to a troubling origin: a
            small group of hackers masquerading as employees in EuroBank, a respected
            European banking institution, are misusing the company's network.
            EuroBank has refused to participate in the investigation with British
            agencies and is using its financial power to halt the investigation. It
            claims that all of this is just a ploy to tarnish its reputation by its
            American competitor. You, as an ethical hacker of MI6, the intelligence
            service of the United Kingdom, are tasked with hacking into EuroBank's
            system and figuring out the necessary details to trace the involved
            so-called employees and hand them over to the CIA.
            The responsibility to not only safeguard JP Morgan's data but also
            preserve the integrity of the global financial infrastructure lies in
            your hands. It's your mission, should you choose to accept it?
          </div>
        )}
        <div className="bottom-20 w-full flex justify-center">
          {showNextButton && (
            <button
              onClick={handleNext}
              className="absolute bottom-20 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Next
            </button>
          )}
          {showH2 && (
            <button
              onClick={startNextLevel}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 mt-6 rounded"
            >
              Start
            </button>
          )}
        </div>
        
      </div>
    </AnimatedPage>
  );
};

export default Rain;
