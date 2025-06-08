import React, { useState, useRef, useEffect } from "react";
import CrossSVG from "../assets/images/icons/cross-svgrepo-com.svg";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const steps = [
  { number: 1, label: "Select Template", path: "/tempselect" },
  { number: 2, label: "Select Assets", path: "/astselect" },
  { number: 3, label: "Enter details", path: "/creation" },
];

export function StepHeader({ currentStep }) {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center space-x-6 py-8">
      {steps.map((step, index) => {
        const isClickable = step.number <= currentStep + 1;

        return (
          <React.Fragment key={index}>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => isClickable && navigate(step.path)}
                disabled={!isClickable}
                className={`w-13 h-13 cursor-pointer rounded-full flex items-center justify-center font-bold transition
                            hover:scale-125 duration-200 ease-in-out border-2 border-[#005177]
                   ${
                     step.number === currentStep
                       ? "bg-[#12badb] scale-120 shadow-lg"
                       : "bg-gray-300"
                   }
                `}
              >
                {step.number}
              </button>
              <span
                className={`text-lg font-medium transition
                  ${
                    step.number === currentStep
                      ? "text-[#12badb]"
                      : "text-gray-500"
                  }`}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className="w-8 h-px bg-gray-400" />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}


export function DSProducts({ rowCount, products, hasLong, isSelectOne }) {
  const [selectedProductIndices, setSelectedProductIndices] = useState(
    new Set()
  );

  let navigation = useNavigate();
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



  useEffect(() => {
    let arr = [...selectedProductIndices];
    if (arr.length === 0) return;
  
    if (isSelectOne) {
      console.log(products[arr[0]].namedid);
      sessionStorage.setItem("template", products[arr[0]].namedid);
    } else {
      let ids=[];
      for(let val of arr){
        ids.push(products[val].id);
      }
      
      let assets = ids.join(",");
      console.log(assets);
      sessionStorage.setItem("assets", assets);
    }
  }, [selectedProductIndices]);

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
            className={`products-container p-5 text-white flex flex-1 flex-col gap-5 rounded-xl transition-all duration-500
                      ${
                        selectedProductIndices.has(i + index)
                          ? "bg-[#12badb] scale-103 shadow-lg z-10"
                          : "bg-[#0082be]"
                      }`}
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
                onClick={() => {
                  setShowDescPopup(true);
                  setProductIndex(i + index);
                }}
              >
                More Details
              </button>
              <div className="border-1 border-[#005177]" />
              <button
                onClick={() => {
                  const updated = new Set(selectedProductIndices);
                  const productKey = i + index;
                  if (updated.has(productKey)) {
                    updated.delete(productKey);
                  } else if (isSelectOne && selectedProductIndices.size > 0) {
                    toast.error("Can't select more than one!");
                  } else {
                    updated.add(productKey);
                  }
                  setSelectedProductIndices(updated);
                }}
                className={`more-details-btn cursor-pointer transition duration-300 ease-in-out 
        p-2 shadow-md rounded-tr-2xl rounded-br-2xl border-r-2 border-y-2
        ${
          selectedProductIndices.has(i + index)
            ? "bg-[#2fc04e] text-white border-green-700 scale-105"
            : "bg-white text-black border-[#005177] hover:bg-[#2fc04e] hover:text-white"
        }
    `}
              >
                Select
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
                  onClick={() => {
                    const updated = new Set(selectedProductIndices);
                    if (updated.has(productIndex)) {
                      updated.delete(productIndex);
                    } else if (isSelectOne && selectedProductIndices.size > 0) {
                      toast.error("Can't select more than one!");
                    } else {
                      updated.add(productIndex);
                    }
                    setSelectedProductIndices(updated);
                  }}
                  className={`flex mx-auto mt-auto cursor-pointer transition duration-300 ease-in-out 
        p-2 shadow-md  border-r-2 border-y-2 rounded-2xl w-[50%] justify-center
        ${
          selectedProductIndices.has(productIndex)
            ? "bg-[#2fc04e] text-white border-green-700 scale-105"
            : "bg-white text-black border-[#005177] hover:bg-[#2fc04e] hover:text-white"
        }
    `}
                >
                  Select
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
    <div className="products-main-container">
      <div
        className="products-main-container flex flex-col gap-5 p-3 shadow-md border-gray-200
                    border-1 2xl:mx-85 xl:mx-50 lg:mx-40 md:mx-30 sm:mx-10 mx-5 rounded-xl"
      >
        {productRowContainers}
      </div>
    </div>
  );
}
