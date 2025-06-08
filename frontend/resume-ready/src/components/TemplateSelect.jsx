import { GeneralFooter } from "./Boilerplate";
import { StepHeader, DSProducts } from "./ProcessHelper";
import React, { useState, useEffect } from "react";

const templatesURL = "http://127.0.0.1:8080/templates";

export default function TemplateSelect() {

  const [TemplateProducts, setTemplateProducts] = useState([]);
  
    useEffect(() => {
      GETTemplates();
    }, []);
  
    function GETTemplates(){
  
      fetch(templatesURL)
        .then((response) => response.json())
        .then((data) => {
          setTemplateProducts(data);
          console.log(data);
        })
        .catch((error) => {console.error("Error fetching template products"), error})
    }
  

  return (
    <>
      <StepHeader currentStep={1} />
      <DSProducts rowCount={3} products={TemplateProducts} hasLong={false} isSelectOne={true}/>
      <div className="p-6" />
      <GeneralFooter />
    </>
  );
}
