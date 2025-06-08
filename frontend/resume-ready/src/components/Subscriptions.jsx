import React, { useEffect, useState } from "react";
import { ShopHeader } from "./Boilerplate";
import { GeneralFooter } from "./Boilerplate";
import { DisplayProductsURL } from "./Boilerplate";

const subscriptionsURL = "http://127.0.0.1:8080/subscriptions";

export default function Subscriptions() {

    const [subscriptionProducts, setSubscriptionProducts] = useState([]);

    useEffect(() => {
        GETSubscriptions();
    }, []);

    function GETSubscriptions(){

		fetch(subscriptionsURL)
			.then((response) => response.json())
			.then((data) => {
				setSubscriptionProducts(data);
				console.log(data);
			})
			.catch((error) => {console.error("Error fetching subscription products"), error})
	}

    return (
        <>
            <ShopHeader/>
            <div className="shop-welcome-container p-12 bg-[#005177] text-white text-2xl text-center
                        m-10 rounded-xl 2xl:mx-35">
                <p>
                   Subscriptions and Bundels <br/>
                   Wanna get more value out of your purchases? Purchase a bundle or sign up for a subscription!				
                </p>
            </div>
            <DisplayProductsURL rowCount={3} products={subscriptionProducts} hasLong={true}/>
            <div className="p-6"/>
            <GeneralFooter/>
        </>
    )
}