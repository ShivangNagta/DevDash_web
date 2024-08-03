import React from "react";
import ohMyGoddo from "../assets/ohMyGoddo.png"; // adjust the path as needed

const LandscapeWarning = () => {
  return (
    
    <div className="landscape-warning flex-col text-center">
      <img src={ohMyGoddo} alt="Landscape Warning" /> <br/>
      Oh my goddo itz landscape kun <br/><br/>
      Please rotate your device to portrait mode or reduce the screen width if on desktop devices. <br/>
      
    </div>
  );
};

export default LandscapeWarning;
