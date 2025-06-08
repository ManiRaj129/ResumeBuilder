import React, { useEffect, useState } from "react";
import { DisplayProductsURL, ShopHeader } from "./Boilerplate";
import { GeneralFooter } from "./Boilerplate";

const templatesURL = "http://127.0.0.1:8080/templates";

function Templates() {

	const [templateProducts, setTemplateProducts] = useState([]);

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
			<ShopHeader/>
			<div className="shop-welcome-container p-12 bg-[#005177] text-white text-2xl text-center
							m-10 rounded-xl 2xl:mx-35">
				<p>
					Welcome to the Templates Shop! <br/>
					Browse through our list of templates to get started on your resume!					
				</p>
			</div>
			<DisplayProductsURL rowCount={3} products={templateProducts} hasLong={true}/>
			<div className="p-6"/>
			<GeneralFooter/>
		</>
	)
}
export default Templates;