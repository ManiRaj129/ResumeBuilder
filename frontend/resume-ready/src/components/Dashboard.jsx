import React, { useEffect, useRef, useState } from "react";
import { GeneralHeader, GeneralFooter } from "./Boilerplate";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import LeftArrowSVG from "../assets/images/icons/arrow-narrow-circle-broken-left-svgrepo-com.svg"
import RightArrowSVG from "../assets/images/icons/arrow-narrow-circle-broken-right-svgrepo-com.svg"
import CrossSVG from "../assets/images/icons/cross-svgrepo-com.svg";

import { MockTemplates } from "../data/MockTemplates";
import { MockAssets } from "../data/MockAssets";
import { useNavigate } from "react-router-dom";
import SideBar from "./SideBar";

const resumesURL = "http://127.0.0.1:8080/resumes";
const templatesURL = "http://127.0.0.1:8080/templates";
const assetsURL = "http://127.0.0.1:8080/assets";

function Dashboard() {

	const userid = parseInt(sessionStorage.getItem("userid"), 10);

	const [myResumes, setMyResumes] = useState([]);
	const [myTemplates, setMyTemplates] = useState([]);
	const [myAssets, setMyAssets] = useState([]);

	const [isPaneOpen, setIsPaneOpen] = useState(false);

	useEffect(() => {
		GETResumes();
		GETTemplates();
		GETAssets();
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

	function GETTemplates(){

		fetch(templatesURL)
			.then((response) => response.json())
			.then((data) => {
				setMyTemplates(data);
				console.log(data);
			})
			.catch((error) => {console.error("Error fetching template products"), error})
	}

	function GETAssets(){

        fetch(assetsURL)
            .then((response) => response.json())
            .then((data) => {
                setMyAssets(data);
                console.log(data);
            })
            .catch((error) => {console.error("Error fetching asset products"), error})
    }

	const [resumeToDelete, setResumeToDelete] = useState();

	useEffect(() => {

		if (resumeToDelete){
			DELETEResume(resumeToDelete);
			console.log("deleting");
		}
	}, [resumeToDelete]);

	const DELETEResume = async (resumeToDelete) => {
		console.log(resumeToDelete);
		const {userid, resumeid} = resumeToDelete; 

		try {
			const response = await fetch
							(
								`${resumesURL}/delete?userid=${userid}&resumeid=${resumeid}`,
								{
									method: "DELETE",
									headers: {
										"Content-Type": "application/json",
									},
								}
							);
			
			if (!response.ok){
				const errorText = await response.text();
				throw new Error(`Failed to delete resume: ${errorText}`);
			}

			const result = await response.json();
			console.log("Success:", result);
			toast.success("Resume deleted");

			GETResumes();
		} catch (error) {
			console.error("Error:", error);
			toast.error("Resume deletion failed")
		}
	}

	return (
		<>
			<GeneralHeader setIsPaneOpen={setIsPaneOpen}/>
			<SideBar isPaneOpen={isPaneOpen} setIsPaneOpen={setIsPaneOpen}/>
			<DisplayMyResumes myResumes={myResumes} userid={userid} setResumeToDelete={setResumeToDelete}/>
			<div className="p-1"/>
			<DisplayMyTemplates myTemplates={myTemplates}/>
			<div className="p-1"/>
			<DisplayMyAssets myAssets={myAssets}/>
			<div className="p-5"/>
			<GeneralFooter/>
		</>
	);
}
export default Dashboard;

function DisplayMyResumes({myResumes, setResumeToDelete}){

	const [showDelete, setShowDelete] = useState(-1);

	let navigation = useNavigate();

	const scrollRef = useRef(null);

	const scroll = (direction) => {

		const container = scrollRef.current;
		const scrollAmount = 400;
		if (direction == "left"){
			container.scrollBy({left: -scrollAmount, behavior: 'smooth'});
		}
		else {
			container.scrollBy({left: scrollAmount, behavior: 'smooth'});
		}
	};

	return (
		<div className="my-resumes-main-container m-5">
			<div className="title-buttons-container flex flex-row gap-3">
				<p className="text-[#005177] text-2xl p-2">
					My Resumes
				</p>
				<button className="create-resume-btn cursor-pointer hover:text-[#189ab4] transition duration-300
									ease-in-out hover:bg-white p-2 rounded-2xl hover:scale-110 shadow-md border-gray-100 
									border-1 bg-[#189ab4] text-white hover:border-[#005177]"
						onClick={() => navigation('/tempselect')}>
					Create Resume +
				</button>
				<button className="view-more-btn cursor-pointer hover:text-[#189ab4] transition duration-300
									ease-in-out hover:bg-white p-2 rounded-2xl hover:scale-110 shadow-md border-gray-100 
									border-1 bg-[#189ab4] text-white ml-auto px-6 hover:border-[#005177]"
						onClick={() => navigation('/myresumes')}>
					View More
				</button>
			</div>
			<div className="p-1"/>
			<div className="relative">
				<div ref={scrollRef} 
					 className="resumes-container flex flex-row gap-5 bg-[#005177] rounded-md overflow-x-auto
								p-6 shadow-md w-full">
					{myResumes.length === 0 && 
						<div className="temp-container flex flex-col items-center justify-center bg-white 
										rounded-md p-3 shadow-md min-w-full max-w-full">
							<p className="text-center py-40 text-lg">
								You have no resumes...<br/> Create some now?
							</p>
						</div>
					}
					{myResumes.map((resume, index) => (
						<div key={resume.resumeid}
							 className="resume-container flex flex-col items-center justify-center bg-white 
										rounded-md p-3 shadow-md min-w-[280px] max-w-[280px] relative">
							<img src={CrossSVG} alt="cross svg"
								 className="cross-btn-container absolute w-6 top-1.5 right-1.5 bg-[#189ab4] rounded-3xl 
								 			cursor-pointer hover:bg-red-500 transition duration-300 ease-in-out"
								 onClick={() => setShowDelete(index)}>
							</img>
							<p className="font-bold">
								{resume.name}
							</p>
							<div className="p-1"/>
							<img src={resume.img64} alt={resume.alt}
								className="w-[250px] border-1 border-gray-200 shadow-sm hover:scale-112 transition
											duration-300 ease-in-out cursor-pointer w-[200px]"
								onClick={() => {
											navigation(`/creation?resumeid=${resume.resumeid}`);
											sessionStorage.setItem("template", resume.template);
											sessionStorage.setItem("assets", resume.assets);
										}}>
							</img>
							<div className="p-1"/>
							<p className="text-sm font-bold">Last updated: {resume.lastUpdated}</p>
							<div className={`delete-popup-container absolute flex flex-col gap-4 text-2xl bg-[#189ab4]
											w-full h-full items-center justify-center text-white rounded-md shadow-md
											transition duration-200 ease-in-out
											${(showDelete === index) ?
											"opacity-100 scale-100 pointer-events-auto"
											:
											"opacity-0 scale-95 pointer-events-none"}`}>
								<p>
									{`Delete resume?`}
								</p>
								<div className="p-2"/>
								<button className="confirm-delete-btn bg-red-500 p-1 rounded-md py-2 border-1 border-white 
												   w-[80%] cursor-pointer hover:scale-110 transition duration-200
												   ease-in-out"
										onClick={() => {
											setResumeToDelete({userid: resume.userid, resumeid: resume.resumeid});
											setShowDelete(-1);
										}}>
									Confirm
								</button>
								<button className="cancel-delete-btn bg-[#005177] p-1 rounded-md py-2 border-1 border-white 
												   w-[80%] cursor-pointer hover:scale-110 transition duration-200
												   ease-in-out"
										onClick={() => setShowDelete(-1)}>
									Cancel
								</button>
							</div>
						</div>
					))}
				</div>
				<div className="absolute top-50 left-2">
					<img src={LeftArrowSVG} alt="left arrow svg"
							className="w-13 bg-[#005177] rounded-4xl p-0.5 border-3 border-white
									cursor-pointer hover:scale-110 transition duration-200 
									hover:bg-[#189ab4] hover:border-[#005177] shadow-md"
							onClick={() => scroll("left")}>
					</img>
				</div>
				<div className="absolute top-50 right-2">
					<img src={RightArrowSVG} alt="right arrow svg"
							className="w-13 bg-[#005177] rounded-4xl p-0.5 border-3 border-white
									cursor-pointer hover:scale-110 transition duration-200 
									hover:bg-[#189ab4] hover:border-[#005177] shadow-md"
							onClick={() => scroll("right")}>
					</img>
				</div>
			</div>
		</div>
	)
}

function DisplayMyTemplates({myTemplates}){

	let navigation = useNavigate();

	const scrollRef = useRef(null);

	const scroll = (direction) => {

		const container = scrollRef.current;
		const scrollAmount = 400;
		if (direction == "left"){
			container.scrollBy({left: -scrollAmount, behavior: 'smooth'});
		}
		else {
			container.scrollBy({left: scrollAmount, behavior: 'smooth'});
		}
	};

	return (
		<div className="my-templates-main-container m-5">
			<div className="title-buttons-container flex flex-row gap-3">
				<p className="text-[#005177] text-2xl p-2">
					My Templates
				</p>
				<button className="view-more-btn cursor-pointer hover:text-[#189ab4] transition duration-300
									ease-in-out hover:bg-white p-2 rounded-2xl hover:scale-110 shadow-md border-gray-100 
									border-1 bg-[#189ab4] text-white ml-auto px-6 hover:border-[#005177]"
						onClick={() => navigation('/mytemplates')}>
					View More
				</button>
			</div>
			<div className="p-1"/>
			<div className="relative">
				<div ref={scrollRef} 
					 className="templates-container flex flex-row gap-5 bg-[#005177] rounded-md overflow-x-auto
								p-6 shadow-md w-full">
					{myTemplates.length === 0 && 
						<div className="temp-container flex flex-col items-center justify-center bg-white 
										rounded-md p-3 shadow-md min-w-full max-w-full">
							<p className="text-center py-40 text-lg">
								You have no templates...<br/> Purchase some now?
							</p>
						</div>
					}
					{myTemplates.map((template) => (
						<div key={template.id} className="template-container flex flex-col items-center justify-center bg-white 
														rounded-md p-3 shadow-md min-w-[280px] max-w-[280px]">
							<img src={template.img64} alt={template.alt}
								className="w-[250px] border-1 border-gray-200 shadow-sm hover:scale-115 transition
											duration-300 ease-in-out w-[200px]">
							</img>
							<div className="p-1"/>
							<p className="text-sm font-bold">{template.name}</p>
						</div>
					))}
				</div>
				<div className="absolute top-50 left-2">
					<img src={LeftArrowSVG} alt="left arrow svg"
							className="w-13 bg-[#005177] rounded-4xl p-0.5 border-3 border-white
									cursor-pointer hover:scale-110 transition duration-200 
									hover:bg-[#189ab4] hover:border-[#005177] shadow-md"
							onClick={() => scroll("left")}>
					</img>
				</div>
				<div className="absolute top-50 right-2">
					<img src={RightArrowSVG} alt="right arrow svg"
							className="w-13 bg-[#005177] rounded-4xl p-0.5 border-3 border-white
									cursor-pointer hover:scale-110 transition duration-200 
									hover:bg-[#189ab4] hover:border-[#005177] shadow-md"
							onClick={() => scroll("right")}>
					</img>
				</div>
			</div>
		</div>
	)
}

function DisplayMyAssets({myAssets}){

	let navigation = useNavigate();
	
	const scrollRef = useRef(null);

	const scroll = (direction) => {

		const container = scrollRef.current;
		const scrollAmount = 400;
		if (direction == "left"){
			container.scrollBy({left: -scrollAmount, behavior: 'smooth'});
		}
		else {
			container.scrollBy({left: scrollAmount, behavior: 'smooth'});
		}
	};

	return (
		<div className="my-templates-main-container m-5">
			<div className="title-buttons-container flex flex-row gap-3">
				<p className="text-[#005177] text-2xl p-2">
					My Assets
				</p>
				<button className="view-more-btn cursor-pointer hover:text-[#189ab4] transition duration-300
									ease-in-out hover:bg-white p-2 rounded-2xl hover:scale-110 shadow-md border-gray-100 
									border-1 bg-[#189ab4] text-white ml-auto px-6 hover:border-[#005177]"
						onClick={() => navigation('/myassets')}>
					View More
				</button>
			</div>
			<div className="p-1"/>
			<div className="relative">
				<div ref={scrollRef} 
					 className="assets-container flex flex-row gap-5 bg-[#005177] rounded-md overflow-x-auto
								p-6 shadow-md w-full">
					{myAssets.length === 0 && 
						<div className="temp-container flex flex-col items-center justify-center bg-white 
										rounded-md p-3 shadow-md min-w-full max-w-full">
							<p className="text-center py-40 text-lg">
								You have no assets...<br/> Purchase some now?
							</p>
						</div>
					}
					{myAssets.map((asset) => (
						<div key={asset.id} className="asset-container flex flex-col items-center justify-center bg-white 
														rounded-md p-3 shadow-md min-w-[280px] max-w-[280px]">
							<img src={asset.img64} alt={asset.alt}
								className="w-[250px] border-1 border-gray-200 shadow-sm hover:scale-115 transition
											duration-300 ease-in-out w-[200px]">
							</img>
							<div className="p-1"/>
							<p className="text-sm font-bold">{asset.name}</p>
						</div>
					))}
				</div>
				<div className="absolute top-50 left-2">
					<img src={LeftArrowSVG} alt="left arrow svg"
							className="w-13 bg-[#005177] rounded-4xl p-0.5 border-3 border-white
									cursor-pointer hover:scale-110 transition duration-200 
									hover:bg-[#189ab4] hover:border-[#005177] shadow-md"
							onClick={() => scroll("left")}>
					</img>
				</div>
				<div className="absolute top-50 right-2">
					<img src={RightArrowSVG} alt="right arrow svg"
							className="w-13 bg-[#005177] rounded-4xl p-0.5 border-3 border-white
									cursor-pointer hover:scale-110 transition duration-200 
									hover:bg-[#189ab4] hover:border-[#005177] shadow-md"
							onClick={() => scroll("right")}>
					</img>
				</div>
			</div>
		</div>
	)

}