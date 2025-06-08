import React, { useEffect, useState } from "react";
import { ShopHeader } from "./Boilerplate";
import { GeneralFooter } from "./Boilerplate";
import { DisplayProductsURL } from "./Boilerplate";

const servicesURL = "http://127.0.0.1:8080/services";

export default function Services() {

    const [serviceProducts, setServiceProducts] = useState([]);

    useEffect(() => {
        GETServices();
    }, []);

    function GETServices(){

		fetch(servicesURL)
			.then((response) => response.json())
			.then((data) => {
				setServiceProducts(data);
				console.log(data);
			})
			.catch((error) => {console.error("Error fetching service products"), error})
	}

    return (
        <>
            <ShopHeader/>
            <div className="shop-welcome-container p-12 bg-[#005177] text-white text-2xl text-center
                        m-10 rounded-xl 2xl:mx-35">
                <p>
                    Services <br/>
                    We offer a wide array of services to help you succeed in resume building.				
                </p>
            </div>
            <DisplayProductsURL rowCount={3} products={serviceProducts} hasLong={true}/>
            <div className="p-6"/>
            <GeneralFooter/>
        </>
    )
}
