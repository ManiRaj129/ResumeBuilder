import React, { useEffect, useState } from "react";
import { ShopHeader } from "./Boilerplate";
import { GeneralFooter } from "./Boilerplate";
import { DisplayProductsURL } from "./Boilerplate";

const assetsURL = "http://127.0.0.1:8080/assets";

export default function Assets() {

    const [assetProducts, setAssetProducts] = useState([]);

    useEffect(() => {
        GETAssets();
    }, []);

    function GETAssets(){

        fetch(assetsURL)
            .then((response) => response.json())
            .then((data) => {
                setAssetProducts(data);
                console.log(data);
            })
            .catch((error) => {console.error("Error fetching asset products"), error})
    }

    return (
        <>
            <ShopHeader/>
            <div className="shop-welcome-container p-12 bg-[#005177] text-white text-2xl text-center
                        m-10 rounded-xl 2xl:mx-35">
                <p>
                    Welcome to the Asset Shop! <br/>
                    Browse through our list of Assets to get started on your resume!					
                </p>
            </div>
            <DisplayProductsURL rowCount={3} products={assetProducts} hasLong={false}/>
            <div className="p-6"/>
            <GeneralFooter/>
        </>
    )
}
