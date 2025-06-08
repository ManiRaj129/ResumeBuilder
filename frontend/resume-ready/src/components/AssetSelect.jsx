import { GeneralFooter } from "./Boilerplate";
import { StepHeader, DSProducts } from "./ProcessHelper";
import React, { useState, useEffect } from "react";
const assetsURL = "http://127.0.0.1:8080/assets";

export default function AssetSelect() {
  const [AssetProducts, setAssetProducts] = useState([]);

  useEffect(() => {
    GETAssets();
  }, []);

  function GETAssets() {
    fetch(assetsURL)
      .then((response) => response.json())
      .then((data) => {
        setAssetProducts(data);
        console.log(data);
      })
      .catch((error) => {
        console.error("Error fetching asset products"), error;
      });
  }

  return (
    <>
      <StepHeader currentStep={2} />
      <DSProducts rowCount={3} products={AssetProducts} hasLong={false} isSelectOne={false}/>
      <div className="p-6" />
      <GeneralFooter />
    </>
  );
}