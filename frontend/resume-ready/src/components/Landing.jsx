import React, { useEffect, useRef, useState } from "react";
import { LandingHeader } from "./Boilerplate";
import LandingMainBG from "../assets/images/landing/landing_image.jpg";
import { LandingInfo } from "../data/LandingInfo";
import { GeneralFooter } from "./Boilerplate";
import { useNavigate } from "react-router-dom";
import { ScrollToTop } from "./Utils";

const welcomeText = "Are you ready to improve your resume?";

function Landing() {

  const [showCursor, setShowCursor] = useState(true);
  const [messageIndex, setMessageIndex] = useState(0);
  const indexIntervalRef = useRef(null);

  useEffect(() => {

    const blinkingInterval = setInterval(() => {
      setShowCursor((showCursor) => !showCursor);
    }, 500);

    return () => clearInterval(blinkingInterval);
  }, []);

  useEffect(() => {

    indexIntervalRef.current = setInterval(() => {

      setMessageIndex((prev) => {

        if (prev == welcomeText.length) {

          clearInterval(indexIntervalRef.current);
          return prev;
        }
        return prev + 1;
      });
    }, 40);
    
    return () => clearInterval(indexIntervalRef.current);
  }, [])

  return (
    <>
      <LandingHeader />
      <LandingBody showCursor={showCursor} messageIndex={messageIndex}/>
      <GeneralFooter />
    </>
  );
}
export default Landing;

function LandingBody({ showCursor, messageIndex }) {

	let navigation = useNavigate();

  return (
    <div className="body-container">
      <div
        className="welcome-enquiry-container w-full mt-24 h-screen bg-cover bg-center relative shadow-sm"
        style={{ backgroundImage: `url(${LandingMainBG})` }}
      >
        <div
          className="image-info-container absolute w-full flex flex-col items-center justify-center 
									h-full p-6 gap-5 text-4xl text-center"
        >
          <h1 className="bg-white p-5 rounded-3xl shadow-md border-2 border-[#189ab4]">
            {welcomeText.slice(0, messageIndex)}
            <span className="whitespace-pre font-mono text-[#189ab4]">
              {showCursor ? "|" : " "}
            </span>
          </h1>
          <button
            className="signup-btn cursor-pointer hover:text-[#189ab4] transition duration-300
										ease-in-out hover:bg-white p-3 rounded-xl hover:scale-110 shadow-md border-gray-100 
										border-1 bg-[#189ab4] text-white"
            onClick={() => navigation("/signup")}
          >
            Sign up Now
          </button>
        </div>
      </div>
      <div className="landing-info-container flex flex-col gap-5 p-10 my-5 px-10 sm:px-30 xl:px-40 2xl:px-80">
        {LandingInfo.map((info, index) => (
          <div
            key={info.ID}
            className={`landing-info-item flex flex-col gap-10 p-6 shadow-md border-1 border-[#189ab4] rounded
									lg:flex-row
									${index % 2 == 1 ? `lg:flex-row-reverse` : ``}`}
          >
            <div className="landing-info-item-image-container flex-1 p-6">
              <img
                src={info.source}
                alt={info.title}
                className="rounded-xl shadow-sm"
              ></img>
            </div>
            <div className="p-1 bg-[#189ab4] rounded-3xl" />
            <div
              className="landing-info-item-description-container flex-1 justify-center gap-3 flex flex-col
										p-6"
            >
              <p className="text-5xl bg-[#189ab4] text-white p-3 rounded text-center shadow-sm">
                {info.title}
              </p>
              <p className="text-2xl text-center">{info.caption}</p>
              <div className="p-2" />
              <p className="text-xl border-1 p-3 border-[#189ab4] rounded shadow-sm">
                {info.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
