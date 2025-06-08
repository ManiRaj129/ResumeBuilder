import React, { useState, useEffect } from "react";
import { GeneralHeader, GeneralFooter } from "./Boilerplate";

import GearSVG from "../assets/images/icons/gear-svgrepo-com.svg";
import MinusSVG from "../assets/images/icons/minus-svgrepo-com.svg"
import PlusSVG from "../assets/images/icons/plus-svgrepo-com.svg"
import { toast } from "react-toastify";

const resumesURL = "http://127.0.0.1:8080/resumes";

function MyResumes(){

	const userid = parseInt(sessionStorage.getItem("userid"), 10);
	
	const [myResumes, setMyResumes] = useState([]);

	useEffect(() => {
			GETResumes();
		}, []);

	function GETResumes(){

		fetch(`${resumesURL}/${userid}`)
			.then((response) => response.json())
			.then((data) => {
				setMyResumes(data);
				console.log(data);
			})
			.catch((error) => {console.error("Error fetching user resumes"), error})
	}

	const [rowItemCount, setRowItemCount] = useState(3);
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
										setRowItemCount={setRowItemCount}
										myResumes={myResumes}
										setMyResumes={setMyResumes}/>
				}
				<div className="my-resume-title-container flex justify-center">
					<p className="px-10 py-5 bg-[#005177] text-white text-2xl text-center
								m-7 rounded-xl w-fit">
						My Resumes
					</p>
				</div>
			</div>
			<DisplayResumes rowCount={rowItemCount} items={myResumes}/>
			<div className="p-4"/>
			<GeneralFooter/>
		</>
	)
}
export default MyResumes;

function DisplayFiltersMenu({showFilterMenu, rowItemCount, setRowItemCount, myResumes, setMyResumes}){

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
			<div className="filter-container flex flex-col p-1 gap-3 text-white mt-6">
				<p>
					Filter:
				</p>
				<button className="text-left bg-white text-black p-2 rounded-md cursor-pointer
									hover:scale-105 transition duration-200"
						onClick={() => {
							filterResumeAscendingDate(myResumes, setMyResumes);
							toast.success("Sorted by date (ascending)");
						}}>
					by Date (Ascending)
				</button>
				<button className="text-left bg-white text-black p-2 rounded-md cursor-pointer
									hover:scale-105 transition duration-200"
						onClick={() => {
							filterResumeDescendingDate(myResumes, setMyResumes);
							toast.success("Sorted by date (descending)");
						}}>
					by Date (Descending)
				</button>
				<div className="p-0.5 my-2 bg-white rounded-3xl"/>
				<button className="text-left bg-white text-black p-2 rounded-md cursor-pointer
									hover:scale-105 transition duration-200"
						onClick={() => {
							filterResumeAscendingAlphabet(myResumes, setMyResumes);
							toast.success("Sorted by name (ascending)");
						}}>
					by Name (Ascending)
				</button>
				<button className="text-left bg-white text-black p-2 rounded-md cursor-pointer
									hover:scale-105 transition duration-200"
						onClick={() => {
							filterResumeDescendingAlphabet(myResumes, setMyResumes);
							toast.success("Sorted by name (descending)");
						}}>
					by Name (Descending)
				</button>
			</div>
		</div>
	)
}

function filterResumeAscendingDate(myResumes, setMyResumes){

	let result = [...myResumes];
	result.sort((r1, r2) => {

		const [month1, day1, year1] = r1.lastUpdated.slice(0, 10).split('/');
		const [hour1, min1, sec1] = r1.lastUpdated.slice(13).split(':');

    	const [month2, day2, year2] = r2.lastUpdated.slice(0, 10).split('/');
		const [hour2, min2, sec2] = r2.lastUpdated.slice(13).split(':');

		const date1 = new Date(`${year1}-${month1.padStart(2, '0')}-${day1.padStart(2, '0')}T${hour1.padStart(2, '0')}:${min1.padStart(2, '0')}:${sec1.padStart(2, '0')}`);
    	const date2 = new Date(`${year2}-${month2.padStart(2, '0')}-${day2.padStart(2, '0')}T${hour2.padStart(2, '0')}:${min2.padStart(2, '0')}:${sec2.padStart(2, '0')}`);
		return date1 - date2;
	});
	setMyResumes(result);
}

function filterResumeDescendingDate(myResumes, setMyResumes){

	let result = [...myResumes];
	result.sort((r1, r2) => {

		const [month1, day1, year1] = r1.lastUpdated.slice(0, 10).split('/');
		const [hour1, min1, sec1] = r1.lastUpdated.slice(13).split(':');

    	const [month2, day2, year2] = r2.lastUpdated.slice(0, 10).split('/');
		const [hour2, min2, sec2] = r2.lastUpdated.slice(13).split(':');

		const date1 = new Date(`${year1}-${month1.padStart(2, '0')}-${day1.padStart(2, '0')}T${hour1.padStart(2, '0')}:${min1.padStart(2, '0')}:${sec1.padStart(2, '0')}`);
    	const date2 = new Date(`${year2}-${month2.padStart(2, '0')}-${day2.padStart(2, '0')}T${hour2.padStart(2, '0')}:${min2.padStart(2, '0')}:${sec2.padStart(2, '0')}`);

		console.log(date1)

		return date2 - date1;
	});
	setMyResumes(result);
}

function filterResumeAscendingAlphabet(myResumes, setMyResumes){

	let result = [...myResumes];
	result.sort((r1, r2) => (r1.name.toLowerCase()).localeCompare(r2.name.toLowerCase()));
	setMyResumes(result);
}

function filterResumeDescendingAlphabet(myResumes, setMyResumes){

	let result = [...myResumes];
	result.sort((r1, r2) => (r2.name.toLowerCase()).localeCompare(r1.name.toLowerCase()));
	setMyResumes(result);
}

export function DisplayResumes({rowCount, items}){

	const itemRowContainers = [];

	for (let i = 0; i < items.length; i += rowCount){

		let row = (
			<div key={`p${i}`} 
				 className="items-row-container flex flex-col flex-wrap gap-5 bg-[#005177] p-5 rounded-xl
				 			lg:flex-row">
				{items.slice(i, i + rowCount).map((item) => (
					<div key={item.resumeid} 
						 className="items-container p-5 text-white flex flex-1 flex-col 
									bg-[#0082be] rounded-xl gap-5">
						<p className="font-bold text-center">
								{item.name}
						</p>
						<img src={item.img64} alt={item.alt}
							 className="item-image rounded">
						</img>
						<p className="item-description text-center font-bold">
							Last updated: {item.lastUpdated}
						</p>
						<button className="continue-edit-btn cursor-pointer transition duration-300 ease-in-out 
											p-2 shadow-md bg-white text-black rounded-2xl hover:border-white
											border-[#005177] border-2 hover:bg-[#005177] 
											hover:text-white hover:scale-105"
								/**
								 * TOCHANGE
								 */
								onClick={() => navigation('/templates')}>
							Continue Editing
						</button>
					</div>
				))}
			</div>
		)
		itemRowContainers.push(row);
	}

	if (items.length == 0) {

		itemRowContainers.push(
			<div className="text-center text-xl p-20">
				You have no resumes... Create some?
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