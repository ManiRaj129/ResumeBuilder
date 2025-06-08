import React, { useState, useEffect } from "react";
import { GeneralHeader, GeneralFooter } from "./Boilerplate";

import GearSVG from "../assets/images/icons/gear-svgrepo-com.svg";
import MinusSVG from "../assets/images/icons/minus-svgrepo-com.svg"
import PlusSVG from "../assets/images/icons/plus-svgrepo-com.svg"

const assetsURL = "http://127.0.0.1:8080/assets";

function MyAssets(){

	useEffect(() => {
		GETAssets();
	}, []);

	function GETAssets(){

        fetch(assetsURL)
            .then((response) => response.json())
            .then((data) => {
                setMyAssets(data);
                console.log(data);
            })
            .catch((error) => {console.error("Error fetching asset products"), error})
    }

	const [myAssets, setMyAssets] = useState([]);
	
	const [rowItemCount, setRowItemCount] = useState(4);
	const [showFilterMenu, setShowFilterMenu] = useState(false);

	return (
		<>
			<GeneralHeader/>
			<div className="relative">
				<img src={GearSVG} alt="gear-icon"
					 className="absolute w-10 right-5 top-5 border-2 border-[#005177] 
								rounded-3xl hover:rotate-90 cursor-pointer
								hover:scale-110 transition duration-200 ease-in-out"
					 onClick={() => {
						setShowFilterMenu((prev) => !prev)
					 }}>
				</img>
				{<DisplayFiltersMenu showFilterMenu={showFilterMenu}
									 rowItemCount={rowItemCount} 
									 setRowItemCount={setRowItemCount}/>
				}
				<div className="my-assets-title-container flex justify-center">
					<p className="px-10 py-5 bg-[#005177] text-white text-2xl text-center
								m-7 rounded-xl w-fit">
						My Assets
					</p>
				</div>
			</div>
			<DisplayTemplates rowCount={rowItemCount} items={myAssets}/>
			<div className="p-4"/>
			<GeneralFooter/>
		</>
	)
}
export default MyAssets;

function DisplayFiltersMenu({showFilterMenu, rowItemCount, setRowItemCount}){

	return (
		<div className={`absolute p-3 top-5 right-20 bg-[#005177] rounded-lg w-[350px]
						 transition duration-300 ease-in-out
						 ${showFilterMenu ? 
						 "opacity-100 scale-100 pointer-events-auto"
						 :
						 "opacity-0 scale-95 pointer-events-none"}`}>
			<div className="row-items-count-container flex flex-row gap-2 items-center">
				<p className="text-white p-1">
					Number of items per row:
				</p>
				<p className="p-1 bg-white rounded-lg w-[40px] text-center">
					{rowItemCount}
				</p>
				<img src={PlusSVG} alt="plus-svg"
						className="w-8 bg-white rounded-3xl cursor-pointer
								hover:scale-110 transition duration-300
								ease-in-out"
						onClick={() => rowItemCount < 5 && setRowItemCount((prev) => ++prev)}>
				</img>
				<img src={MinusSVG} alt="minus-svg"
						className="w-8 bg-white rounded-3xl cursor-pointer
								hover:scale-110 transition duration-300
								ease-in-out"
						onClick={() => rowItemCount > 1 && setRowItemCount((prev) => --prev)}>
				</img>
			</div>
		</div>
	)
}

export function DisplayTemplates({rowCount, items}){

	const itemRowContainers = [];

	for (let i = 0; i < items.length; i += rowCount){

		let row = (
			<div key={`p${i}`} 
				 className="items-row-container flex flex-col flex-wrap gap-5 bg-[#005177] p-5 rounded-xl
							lg:flex-row">
				{items.slice(i, i + rowCount).map((item) => (
					<div key={item.id} 
						 className="items-container p-5 text-white flex flex-1 flex-col 
									bg-[#0082be] rounded-xl gap-5">
						<img src={item.img64} alt={item.alt}
							 className="item-image rounded">
						</img>
						<p className="font-bold text-center">
							{item.name} Asset
						</p>
					</div>
				))}
			</div>
		)
		itemRowContainers.push(row);
	}

	if (items.length == 0) {

		itemRowContainers.push(
			<div className="text-center text-xl p-20">
				You have no assets... Purchase some?
			</div>
		)
	}

	return (
		<div className="items-main-container flex flex-col gap-5 p-3 shadow-md border-gray-200
					border-1 2xl:mx-85 xl:mx-50 lg:mx-40 md:mx-30 sm:mx-10 mx-5 rounded-xl">
			{itemRowContainers}
		</div>		
	)
}