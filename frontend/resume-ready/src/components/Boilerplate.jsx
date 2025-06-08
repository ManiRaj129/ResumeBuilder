import { useNavigate } from "react-router-dom";
import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import RRLogo from "../assets/images/logo/ResumeReadyLogo.png";
import CrossSVG from "../assets/images/icons/cross-svgrepo-com.svg";
import shop from "../assets/images/icons/shop.svg";
import back from "../assets/images/icons/arrow-left-from-line-svgrepo-com.svg";
import GmailSVG from "../assets/images/icons/gmail-svgrepo-com.svg";
import InstagramSVG from "../assets/images/icons/instagram-svgrepo-com.svg";
import LinkedInSVG from "../assets/images/icons/linkedin-svgrepo-com.svg";
import MetaFBSVG from "../assets/images/icons/meta-logo-facebook-svgrepo-com.svg";

export function LandingHeader() {
  let navigation = useNavigate();

  return (
    <div
      className="landing-header-container p-4 bg-[#189ab4] mt-0 flex flex-row w-full shadow-md items-center fixed
						top-0 left-0 right-0 z-50"
    >
      <div className="image-logo-container hover:scale-110 duration-200 transition ease-in-out cursor-pointer">
        <img
          className="w-[40px] h-[60px]"
          src={RRLogo}
          alt="RRLogo"
          onClick={() => navigation("/")}
        ></img>
      </div>
      <div className="navigation-button-container flex flex-row justify-end gap-5 text-xl text-white p-4 flex-1">
        <button
          className="signup-btn cursor-pointer hover:text-[#189ab4] transition duration-300
									ease-in-out hover:bg-white p-2 rounded hover:scale-110 shadow-md border-gray-100 
									border-1"
          onClick={() => navigation("/signup")}
        >
          Sign up
        </button>
        <button
          className="login-btn cursor-pointer hover:text-[#189ab4] transition duration-300
									ease-in-out hover:bg-white p-2 rounded hover:scale-110 shadow-md border-gray-100 
									border-1"
          onClick={() => navigation("/login")}
        >
          Login
        </button>
      </div>
    </div>
  );
}

export function GeneralHeader({ setIsPaneOpen }) {
  let navigation = useNavigate();

  return (
    <div
      className="landing-header-container p-4 bg-[#189ab4] mt-0 flex w-full shadow-md items-center
						  top-0 left-0 right-0 z-50 flex-col lg:flex-row"
    >
      <div className="image-logo-container hover:scale-110 duration-200 transition ease-in-out cursor-pointer">
        <img
          className="w-[40px] h-[60px]"
          src={RRLogo}
          alt="RRLogo"
          onClick={() => navigation("/dashboard")}
        ></img>
      </div>
      <div
        className="navigation-button-container flex flex-col lg:flex-row flex-wrap justify-end gap-5 text-xl text-white 
							  p-4 flex-1 items-center"
      >
        <img
          src={shop}
          className="logout-btn h-11 transition duration-300 ease-in-out hover:scale-110 cursor-pointer
					  hover:bg-[#f54254] rounded p-1"
          onClick={() => navigation("/templates")}
        />

        <button
          onClick={() => setIsPaneOpen(true)}
          className="h-11 transition duration-300 ease-in-out hover:scale-110 cursor-pointer
								   hover:bg-green-500 rounded p-1"
        >
          <FaUserCircle className="w-10 h-10" />
        </button>
      </div>
    </div>
  );
}

export function EmptyHeader() {
  
  let navigation = useNavigate();

  return (
    <div
      className="landing-header-container p-4 bg-[#189ab4] mt-0 flex w-full shadow-md items-center
						  top-0 left-0 right-0 z-50 flex-col lg:flex-row"
    >
      <div className="image-logo-container hover:scale-110 duration-200 transition ease-in-out cursor-pointer">
        <img
          className="w-[40px] h-[60px]"
          src={RRLogo}
          alt="RRLogo"
          onClick={() => navigation("/dashboard")}
        ></img>
      </div>
      <div
        className="navigation-button-container flex flex-col lg:flex-row flex-wrap justify-end gap-5 text-xl text-white 
							  p-4 flex-1 items-center"
      >
      </div>
    </div>
  );
}

export function ShopHeader() {
  let navigation = useNavigate();

  return (
    <div
      className="landing-header-container p-4 bg-[#189ab4] mt-0 flex w-full shadow-md items-center
						top-0 left-0 right-0 z-50 flex-col lg:flex-row"
    >
      <div className="image-logo-container hover:scale-110 duration-200 transition ease-in-out cursor-pointer">
        <img
          className="w-[40px] h-[60px]"
          src={back}
          alt="Back"
          onClick={() => navigation("/dashboard")}
        ></img>
      </div>
      <div
        className="navigation-button-container flex flex-col lg:flex-row flex-wrap justify-end gap-5 text-xl text-white 
							p-4 flex-1 items-center"
      >
        <button
          className="templates-btn cursor-pointer hover:text-[#189ab4] transition duration-300
									ease-in-out hover:bg-white p-2 rounded hover:scale-110 shadow-md border-gray-100 
									"
          onClick={() => navigation("/templates")}
        >
          Templates
        </button>
        <button
          className="assets-btn cursor-pointer hover:text-[#189ab4] transition duration-300
									ease-in-out hover:bg-white p-2 rounded hover:scale-110 shadow-md border-gray-100 
									"
          onClick={() => navigation("/assets")}
        >
          Assets
        </button>
        <button
          className="templates-btn cursor-pointer hover:text-[#189ab4] transition duration-300
									ease-in-out hover:bg-white p-2 rounded hover:scale-110 shadow-md border-gray-100 
									"
          onClick={() => navigation("/services")}
        >
          Services
        </button>
        <button
          className="assets-btn cursor-pointer hover:text-[#189ab4] transition duration-300
									ease-in-out hover:bg-white p-2 rounded hover:scale-110 shadow-md border-gray-100 
									"
          onClick={() => navigation("/subscriptions")}
        >
          Subscriptions
        </button>
      </div>
    </div>
  );
}

export function PageNotFound() {
  let navigation = useNavigate();

  return (
    <div className="not-found-container bg-[#189ab4] w-full h-screen">
      <div className="text-button-container flex flex-col justify-center items-center gap-10 h-full">
        <p className="text-white text-7xl text-center">
          Opps! <br />
          Page Not Found
        </p>
        <button
          className="signup-btn cursor-pointer hover:text-[#189ab4] transition duration-300
									ease-in-out hover:bg-white p-2 rounded hover:scale-110 shadow-md border-gray-100 
									border-1 w-fit text-white text-3xl"
          onClick={() => navigation("/")}
        >
          Back To Home
        </button>
      </div>
    </div>
  );
}

export function GeneralFooter() {

  const navigate = useNavigate();

  return (
    <div className="footer-container bg-[#189ab4] p-10">
      <div className="footer-hyperlink-container flex flex-col flex-wrap md:flex-row gap-12 w-full mx-5">
        <div className="socials-container flex flex-col flex-1 gap-4">
          <p className="text-3xl text-white font-bold">
            Socials
          </p>
          <img src={GmailSVG} alt="gmail svg" 
               className="w-[30px] cursor-pointer"/>
          <img src={InstagramSVG} alt="instagram svg" 
               className="w-[30px] cursor-pointer"/>
          <img src={LinkedInSVG} alt="linkedin svg" 
               className="w-[30px] cursor-pointer"/>
          <img src={MetaFBSVG} alt="facebook svg" 
               className="w-[30px] cursor-pointer"/>
        </div>
        <div className="about-us-container flex flex-col flex-1 gap-3 text-white items-left justify-left">
          <p className="text-3xl font-bold">
            About Us
          </p>
          <p className="underline cursor-pointer hover:text-[#005177] transition duration-200 ease-in-out w-fit"
                  onClick={() => navigate('/aboutus')}>
            Meet the authors
          </p>
        </div>
        <div className="community-container flex flex-col flex-1 gap-3 text-white items-left justify-left">
          <p className="text-3xl font-bold">
            Community
          </p>
          <p className="underline cursor-pointer hover:text-[#005177] transition duration-200 ease-in-out w-fit">
            Creators
          </p>
          <p className="underline cursor-pointer hover:text-[#005177] transition duration-200 ease-in-out w-fit">
            Partnerships
          </p>
          <p className="underline cursor-pointer hover:text-[#005177] transition duration-200 ease-in-out w-fit">
            Affiliates program
          </p>
        </div>
        <div className="download-container flex flex-col flex-1 gap-3 text-white items-left justify-left">
          <p className="text-3xl font-bold">
            Download
          </p>
          <p className="underline cursor-pointer hover:text-[#005177] transition duration-200 ease-in-out w-fit">
            iOS
          </p>
          <p className="underline cursor-pointer hover:text-[#005177] transition duration-200 ease-in-out w-fit">
            Android
          </p>
          <p className="underline cursor-pointer hover:text-[#005177] transition duration-200 ease-in-out w-fit">
            Windows
          </p>
          <p className="underline cursor-pointer hover:text-[#005177] transition duration-200 ease-in-out w-fit">
            Mac
          </p>
          <p className="underline cursor-pointer hover:text-[#005177] transition duration-200 ease-in-out w-fit">
            Linux
          </p>
        </div>
        <div className="company-container flex flex-col flex-1 gap-3 text-white items-left justify-left">
          <p className="text-3xl font-bold">
            Company
          </p>
          <p className="underline cursor-pointer hover:text-[#005177] transition duration-200 ease-in-out w-fit">
            Newsroom
          </p>
          <p className="underline cursor-pointer hover:text-[#005177] transition duration-200 ease-in-out w-fit">
            Careers
          </p>
          <p className="underline cursor-pointer hover:text-[#005177] transition duration-200 ease-in-out w-fit">
            Terms and Privacy
          </p>
          <p className="underline cursor-pointer hover:text-[#005177] transition duration-200 ease-in-out w-fit">
            Security
          </p>
          <p className="underline cursor-pointer hover:text-[#005177] transition duration-200 ease-in-out w-fit">
            Contact Sales
          </p>
        </div>
      </div>
      <div className="p-0.5 bg-white rounded-3xl my-6"/>
      <div className="logo-copyright-container flex flex-col items-center gap-4">
        <img src={RRLogo} alt="resume ready logo"
             className="w-[50px]">
             </img>
        <p className="text-center text-white">&copy; 2025–2025 ResumeReady</p>
      </div>
    </div>
  );
}

export function DisplayProducts({ rowCount, products, hasLong }) {
  const [showDescPopup, setShowDescPopup] = useState(false);
  const [productIndex, setProductIndex] = useState(0);
  const popUpRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (popUpRef.current && !popUpRef.current.contains(event.target)) {
        setShowDescPopup(false);
      }
    }

    if (showDescPopup) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDescPopup]);

  const productRowContainers = [];

  for (let i = 0; i < products.length; i += rowCount) {
    let row = (
      <div
        key={`p${i}`}
        className="products-row-container flex flex-col flex-wrap gap-5 bg-[#005177] p-5 rounded-xl
				 			lg:flex-row"
      >
        {products.slice(i, i + rowCount).map((product, index) => (
          <div
            key={product.id}
            className="products-container p-5 text-white flex flex-1 flex-col 
									bg-[#0082be] rounded-xl gap-5"
          >
            <p
              className="product-title border-2 border-white p-2 px-9 bg-[#005177]
									rounded-2xl text-center text-xl"
            >
              {product.name}
            </p>
            <img src={product.imageSrc} className="product-image rounded"></img>
            <p className="product-description text-lg px-1">
              {product.shortDescription}
            </p>
            <div
              className="button-container flex flex-row align-bottom items-bottom justify-bottom
										mt-auto"
            >
              <button
                className="more-details-btn cursor-pointer transition duration-300 ease-in-out 
												p-2 shadow-md bg-white text-black rounded-tl-2xl rounded-bl-2xl 
												border-[#005177] border-l-2 border-y-2 hover:bg-[#0082be] 
												hover:text-white"
                /**
                 * TOCHANGE
                 */
                onClick={() => {
                  setShowDescPopup(true);
                  setProductIndex(i + index);
                }}
              >
                More Details
              </button>
              <div className="border-1 border-[#005177]" />
              <button
                className="more-details-btn cursor-pointer transition duration-300 ease-in-out 
												p-2 shadow-md bg-white text-black rounded-tr-2xl rounded-br-2xl 
												border-[#005177] border-r-2 border-y-2 hover:bg-[#2fc04e] 
												hover:text-white"
              >
                {product.pricing}
              </button>
            </div>
          </div>
        ))}
        {/**
         * Show description popup
         */}
        {showDescPopup && (
          <div
            className="more-details-popup-bg fixed inset-0 flex items-center justify-center 
									z-50 bg-black/50"
          >
            <div
              ref={popUpRef}
              className="more-details-popup-container bg-[#005177]
									shadow-lg z-50 rounded-md flex flex-col flex-wrap gap-3 p-4 w-[90%]
									2xl:w-[70%] md:w-[75%] lg:flex-row flex-col-reverse"
            >
              <div className="popup-image-container flex flex-1 hidden lg:block">
                <img
                  src={products[productIndex].imageSrc}
                  alt={products[productIndex].name}
                  className="shadow-md rounded-md hover:scale-110 transition duration-300
												ease-in-out hover:rounded-none hover:shadow-xl"
                ></img>
              </div>
              <div
                className="popup-description-container flex flex-1 p-5 flex-col bg-[#006c9e]
											rounded-md shadow-md"
              >
                <p
                  className="product-title p-2 bg-white rounded-md text-center text-lg
											text-[#005177] shadow-md 2xl:text-xl 2xl:p-3 md:text-xl"
                >
                  {products[productIndex].name}
                </p>
                <div className="p-1" />
                <p className="product-desc-container text-white text-md p-1 xl:text-lg">
                  {hasLong
                    ? products[productIndex].longDescription
                    : products[productIndex].shortDescription}
                </p>
                <div className="lg:p-0 p-6"></div>
                <button
                  className="flex mx-auto lg:mx-0 ml-auto mt-auto p-2 bg-white w-[50%] justify-center 
													rounded-2xl hover:bg-[#2fc04e] hover:text-white transition cursor-pointer
													ease-in-out duration-300 border-2 border-[#005177] hover:scale-110"
                >
                  {products[productIndex].pricing}
                </button>
              </div>
              <img
                src={CrossSVG}
                className="w-6 bg-[#006c9e] h-fit rounded-md cursor-pointer hover:bg-white
											transition duration-300 ease-in-out hover:scale-110 ml-auto hover:rotate-90"
                onClick={() => {
                  setShowDescPopup(false);
                }}
              ></img>
            </div>
          </div>
        )}
      </div>
    );
    productRowContainers.push(row);
  }

  return (
    <div
      className="products-main-container flex flex-col gap-5 p-3 shadow-md border-gray-200
					border-1 2xl:mx-85 xl:mx-50 lg:mx-40 md:mx-30 sm:mx-10 mx-5 rounded-xl"
    >
      {productRowContainers}
    </div>
  );
}

export function DisplayProductsURL({ rowCount, products, hasLong }) {
  const [showDescPopup, setShowDescPopup] = useState(false);
  const [productIndex, setProductIndex] = useState(0);
  const popUpRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (popUpRef.current && !popUpRef.current.contains(event.target)) {
        setShowDescPopup(false);
      }
    }

    if (showDescPopup) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDescPopup]);

  const productRowContainers = [];

  for (let i = 0; i < products.length; i += rowCount) {
    let row = (
      <div
        key={`p${i}`}
        className="products-row-container flex flex-col flex-wrap gap-5 bg-[#005177] p-5 rounded-xl
				 			lg:flex-row"
      >
        {products.slice(i, i + rowCount).map((product, index) => (
          <div
            key={product.id}
            className="products-container p-5 text-white flex flex-1 flex-col 
									bg-[#0082be] rounded-xl gap-5"
          >
            <p
              className="product-title border-2 border-white p-2 px-9 bg-[#005177]
									rounded-2xl text-center text-xl"
            >
              {product.name}
            </p>
            <img src={product.img64} className="product-image rounded"></img>
            <p className="product-description text-lg px-1">
              {product.shortDescription}
            </p>
            <div
              className="button-container flex flex-row align-bottom items-bottom justify-bottom
										mt-auto"
            >
              <button
                className="more-details-btn cursor-pointer transition duration-300 ease-in-out 
												p-2 shadow-md bg-white text-black rounded-tl-2xl rounded-bl-2xl 
												border-[#005177] border-l-2 border-y-2 hover:bg-[#0082be] 
												hover:text-white"
                /**
                 * TOCHANGE
                 */
                onClick={() => {
                  setShowDescPopup(true);
                  setProductIndex(i + index);
                }}
              >
                More Details
              </button>
              <div className="border-1 border-[#005177]" />
              <button
                className="more-details-btn cursor-pointer transition duration-300 ease-in-out 
												p-2 shadow-md bg-white text-black rounded-tr-2xl rounded-br-2xl 
												border-[#005177] border-r-2 border-y-2 hover:bg-[#2fc04e] 
												hover:text-white"
              >
                {product.pricing}
              </button>
            </div>
          </div>
        ))}
        {/**
         * Show description popup
         */}
        {showDescPopup && (
          <div
            className="more-details-popup-bg fixed inset-0 flex items-center justify-center 
									z-50 bg-black/50"
          >
            <div
              ref={popUpRef}
              className="more-details-popup-container bg-[#005177]
									shadow-lg z-50 rounded-md flex flex-col flex-wrap gap-3 p-4 w-[90%]
									2xl:w-[70%] md:w-[75%] lg:flex-row flex-col-reverse"
            >
              <div className="popup-image-container flex flex-1 hidden lg:block">
                <img
                  src={products[productIndex].img64}
                  alt={products[productIndex].name}
                  className="shadow-md rounded-md hover:scale-110 transition duration-300
												ease-in-out hover:rounded-none hover:shadow-xl"
                ></img>
              </div>
              <div
                className="popup-description-container flex flex-1 p-5 flex-col bg-[#006c9e]
											rounded-md shadow-md"
              >
                <p
                  className="product-title p-2 bg-white rounded-md text-center text-lg
											text-[#005177] shadow-md 2xl:text-xl 2xl:p-3 md:text-xl"
                >
                  {products[productIndex].name}
                </p>
                <div className="p-1" />
                <p className="product-desc-container text-white text-md p-1 xl:text-lg">
                  {hasLong
                    ? products[productIndex].longDescription
                    : products[productIndex].shortDescription}
                </p>
                <div className="lg:p-0 p-6"></div>
                <button
                  className="flex mx-auto lg:mx-0 ml-auto mt-auto p-2 bg-white w-[50%] justify-center 
													rounded-2xl hover:bg-[#2fc04e] hover:text-white transition cursor-pointer
													ease-in-out duration-300 border-2 border-[#005177] hover:scale-110"
                >
                  {products[productIndex].pricing}
                </button>
              </div>
              <img
                src={CrossSVG}
                className="w-6 bg-[#006c9e] h-fit rounded-md cursor-pointer hover:bg-white
											transition duration-300 ease-in-out hover:scale-110 ml-auto hover:rotate-90"
                onClick={() => {
                  setShowDescPopup(false);
                }}
              ></img>
            </div>
          </div>
        )}
      </div>
    );
    productRowContainers.push(row);
  }

  if (products.length == 0){
    productRowContainers.push(
      <div className="no-products-filler-container font-bold p-20 text-center text-xl">
        No products were found... :(
      </div>
    )
  }

  return (
    <div
      className="products-main-container flex flex-col gap-5 p-3 shadow-md border-gray-200
					border-1 2xl:mx-85 xl:mx-50 lg:mx-40 md:mx-30 sm:mx-10 mx-5 rounded-xl"
    >
      {productRowContainers}
    </div>
  );
}
