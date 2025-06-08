import React, { useEffect } from "react";
import { data, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { StepHeader } from './ProcessHelper';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import RRLogo from "../assets/images/logo/ResumeReadyLogo.png";
import LogoutSVG from "../assets/images/icons/logout-2-svgrepo-com.svg"
import LeftFromLineSVG from "../assets/images/icons/arrow-left-from-line-svgrepo-com.svg"
import RightFromLineSVG from "../assets/images/icons/arrow-right-from-line-svgrepo-com.svg"
import ZoomInSVG from "../assets/images/icons/plus-lens-svgrepo-com.svg"
import ZoomOutSVG from "../assets/images/icons/minus-lens-svgrepo-com.svg"

import { GeneralFooter } from "./Boilerplate";

const resumeURL = "http://127.0.0.1:8080/resumes";
const assetsURL = "http://127.0.0.1:8080/assetsmetadata";

function ResumeCreation() {

	const userid = parseInt(sessionStorage.getItem("userid"), 10);
	const template = sessionStorage.getItem("template");
	const assets = sessionStorage.getItem("assets");
	
	const {search} = useLocation();
	const queryParams = new URLSearchParams(search);
	const resumeid = queryParams.get("resumeid");

	// debug
	//console.log(`${resumeid} ${template} ${assets}`)

	const [selectedTemplate, setSelectedTemplate] = useState("basic");

	const [selectedAssets, setSelectedAssets] = useState([]);

	const [resumeData, setResumeData] = useState({});

	const [resumeSaveData, setResumeSaveData] = useState({

		resumeid: "",
		userid: userid,
		name: "",
		lastUpdated: "",
		template: template,
		assets: assets,
		saveData: {}
	});

	useEffect(() => {

		if (!template) return;

		setSelectedTemplate(template);

	}, [template])

	/**
	 * Grabbing specific assets from database
	 */
	useEffect(() => {
		
		if (!assets) return;

		console.log(`${assetsURL}/specific?assets=${assets}`);
		fetch(`${assetsURL}/specific?assets=${assets}`)
			.then((response) => response.json())
			.then((data) => {
				setSelectedAssets(data);
				console.log(data);
			})
			.catch((error) => {console.error("Error fetching resume data"), error})

	}, [assets]);

	/**
	 * Grabbing saved resume from database if applicable
	 */
	useEffect(() => {
		
		if (!resumeid) return;

		console.log(`${resumeURL}/resume?userid=${userid}&resumeid=${resumeid}`);
		fetch(`${resumeURL}/resume?userid=${userid}&resumeid=${resumeid}`)
			.then((response) => response.json())
			.then((data) => {
				setResumeSaveData(data);
				setResumeData(data.saveData);
				console.log(data);
			})
			.catch((error) => {console.error("Error fetching resume data"), error})

	}, [resumeid]);

	const handleSubmitResume = async () => {

		let postPut = true;

		const imageBase64 = await generateResumeImageBase64();
		if (!imageBase64){
			toast.success("Could not generate resume thumbnail");
			return;
		}

		let completeSaveData = {...resumeSaveData};

		if (!completeSaveData.resumeid || completeSaveData.resumeid.length === 0){
			completeSaveData.resumeid = getNewResumeID(resumeSaveData);
		}
		else {
			postPut = false;
		}

		if (!completeSaveData.name || completeSaveData.name.length === 0){
			completeSaveData.name = "No Name";
		}

		completeSaveData.lastUpdated = getPrettyCurrentDateTime();
		completeSaveData.img64 = imageBase64;
		delete completeSaveData._id;
		setResumeSaveData(completeSaveData);

		try {
			const response = await fetch(resumeURL, {
				method: `${postPut ? "POST" : "PUT"}`,
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(completeSaveData)
			});

			if (!response.ok){
				throw new Error("Failed to save resume");
			}

			const result = await response.json();
			console.log("Success:", result);
			toast.success("Resume saved");
		} catch (error) {
			console.error("Error:", error);
			toast.error("Error saving resume");
		}
	}

	const handleResumeSaveDataChange = (e) => {

		const {name, value} = e.target;

		setResumeSaveData((prev) => ({
			...prev,
			[name]: value,
		}))
		//console.log(resumeSaveData)
	}

	const handleChange = (e) => {

		const {id, value} = e.target;
		setResumeData((resumeData) => {

			const newData = {...resumeData};
			if (value){
				newData[id] = value;
			}
			else {
				delete newData[id];
			}
			return newData;
		})
	}

	useEffect(() => {

		setResumeSaveData((prev) => ({
			...prev,
			saveData: resumeData
		}))
	}, [resumeData])

	useEffect(() => {

		setResumeSaveData((prev) => ({
			...prev,
			template: selectedTemplate
		}))
	}, [selectedTemplate])

	const generateResumeImageBase64 = async () => {

		const masterContainer = document.getElementById('fixed-size-resume-master-container');

		if (!masterContainer){
			console.log("Resume master container not found");
			return;
		}

		const canvas = await html2canvas(masterContainer, {
			backgroundColor: null,
			scale: 2,
		});

		// convert image to base64-encode
		return canvas.toDataURL('image/png');
	}

	const handleDownloadPNG = async () => {

		const masterContainer = document.getElementById('fixed-size-resume-master-container');

		if (!masterContainer){
			console.log("Resume master container not found");
			return;
		}

		const canvas = await html2canvas(masterContainer, {
			backgroundColor: null,
			scale: 2,
		});

		// convert image to base64-encode
		const dataURL = canvas.toDataURL('image/png');

		const link = document.createElement('a');
		link.href = dataURL;
		link.download = 'resume' + getCurrentDateTime() + '.png';
		link.click();
		toast.success("Resume PNG created");
	};

	const handleDownloadPDF = async () => {

		const masterContainer = document.getElementById('fixed-size-resume-master-container');

		if (!masterContainer){
			console.log("Resume master container not found");
			return;
		}

		const canvas = await html2canvas(masterContainer, {
			backgroundColor: null,
			scale: 2,
		});

		// convert image to base64-encode
		const dataURL = canvas.toDataURL('image/png');

		const pdf = new jsPDF({
			orientation: "portrait",
			unit: "px",
			format: [canvas.width, canvas.height]
		});

		pdf.addImage(dataURL, 'PNG', 0, 0, canvas.width, canvas.height);
		pdf.save('resume' + getCurrentDateTime() + '.pdf');
		toast.success("Resume PDF created");
	}

	return (
		<>	
			<div className="flex justify-center bg-[#005177] p-2">
				<div className="rounded-xl border-2 border-[#002436] bg-white px-5">
					<StepHeader currentStep={3}/>
				</div>
			</div>
			<div className="border-1 border-[#013d59]"/>
			<CreationBody handleChange={handleChange} handleDownloadPNG={handleDownloadPNG} 
						  handleDownloadPDF={handleDownloadPDF} resumeData={resumeData} 
						  setResumeData={setResumeData} selectedTemplate={selectedTemplate}
						  resumeSaveData={resumeSaveData} handleResumeSaveDataChange={handleResumeSaveDataChange}
						  handleSubmitResume={handleSubmitResume} selectedAssets={selectedAssets}
			/>
			<GeneralFooter/>
		</>
	)
};
export default ResumeCreation;

function CreationBody({handleChange, handleDownloadPNG, handleDownloadPDF, 
						resumeData, setResumeData, selectedTemplate,
						resumeSaveData, handleResumeSaveDataChange, handleSubmitResume,
						selectedAssets}) {

	let navigation = useNavigate();

	const [LWPercent, setLWPercent] = useState(50);
	const [RWPercent, setRWPercent] = useState(50);

	const [ZoomScale, setZoomScale] = useState(100);

	return (
		<div className="flex flex-col h-[95vh]">	
			<div className="toolbar-container flex flex-row gap-3 bg-[#005177] p-2 shadow-md">
				<div className="relative group inline-block">
					<img src={RRLogo} alt="resume ready logo"
						className="h-14 cursor-pointer hover:scale-110 transition duration-200
								ease-in-out"
						onClick={() => navigation('/dashboard')}>
					</img>
					<div className="absolute transform mt-1 border-1 border-[#005177] shadow-md
								bg-white text-black text-xs px-2 py-1 rounded z-50
								opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
						Back to dashboard?
					</div>
				</div>
				
				<div className="resume-name-container flex flex-row gap-2">
					<input className="bg-white px-2 w-90 rounded-md"
						type="text"
						name="name"
						value={resumeSaveData.name}
						placeholder="Type your resume name here"
						onChange={handleResumeSaveDataChange}
						required>
					</input>
				</div>
				<div className="btn-container flex flex-row flex-wrap gap-2 bg-[#0082be] p-2 rounded-md ml-auto shadow-md">
					<button className="border-1 border-white rounded-sm text-white bg-[#189ab4] px-2
									   hover:scale-110 transition duration-300 ease-in-out cursor-pointer
									   hover:bg-white hover:text-[#189ab4] hover:border-[#189ab4] shadow-md"
							onClick={() => handleSubmitResume()}>
						Save Resume
					</button>
					<button className="border-1 border-white rounded-sm text-white bg-[#ff1c3a] px-2
									   hover:scale-110 transition duration-300 ease-in-out cursor-pointer
									   hover:bg-white hover:text-[#ff1c3a] hover:border-[#ff1c3a] shadow-md"
							onClick={() => {
								setResumeData({});
							}}>
						Clear Resume
					</button>
					<div className="p-0.5 bg-[#005177] rounded-xl"/>
					<img src={LeftFromLineSVG}
						 className="w-10 cursor-pointer p-1 rounded-md hover:scale-115
						 			bg-white transition duration-300 ease-in-out shadow-md"
						 onClick={() => {

							if (LWPercent > 30) {
								setLWPercent((LWPercent) => LWPercent -= 5);
								setRWPercent((RWPercent) => RWPercent += 5);
							} 
						 }}>
					</img>
					<img src={RightFromLineSVG}
						 className="w-10 cursor-pointer p-1 rounded-md hover:scale-115
						 			bg-white transition duration-300 ease-in-out shadow-md"
						 onClick={() => {
							
							if (RWPercent > 20) {
								setLWPercent((LWPercent) => LWPercent += 5);
								setRWPercent((RWPercent) => RWPercent -= 5);
							}
						 }}>
					</img>
					<button className="p-2 bg-white rounded-md hover:scale-115
						 			   transition duration-300 ease-in-out cursor-pointer
									   hover:text-[#005177] shadow-md"
							onClick={() => {
								setLWPercent(50);
								setRWPercent(50);
							}}>
						Reset
					</button>
					<div className="p-0.5 bg-[#005177] rounded-xl"/>
					<div className="bg-white rounded-md shadow-md p-1 flex items-center px-2">
						{ZoomScale}%
					</div>
					<img src={ZoomInSVG}
						 className="w-10 cursor-pointer p-1 rounded-md hover:scale-115
						 			bg-white transition duration-300 ease-in-out shadow-md"
						 onClick={() => {

							if (ZoomScale < 200){
								setZoomScale((ZoomScale) => ZoomScale += 5);
							}
						 }}>
					</img>
					<img src={ZoomOutSVG}
						 className="w-10 cursor-pointer p-1 rounded-md hover:scale-115
						 			bg-white transition duration-300 ease-in-out shadow-md"
						 onClick={() => {
							
							if (ZoomScale > 5){
								setZoomScale((ZoomScale) => ZoomScale -= 5);
							}
						 }}>
					</img>
					<button className="p-2 bg-white rounded-md hover:scale-115
						 			   transition duration-300 ease-in-out cursor-pointer
									   hover:text-[#005177] shadow-md"
							onClick={() => {
								setZoomScale(100);
							}}>
						Reset
					</button>
					<div className="p-0.5 bg-[#005177] rounded-xl"/>
					<button className="p-2 bg-white rounded-md hover:scale-110 text-[#00A9E0]
						 			   transition duration-300 ease-in-out cursor-pointer
									shadow-md border-1 border-[#00A9E0]"
							onClick={handleDownloadPNG}>
						Download PNG
					</button>
					<button className="p-2 bg-white rounded-md hover:scale-110 text-[#FF0000]
						 			   transition duration-300 ease-in-out cursor-pointer
									   shadow-md border-1 border-[#FF0000]"
							onClick={handleDownloadPDF}>
						Download PDF
					</button>
				</div>

			</div>
			<div className="creation-body-container flex flex-row overflow-hidden h-full bg-gray-200">
				<div className="resume-creation-container"
					 style={{width: `${LWPercent}%`, transition: `width 0.2s ease-in-out`}}>
					<CreationContainer handleChange={handleChange} resumeData={resumeData}
									   LWPercent={LWPercent} selectedAssets={selectedAssets}/>
				</div>
				<div className="p-0.5 bg-[#005177] my-2 rounded-xl shadow-md"/>
				<div className="resume-preview-container flex overflow-scroll justify-center"
					 style={{
						width: `${RWPercent}%`, 
						transition: `width 0.2s ease-in-out`,
						paddingTop: ZoomScale === 200 ?
									'35%'
									:
									(ZoomScale > 100) ? 
									`${ZoomScale % 100 / 3}%`
									:
									`0%`,
						paddingLeft: ZoomScale === 200 ?
						'17%'
						:
						(ZoomScale > 100) ? 
						`${ZoomScale % 100 / 6}%`
						:
						`0%`,
					 }}>
					<PreviewContainer ZoomScale={ZoomScale} resumeData={resumeData} selectedTemplate={selectedTemplate}/>
				</div>
			</div>
		</div>
	)
}

function CreationContainer({handleChange, resumeData, LWPercent, selectedAssets}){

	if (selectedAssets.length == 0) return (
		<div className="filler-container flex w-full h-full font-bold items-center justify-center text-4xl">
			No assets selected
		</div>
	)

	const [selectedCategory, setSelectedCategory] = useState(selectedAssets[0]);

	return (
		<div className={`creation-container p-5 flex flex-col flex-1 h-full
						gap-3
						${LWPercent < 40 ? `flex-col` : `2xl:flex-row`}`}>
			<div className="categories-container bg-[#005177] flex flex-1 flex-col
							overflow-y-scroll overflow-y-hidden gap-2 p-2 rounded-md shadow-md">
				{selectedAssets.map((category) => (
					<div key={category.id} 
						 className={`category-container text-center p-2 rounded shadow-md 
						 			cursor-pointer hover:bg-[#189ab4] hover:scale-105 transition
									duration-200 ease-in-out hover:text-white border-2 border-[#189ab4]
									hover:border-white rounded-md
									${selectedCategory.id == category.id ? 
														  `scale-105 bg-[#189ab4] text-white border-white` 
														  : 
														  `bg-white`}`}
						 onClick={() => setSelectedCategory(category)}>
						<p>{category.category}</p>
					</div>
				))}
			</div>
			<div className="sub-categories-container bg-[#005177] flex flex-5 flex-col h-full rounded-md
							overflow-y-scroll overflow-y-hidden shadow-md p-5">
				<p className="category-title text-white text-3xl text-center">
					{selectedCategory.category}
				</p>
				<div className="p-1 my-2 mb-6 bg-white rounded-2xl shadow-md"/>
				<div className="subcategory-form-container flex flex-col gap-4 w-full bg-gray-200 p-4
								rounded-md shadow-md">
					{selectedCategory.subcategory.map((sub) => (
						<div key={sub.id}>
							<p className="text-xl py-1">
								{sub.name}
							</p>
							<div className="form-container bg-white rounded-sm w-full">
								{sub.type === "textarea" ? (
									<textarea 
										id={sub.id}
										type={sub.type}
										name={sub.name}
										value={resumeData[sub.id] || ''}
										onChange={handleChange}
										className="w-full p-2 border-2 shadow-md rounded-sm border-[#189ab4]">
									</textarea>
									) : (
									<input
										id={sub.id}
										type={sub.type}
										name={sub.name}
										value={resumeData[sub.id] || ''}
										onChange={handleChange}
										className="w-full p-2 border-2 shadow-md rounded-sm border-[#189ab4]">
									</input>
									)
								}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

function PreviewContainer({ZoomScale, resumeData, selectedTemplate}){

	const sortedResumeData = getSortedResumeData(resumeData);

	const PDCategory = sortedResumeData.find(category => category.PD)?.PD;
	const EDCategory = sortedResumeData.find(category => category.ED)?.ED;
	const WECategory = sortedResumeData.find(category => category.WE)?.WE;
	const SKCategory = sortedResumeData.find(category => category.SK)?.SK;
	const PRCategory = sortedResumeData.find(category => category.PR)?.PR;
	const CECategory = sortedResumeData.find(category => category.CE)?.CE;
	const AHCategory = sortedResumeData.find(category => category.AH)?.AH;
	const LICategory = sortedResumeData.find(category => category.LI)?.LI;

	return (
		<div id="fixed-size-resume-master-container"
			 className="w-[794px] h-[1123px] shadow-md
						flex-shrink-0 transition duration-300 ease-in-out overflow-y-hidden
						m-5 p-9 bg-white"
			 style={{transform: `scale(${ZoomScale / 100})`}}>
			{sortedResumeData.length == 0 && (
				<div className="default-message-container text-3xl text-center mt-20 mx-50">
					<b>
						Ready to create your resume?
						<br/>
						<br/>
						Type something to get started!
					</b>
				</div>
			)}
			{PDCategory && displayDefaultPersonalDetails(PDCategory, selectedTemplate)}
			{EDCategory && displayDefaultEducation(EDCategory, selectedTemplate)}
			{WECategory && displayDefaultWorkExperience(WECategory, selectedTemplate)}
			{SKCategory && displayDefaultSkills(SKCategory, selectedTemplate)}
			{PRCategory && displayDefaultProjects(PRCategory, selectedTemplate)}
			{CECategory && displayDefaultCertification(CECategory, selectedTemplate)}
			{AHCategory && displayDefaultAwardsHonors(AHCategory, selectedTemplate)}
			{LICategory && displayDefaultLeadershipInvolvement(LICategory, selectedTemplate)}
		</div>
	)
}

function displayDefaultLeadershipInvolvement(LICategory, selectedTemplate){
	
	let CSS = getLeadershipInvolvementCSS(selectedTemplate);

	return (
		<div className={`"leadership-involvement-container" ${CSS[0]}`}>
			<p className={`${CSS[1]}`}>
				<b>
					LEADERSHIP & INVOLVEMENT
				</b>
			</p>
			<div className={`"leadership-involvement-name-role-date-container" ${CSS[2]}`}>
				<b><p className="leadership-involvement-name-container">
					{LICategory.find(item => Object.keys(item)[0] === "LI-OR-2") ?
					Object.values(LICategory.find(item => Object.keys(item)[0] === "LI-OR-2"))
					:
					"Organization Name"}
				</p></b>
				<p className="leadership-involvement-role-container">
					{LICategory.find(item => Object.keys(item)[0] === "LI-RO-1") ?
					", " + Object.values(LICategory.find(item => Object.keys(item)[0] === "LI-RO-1"))
					:
					", Role"}
				</p>
				<p className={`"leadership-involvement-date-container" ${CSS[3]}`}>
					{LICategory.find(item => Object.keys(item)[0] === "LI-SD-3") ?
					Object.values(LICategory.find(item => Object.keys(item)[0] === "LI-SD-3"))
					:
					"Start Date"}
					{LICategory.find(item => Object.keys(item)[0] === "LI-ED-4") ?
					" - " + Object.values(LICategory.find(item => Object.keys(item)[0] === "LI-ED-4"))
					:
					" - End Date"}
				</p>
			</div>
			<div className={`"leadership-involvement-description-container" ${CSS[4]}`}>
				<p>
					{LICategory.find(item => Object.keys(item)[0] === "LI-DE-5") ?
					Object.values(LICategory.find(item => Object.keys(item)[0] === "LI-DE-5"))
					:
					"Description"}
				</p>
			</div>
		</div>
	)
}

function displayDefaultAwardsHonors(AHCategory, selectedTemplate){

	let CSS = getAwardsHonorsCSS(selectedTemplate);

	return (
		<div className={`"awards-honors-container" ${CSS[0]}`}>
			<p className={`${CSS[1]}`}>
				<b>
					HONORS & AWARDS
				</b>
			</p>
			<div className={`"awards-honors-name-date-container" ${CSS[2]}`}>
				<b><p className="awards-honors-name-container">
					{AHCategory.find(item => Object.keys(item)[0] === "AH-TI-1") ?
					Object.values(AHCategory.find(item => Object.keys(item)[0] === "AH-TI-1"))
					:
					"Award or Honor Name"}
				</p></b>
				<p className="awards-honors-organization-name-container">
					{AHCategory.find(item => Object.keys(item)[0] === "AH-OR-2") ?
					", " + Object.values(AHCategory.find(item => Object.keys(item)[0] === "AH-OR-2"))
					:
					", Organization"}
				</p>
				<p className={`"awards-honors-date-container" ${CSS[3]}`}>
					{AHCategory.find(item => Object.keys(item)[0] === "AH-DR-3") ?
					Object.values(AHCategory.find(item => Object.keys(item)[0] === "AH-DR-3"))
					:
					"Date Received"}
				</p>
			</div>
			<div className={`"awards-honors-description-container" ${CSS[4]}`}>
				<p>
					{AHCategory.find(item => Object.keys(item)[0] === "AH-DE-4") ?
					Object.values(AHCategory.find(item => Object.keys(item)[0] === "AH-DE-4"))
					:
					"Description"}
				</p>
			</div>
		</div>
	)

}

function displayDefaultCertification(CECategory, selectedTemplate){

	let CSS = getCertificationsCSS(selectedTemplate);

	return (
		<div className={`"certification-container" ${CSS[0]}`}>
			<p className={`${CSS[1]}`}>
				<b>
					CERTIFICATIONS
				</b>
			</p>
			<div className={`"certification-name-date-container" ${CSS[2]}`}>
				<b><p className="certification-name-container">
					{CECategory.find(item => Object.keys(item)[0] === "CE-NM-1") ?
					Object.values(CECategory.find(item => Object.keys(item)[0] === "CE-NM-1"))
					:
					"Certificate Name"}
				</p></b>
				<p className={`"certification-date-container" ${CSS[3]}`}>
					{CECategory.find(item => Object.keys(item)[0] === "CE-ID-3") ?
					Object.values(CECategory.find(item => Object.keys(item)[0] === "CE-ID-3"))
					:
					"Issue Date"}
					{CECategory.find(item => Object.keys(item)[0] === "CE-ED-4") ?
					" - " + Object.values(CECategory.find(item => Object.keys(item)[0] === "CE-ED-4"))
					:
					" - Expiry Date"}
				</p>
			</div>
			<div className={`"issue-org-credential-id-container" ${CSS[4]}`}>
				<p className="issue-org-container">
					{CECategory.find(item => Object.keys(item)[0] === "CE-OR-2") ?
					Object.values(CECategory.find(item => Object.keys(item)[0] === "CE-OR-2"))
					:
					"Issuing Organization"}
				</p>
				<p className="cred-id-container">
					{CECategory.find(item => Object.keys(item)[0] === "CE-CI-5") ?
					", ID: " + Object.values(CECategory.find(item => Object.keys(item)[0] === "CE-CI-5"))
					:
					", ID: Credential ID"}
				</p>
			</div>
			<div className={`"certification-url-container" ${CSS[5]}`}>
				<i><p>
					{CECategory.find(item => Object.keys(item)[0] === "CE-CU-6") ?
					Object.values(CECategory.find(item => Object.keys(item)[0] === "CE-CU-6"))
					:
					"Credential URL"}
				</p></i>
			</div>
		</div>
	)
}

function displayDefaultProjects(PRCategory, selectedTemplate){

	let CSS = getProjectsCSS(selectedTemplate);

	return (
		<div className={`"project-container" ${CSS[0]}`}>
			<p className={`${CSS[1]}`}>
				<b>
					PROJECTS
				</b>
			</p>
			<div className={`"project-name-date-container" ${CSS[2]}`}>
				<b><p className="project-name-container">
					{PRCategory.find(item => Object.keys(item)[0] === "PR-NM-1") ?
					Object.values(PRCategory.find(item => Object.keys(item)[0] === "PR-NM-1"))
					:
					"Project Name"}
				</p></b>
				<p className={`"project-date-container" ${CSS[3]}`}>
					{PRCategory.find(item => Object.keys(item)[0] === "PR-SD-4") ?
					Object.values(PRCategory.find(item => Object.keys(item)[0] === "PR-SD-4"))
					:
					"Start Date"}
					{PRCategory.find(item => Object.keys(item)[0] === "PR-ED-5") ?
					" - " + Object.values(PRCategory.find(item => Object.keys(item)[0] === "PR-ED-5"))
					:
					" - End Date"}
				</p>
			</div>
			<div className={`"project-link-container" ${CSS[4]}`}>
				<i><p>
					{PRCategory.find(item => Object.keys(item)[0] === "PR-LK-6") ?
					Object.values(PRCategory.find(item => Object.keys(item)[0] === "PR-LK-6"))
					:
					"Project Link"}
				</p></i>
			</div>
			<div className={`"project-tools-description-container" ${CSS[5]}`}>
				<p className="project-tools-container">
					{PRCategory.find(item => Object.keys(item)[0] === "PR-TU-3") ?
					"    •   " + Object.values(PRCategory.find(item => Object.keys(item)[0] === "PR-TU-3"))
					:
					"    •   Tech used"}
				</p>
				<p className="project-description-container">
					{PRCategory.find(item => Object.keys(item)[0] === "PR-DS-2") ?
					Object.values(PRCategory.find(item => Object.keys(item)[0] === "PR-DS-2"))
					:
					"Description"}
				</p>
			</div>
		</div>
	)
}

function displayDefaultSkills(SKCategory, selectedTemplate){

	let CSS = getSkillsCSS(selectedTemplate);

	return (
		<div className={`"skill-container" ${CSS[0]}`}>
			<p className={`${CSS[1]}`}>
				<b>
					SKILLS
				</b>
			</p>
			<div className={`"tech-soft-lang-tool-container" ${CSS[2]}`}>
				<p className="technical-skill-container">
					{SKCategory.find(item => Object.keys(item)[0] === "SK-TS-1") ?
					"    •   " + Object.values(SKCategory.find(item => Object.keys(item)[0] === "SK-TS-1"))
					:
					"    •   Your Technical Skills"}
				</p>
				<p className="soft-skill-container">
					{SKCategory.find(item => Object.keys(item)[0] === "SK-SS-2") ?
					"    •   " + Object.values(SKCategory.find(item => Object.keys(item)[0] === "SK-SS-2"))
					:
					"    •   Your Soft Skills"}
				</p>
				<p className="language-container">
					{SKCategory.find(item => Object.keys(item)[0] === "SK-LA-3") ?
					"    •   " + Object.values(SKCategory.find(item => Object.keys(item)[0] === "SK-LA-3"))
					:
					"    •   Your Language Skills"}
				</p>
				<p className="tool-technologies-container">
					{SKCategory.find(item => Object.keys(item)[0] === "SK-TT-4") ?
					"    •   " + Object.values(SKCategory.find(item => Object.keys(item)[0] === "SK-TT-4"))
					:
					"    •   Your Tools & Technologies Skills"}
				</p>
			</div>
		</div>
	)
}

function displayDefaultWorkExperience(WECategory, selectedTemplate){

	let CSS = getWorkExperienceCSS(selectedTemplate);

	return (
		<div className={`"work-container" ${CSS[0]}`}>
			<p className={`${CSS[1]}`}>
				<b>
					WORK EXPERIENCE
				</b>
			</p>
			<div className={`"company-name-container" ${CSS[2]}`}>
				<b><p className="university-container">
					{WECategory.find(item => Object.keys(item)[0] === "WE-CN-2") ?
					Object.values(WECategory.find(item => Object.keys(item)[0] === "WE-CN-2"))
					:
					"Company or Organization Name"}
				</p></b>
				<p className={`"company-date-container" ${CSS[3]}`}>
					{WECategory.find(item => Object.keys(item)[0] === "WE-SD-4") ?
					Object.values(WECategory.find(item => Object.keys(item)[0] === "WE-SD-4"))
					:
					"Start Date"}
					{WECategory.find(item => Object.keys(item)[0] === "WE-ED-5") ?
					" - " + Object.values(WECategory.find(item => Object.keys(item)[0] === "WE-ED-5"))
					:
					" - End Date"}
				</p>
			</div>
			<div className={`"job-role-location-container" ${CSS[4]}`}>
				<i><p className="work-role-title-container">
					{WECategory.find(item => Object.keys(item)[0] === "WE-JT-1") ?
					Object.values(WECategory.find(item => Object.keys(item)[0] === "WE-JT-1"))
					:
					"Role or Title"}
				</p></i>
				<p className={`"work-location-container" ${CSS[5]}`}>
					{WECategory.find(item => Object.keys(item)[0] === "WE-LO-3") ?
					Object.values(WECategory.find(item => Object.keys(item)[0] === "WE-LO-3"))
					:
					"Location"}
				</p>
			</div>
			<div className={`"description-container" ${CSS[6]}`}>
				<p className="work-description-container">
					{WECategory.find(item => Object.keys(item)[0] === "WE-DS-6") ?
					Object.values(WECategory.find(item => Object.keys(item)[0] === "WE-DS-6"))
					:
					"Description\n          Tip: Have partial sentences describing a task + transferable skills + results/scope/impact"}
				</p>
			</div>
		</div>
	)
}

function displayDefaultEducation(EDCategory, selectedTemplate){

	let CSS = getEducationCSS(selectedTemplate);

	return (
		<div className={`"education-container" ${CSS[0]}`}>
			<p className={`${CSS[1]}`}>
				<b>
					EDUCATION
				</b>
			</p>
			<div className={`"university-date-container" ${CSS[2]}`}>
				<b><p className="university-container">
					{EDCategory.find(item => Object.keys(item)[0] === "ED-SN-1") ?
					Object.values(EDCategory.find(item => Object.keys(item)[0] === "ED-SN-1"))
					:
					"University"}
				</p></b>
				<p className={`"university-date-container" ${CSS[3]}`}>
					{EDCategory.find(item => Object.keys(item)[0] === "ED-SD-4") ?
					Object.values(EDCategory.find(item => Object.keys(item)[0] === "ED-SD-4"))
					:
					"Start Date"}
					{EDCategory.find(item => Object.keys(item)[0] === "ED-ED-5") ?
					" - " + Object.values(EDCategory.find(item => Object.keys(item)[0] === "ED-ED-5"))
					:
					" - End Date"}
				</p>
			</div>
			<div className={`"degree-fos-gpa-location-container" ${CSS[4]}`}>
				<p className="degree-container">
					{EDCategory.find(item => Object.keys(item)[0] === "ED-DE-2") ?
					Object.values(EDCategory.find(item => Object.keys(item)[0] === "ED-DE-2"))
					:
					"Degree"}
				</p>
				<p className="fos-container">
					{EDCategory.find(item => Object.keys(item)[0] === "ED-FS-3") ?
					", " + Object.values(EDCategory.find(item => Object.keys(item)[0] === "ED-FS-3"))
					:
					", Field of Study"}
				</p>
				<p className="gpa-container">
					{EDCategory.find(item => Object.keys(item)[0] === "ED-GP-6") ?
					", (GPA: " + Object.values(EDCategory.find(item => Object.keys(item)[0] === "ED-GP-6")) + ")"
					:
					", (GPA)"}
				</p>
				<p className={`"university-date-container" ${CSS[5]}`}>
					{EDCategory.find(item => Object.keys(item)[0] === "ED-LO-7") ?
					Object.values(EDCategory.find(item => Object.keys(item)[0] === "ED-LO-7"))
					:
					"Location"}
				</p>
			</div>
		</div>
	)
}

function displayDefaultPersonalDetails(PDCategory, selectedTemplate){

	let CSS = getPersonalDetailsCSS(selectedTemplate);

	return (
		<div className={`"personal-details-container" ${CSS[0]}`}>
			<p className={`"first-last-name-container" ${CSS[1]}`}>
				<b>
				{PDCategory.find(item => Object.keys(item)[0] === "PD-FN-1") ?
				Object.values(PDCategory.find(item => Object.keys(item)[0] === "PD-FN-1"))
				:
				"(First Name)"}
				<span className="px-1"/>
				{PDCategory.find(item => Object.keys(item)[0] === "PD-LN-2") ?
				Object.values(PDCategory.find(item => Object.keys(item)[0] === "PD-LN-2"))
				:
				"(Last Name)"}
				</b>
			</p>
			<div className={`"email-phone-address-linkedin-website-container" ${CSS[2]}`}>
				<p className="email-container">
					{PDCategory.find(item => Object.keys(item)[0] === "PD-EM-3") ?
					Object.values(PDCategory.find(item => Object.keys(item)[0] === "PD-EM-3"))
					:
					"Email"}
				</p>
				<p className="phone-container">
					{PDCategory.find(item => Object.keys(item)[0] === "PD-PN-4") ?
					" | " + Object.values(PDCategory.find(item => Object.keys(item)[0] === "PD-PN-4"))
					:
					" | Phone"}
				</p>
				<p className="address-container">
					{PDCategory.find(item => Object.keys(item)[0] === "PD-AD-5") ?
					" | " + Object.values(PDCategory.find(item => Object.keys(item)[0] === "PD-AD-5"))
					:
					" | Address"}
				</p>
				<p className="linkedin-container">
					{PDCategory.find(item => Object.keys(item)[0] === "PD-LI-6") ?
					" | " + Object.values(PDCategory.find(item => Object.keys(item)[0] === "PD-LI-6"))
					:
					" | LinkedIn"}
				</p>
				<p className="website-container">
					{PDCategory.find(item => Object.keys(item)[0] === "PD-WE-7") ?
					" | " + Object.values(PDCategory.find(item => Object.keys(item)[0] === "PD-WE-7"))
					:
					" | Website"}
				</p>
			</div>
			<div className={`${CSS[3]}`}/>
		</div>
	)
}

function getSortedResumeData(resumeData){

	if (Object.keys(resumeData).length === 0) return [];

	const categoryPriority = ["PD", 'ED', 'WE', 'SK', 'PR', 'CE', 'AH', 'LI'];
	const categorizedData = {};

	Object.entries(resumeData).forEach(([key, value]) => {

		const category = key.slice(0, 2);
		if (!categorizedData[category]){
			categorizedData[category] = [];
		}
		categorizedData[category].push({[key]: value});
	});
	// console.log(categorizedData);

	Object.keys(categorizedData).forEach(category => {

		categorizedData[category].sort((a, b) => {

			const orderA = parseInt(Object.keys(a)[0].split('-').pop(), 10);
			const orderB = parseInt(Object.keys(b)[0].split('-').pop(), 10);
			return orderA - orderB;
		});
	});

	const sortedData = [];

	categoryPriority.forEach(priorityKey => {

		if (categorizedData[priorityKey]){

			sortedData.push({[priorityKey]: categorizedData[priorityKey]});
		}
	});
	// console.log(sortedData);
	return sortedData;
}

function Header() {

	let navigation = useNavigate();

	return (
		<div className="landing-header-container p-4 bg-[#189ab4] mt-0 flex w-full shadow-md items-center
						top-0 left-0 right-0 z-50 flex-col lg:flex-row">
			<div className="image-logo-container hover:scale-110 duration-200 transition ease-in-out cursor-pointer">
				<img className="w-[40px] h-[60px]" src={RRLogo} alt="RRLogo"
						onClick={() => navigation('/')}></img>
			</div>
			<div className="navigation-button-container flex flex-col lg:flex-row flex-wrap justify-end gap-5 text-xl text-white 
							p-4 flex-1 items-center">
				<button className="subcriptions-btn cursor-pointer hover:text-[#189ab4] transition duration-300
									ease-in-out hover:bg-white p-2 rounded hover:scale-110 shadow-md border-gray-100 
									border-1"
						/**
						 * TOCHANGE
						 */
						onClick={() => navigation('/')}>
					Temp Nav
				</button>
				<img src={LogoutSVG}
						className="logout-btn h-11 transition duration-300 ease-in-out hover:scale-110 cursor-pointer
								hover:bg-[#f54254] rounded p-1"
						onClick={() => navigation('/')}
				/>
			</div>
		</div>
	);
}

function getNewResumeID(resumeSaveData){

	return `resume-${resumeSaveData.userid}-${getCurrentDateTime()}`
}

function getCurrentDateTime() {

	const date = new Date();

	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	const hours = String(date.getHours()).padStart(2, '0');
	const minutes = String(date.getMinutes()).padStart(2, '0');
	const seconds = String(date.getSeconds()).padStart(2, '0');

	return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

function getPrettyCurrentDateTime(){

	const date = new Date();

	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	const hours = String(date.getHours()).padStart(2, '0');
	const minutes = String(date.getMinutes()).padStart(2, '0');
	const seconds = String(date.getSeconds()).padStart(2, '0');

	return `${month}/${day}/${year} - ${hours}:${minutes}:${seconds}`;
}

function getPersonalDetailsCSS(template){
	
	let CSS = [];

	if (template == "basic"){

		CSS[0] = `flex whitespace-nowrap overflow-hidden
					flex-col items-center p-2 flex-wrap w-full`;
		CSS[1] = `text-2xl text-[#005177]`;
		CSS[2] = `flex w-full flex-wrap flex-row text-md justify-center
					whitespace-pre`;
		CSS[3] = `p-[1px] bg-black w-full rounded-3xl mt-2`;
		return CSS;
	}
	else if (template == "arts"){

		CSS[0] = `flex whitespace-nowrap overflow-hidden
					flex-col items-center p-2 flex-wrap w-full`;
		CSS[1] = `text-2xl text-[#5b008f]`;
		CSS[2] = `flex w-full flex-wrap flex-row text-md justify-center
					whitespace-pre`;
		CSS[3] = `p-[1px] bg-black w-full rounded-3xl mt-2`;
		return CSS;
	}
	else if (template == "communications"){

		CSS[0] = `flex whitespace-nowrap overflow-hidden
					flex-col p-2 flex-wrap w-full`;
		CSS[1] = `text-2xl text-[#2A9D8F]`;
		CSS[2] = `flex w-full flex-wrap flex-row text-md whitespace-pre`;
		CSS[3] = ``;
		return CSS;
	}
	else if (template == "computation"){

		CSS[0] = `flex whitespace-nowrap overflow-hidden
					flex-col items-center p-2 flex-wrap w-full`;
		CSS[1] = `text-2xl text-[#00A8FF]`;
		CSS[2] = `flex w-full flex-wrap flex-row text-md justify-center
					whitespace-pre`;
		CSS[3] = `p-[1px] bg-[#00A8FF] w-full rounded-3xl mt-2`;
		return CSS;
	}
	else if (template == "humanities"){

		CSS[0] = `flex whitespace-nowrap overflow-hidden
					flex-col items-center p-2 flex-wrap w-full`;
		CSS[1] = `text-2xl text-[#800020]`;
		CSS[2] = `flex w-full flex-wrap flex-row text-md justify-center
					whitespace-pre`;
		CSS[3] = `p-[1px] bg-[#800020] w-full rounded-3xl mt-2`;
		return CSS;
	}
	else if (template == "mathematics"){

		CSS[0] = `flex whitespace-nowrap overflow-hidden
					flex-col p-2 flex-wrap w-full`;
		CSS[1] = `text-2xl text-[#2A6F6F]`;
		CSS[2] = `flex w-full flex-wrap flex-row text-md whitespace-pre`;
		CSS[3] = `p-[1px] bg-[#2A6F6F] w-full rounded-3xl mt-2`;
		return CSS;
	}
	else if (template == "science"){

		CSS[0] = `flex whitespace-nowrap overflow-hidden
					flex-col items-center p-2 flex-wrap w-full`;
		CSS[1] = `text-2xl text-[#2C6B45]`;
		CSS[2] = `flex w-full flex-wrap flex-row text-md justify-center
					whitespace-pre`;
		CSS[3] = ``;
		return CSS;
	}
	else if (template == "socialscience"){

		CSS[0] = `flex whitespace-nowrap overflow-hidden
					flex-col items-end p-2 flex-wrap w-full`;
		CSS[1] = `text-2xl text-[#E27D60]`;
		CSS[2] = `flex w-full flex-wrap flex-row text-md justify-end
					whitespace-pre`;
		CSS[3] = ``;
		return CSS;
	}
	else {

		CSS[0] = `flex whitespace-nowrap overflow-hidden
					flex-col items-center p-2 flex-wrap w-full`;
		CSS[1] = `text-2xl text-[#005177]`;
		CSS[2] = `flex w-full flex-wrap flex-row text-md justify-center
					whitespace-pre`;
		CSS[3] = `p-[1px] bg-black w-full rounded-3xl mt-2`;
		return CSS;
	}
}

function getEducationCSS(template){

	let CSS = [];

	if (template == "basic"){

		CSS[0] = `flex whitespace-nowrap overflow-hidden
					flex-col items-center p-2 flex-wrap w-full`;
		CSS[1] = `mr-auto text-[#005177]`;
		CSS[2] = `flex flex-row w-full`;
		CSS[3] = `ml-auto`;
		CSS[4] = `flex flex-row w-full`;
		CSS[5] = `ml-auto`;
		return CSS;
	}
	else if (template == "arts"){

		CSS[0] = `flex whitespace-nowrap overflow-hidden
					flex-col items-center p-2 flex-wrap w-full`;
		CSS[1] = `mr-auto bg-[#5b008f] text-white w-full px-2 pb-[7px]`;
		CSS[2] = `flex flex-row w-full px-1`;
		CSS[3] = `ml-auto`;
		CSS[4] = `flex flex-row w-full px-1`;
		CSS[5] = `ml-auto`;
		return CSS;
	}
	else if (template == "communications"){

		CSS[0] = `flex whitespace-nowrap overflow-hidden
					flex-col items-center p-2 flex-wrap w-full`;
		CSS[1] = `mr-auto text-[#2A9D8F] w-full border-b-2 border-[#2A9D8F] border-rounded-xl pb-[4px]`;
		CSS[2] = `flex flex-row w-full`;
		CSS[3] = `ml-auto`;
		CSS[4] = `flex flex-row w-full`;
		CSS[5] = `ml-auto`;
		return CSS;
	}
	else if (template == "computation"){

		CSS[0] = `flex whitespace-nowrap overflow-hidden
					flex-col items-center p-2 flex-wrap w-full`;
		CSS[1] = `mr-auto text-[#00A8FF] border-b-2 border-[#00A8FF] border-rounded-xl pb-[4px]`;
		CSS[2] = `flex flex-row w-full`;
		CSS[3] = `ml-auto`;
		CSS[4] = `flex flex-row w-full`;
		CSS[5] = `ml-auto`;
		return CSS;
	}
	else if (template == "humanities"){

		CSS[0] = `flex whitespace-nowrap overflow-hidden
					flex-col items-center p-2 flex-wrap w-full`;
		CSS[1] = `mr-auto text-[#800020] border-b-2 border-[#800020] border-rounded-xl pb-[4px]`;
		CSS[2] = `flex flex-row w-full`;
		CSS[3] = `ml-auto`;
		CSS[4] = `flex flex-row w-full`;
		CSS[5] = `ml-auto`;
		return CSS;
	}
	else if (template == "mathematics"){

		CSS[0] = `flex whitespace-nowrap overflow-hidden
					flex-col items-center p-2 flex-wrap w-full`;
		CSS[1] = `mr-auto text-[#2A6F6F] border-b-2 border-[#2A6F6F] border-rounded-xl pb-[4px]`;
		CSS[2] = `flex flex-row w-full`;
		CSS[3] = `ml-auto`;
		CSS[4] = `flex flex-row w-full`;
		CSS[5] = `ml-auto`;
		return CSS;
	}
	else if (template == "science"){

		CSS[0] = `flex whitespace-nowrap overflow-hidden
					flex-col items-center p-2 flex-wrap w-full`;
		CSS[1] = `mr-auto text-[#2C6B45] border-b-2 border-[#2C6B45] border-rounded-xl pb-[4px]`;
		CSS[2] = `flex flex-row w-full`;
		CSS[3] = `ml-auto`;
		CSS[4] = `flex flex-row w-full`;
		CSS[5] = `ml-auto`;
		return CSS;
	}
	else if (template == "socialscience"){

		CSS[0] = `flex whitespace-nowrap overflow-hidden
					flex-col items-center p-2 flex-wrap w-full`;
		CSS[1] = `mr-auto text-[#E27D60] w-full border-b-2 border-[#E27D60] border-rounded-xl pb-[4px]`;
		CSS[2] = `flex flex-row w-full`;
		CSS[3] = `ml-auto`;
		CSS[4] = `flex flex-row w-full`;
		CSS[5] = `ml-auto`;
		return CSS;
	}
	else {

		CSS[0] = `flex whitespace-nowrap overflow-hidden
					flex-col items-center p-2 flex-wrap w-full`;
		CSS[1] = `mr-auto text-[#005177]`;
		CSS[2] = `flex flex-row w-full`;
		CSS[3] = `ml-auto`;
		CSS[4] = `flex flex-row w-full`;
		CSS[5] = `ml-auto`;
		return CSS;
	}
}

function getWorkExperienceCSS(template){

	let CSS = [];

	if (template == "basic"){

		CSS[0] = `flex whitespace-nowrap overflow-hidden
					flex-col items-center p-2 flex-wrap w-full`;
		CSS[1] = `mr-auto text-[#005177]`;
		CSS[2] = `flex flex-row w-full`;
		CSS[3] = `ml-auto`;
		CSS[4] = `flex flex-row w-full`;
		CSS[5] = `ml-auto`;
		CSS[6] = `flex w-full whitespace-pre`;
		return CSS;
	}
	else if (template == "arts"){

		CSS[0] = `flex whitespace-nowrap overflow-hidden
					flex-col items-center p-2 flex-wrap w-full`;
		CSS[1] = `mr-auto bg-[#5b008f] text-white w-full px-2 pb-[7px]`;
		CSS[2] = `flex flex-row w-full px-1`;
		CSS[3] = `ml-auto`;
		CSS[4] = `flex flex-row w-full px-1`;
		CSS[5] = `ml-auto`;
		CSS[6] = `flex w-full whitespace-pre px-1`;
		return CSS;
	}
	else if (template == "communications"){

		CSS[0] = `flex whitespace-nowrap overflow-hidden
					flex-col items-center p-2 flex-wrap w-full`;
		CSS[1] = `mr-auto text-[#2A9D8F] w-full border-b-2 border-[#2A9D8F] border-rounded-xl pb-[4px]`;
		CSS[2] = `flex flex-row w-full`;
		CSS[3] = `ml-auto`;
		CSS[4] = `flex flex-row w-full`;
		CSS[5] = `ml-auto`;
		CSS[6] = `flex w-full whitespace-pre`;
		return CSS;
	}
	else if (template == "computation"){

		CSS[0] = `flex whitespace-nowrap overflow-hidden
					flex-col items-center p-2 flex-wrap w-full`;
		CSS[1] = `mr-auto text-[#00A8FF] border-b-2 border-[#00A8FF] border-rounded-xl pb-[4px]`;
		CSS[2] = `flex flex-row w-full`;
		CSS[3] = `ml-auto`;
		CSS[4] = `flex flex-row w-full`;
		CSS[5] = `ml-auto`;
		CSS[6] = `flex w-full whitespace-pre`;
		return CSS;
	}
	else if (template == "humanities"){

		CSS[0] = `flex whitespace-nowrap overflow-hidden
					flex-col items-center p-2 flex-wrap w-full`;
		CSS[1] = `mr-auto text-[#800020] border-b-2 border-[#800020] border-rounded-xl pb-[4px]`;
		CSS[2] = `flex flex-row w-full`;
		CSS[3] = `ml-auto`;
		CSS[4] = `flex flex-row w-full`;
		CSS[5] = `ml-auto`;
		CSS[6] = `flex w-full whitespace-pre`;
		return CSS;
	}
	else if (template == "mathematics"){

		CSS[0] = `flex whitespace-nowrap overflow-hidden
					flex-col items-center p-2 flex-wrap w-full`;
		CSS[1] = `mr-auto text-[#2A6F6F] border-b-2 border-[#2A6F6F] border-rounded-xl pb-[4px]`;
		CSS[2] = `flex flex-row w-full`;
		CSS[3] = `ml-auto`;
		CSS[4] = `flex flex-row w-full`;
		CSS[5] = `ml-auto`;
		CSS[6] = `flex w-full whitespace-pre`;
		return CSS;
	}
	else if (template == "science"){

		CSS[0] = `flex whitespace-nowrap overflow-hidden
					flex-col items-center p-2 flex-wrap w-full`;
		CSS[1] = `mr-auto text-[#2C6B45] border-b-2 border-[#2C6B45] border-rounded-xl pb-[4px]`;
		CSS[2] = `flex flex-row w-full`;
		CSS[3] = `ml-auto`;
		CSS[4] = `flex flex-row w-full`;
		CSS[5] = `ml-auto`;
		CSS[6] = `flex w-full whitespace-pre`;
		return CSS;
	}
	else if (template == "socialscience"){

		CSS[0] = `flex whitespace-nowrap overflow-hidden
					flex-col items-center p-2 flex-wrap w-full`;
		CSS[1] = `mr-auto text-[#E27D60] w-full border-b-2 border-[#E27D60] border-rounded-xl pb-[4px]`;
		CSS[2] = `flex flex-row w-full`;
		CSS[3] = `ml-auto`;
		CSS[4] = `flex flex-row w-full`;
		CSS[5] = `ml-auto`;
		CSS[6] = `flex w-full whitespace-pre`;
		return CSS;
	}
	else {

		CSS[0] = `flex whitespace-nowrap overflow-hidden
					flex-col items-center p-2 flex-wrap w-full`;
		CSS[1] = `mr-auto text-[#005177]`;
		CSS[2] = `flex flex-row w-full`;
		CSS[3] = `ml-auto`;
		CSS[4] = `flex flex-row w-full`;
		CSS[5] = `ml-auto`;
		CSS[6] = `flex w-full whitespace-pre`;
		return CSS;
	}
}

function getSkillsCSS(template){

	let CSS = [];

	if (template == "basic"){

		CSS[0] = `flex whitespace-nowrap overflow-hidden
					flex-col items-center p-2 flex-wrap w-full`;
		CSS[1] = `mr-auto text-[#005177]`;
		CSS[2] = `flex flex-col w-full whitespace-pre`;
		return CSS;
	}
	else if (template == "arts"){

		CSS[0] = `flex whitespace-nowrap overflow-hidden
					flex-col items-center p-2 flex-wrap w-full`;
		CSS[1] = `mr-auto bg-[#5b008f] text-white w-full px-2 pb-[7px]`;
		CSS[2] = `flex flex-col w-full whitespace-pre`;
		return CSS;
	}
	else if (template == "communications"){

		CSS[0] = `flex whitespace-nowrap overflow-hidden
					flex-col items-center p-2 flex-wrap w-full`;
		CSS[1] = `mr-auto text-[#2A9D8F] w-full border-b-2 border-[#2A9D8F] border-rounded-xl pb-[4px]`;
		CSS[2] = `flex flex-col w-full whitespace-pre`;
		return CSS;
	}
	else if (template == "computation"){
		
		CSS[0] = `flex whitespace-nowrap overflow-hidden
					flex-col items-center p-2 flex-wrap w-full`;
		CSS[1] = `mr-auto text-[#00A8FF] border-b-2 border-[#00A8FF] border-rounded-xl pb-[4px]`;
		CSS[2] = `flex flex-col w-full whitespace-pre`;
		return CSS;
	}
	else if (template == "humanities"){

		CSS[0] = `flex whitespace-nowrap overflow-hidden
					flex-col items-center p-2 flex-wrap w-full`;
		CSS[1] = `mr-auto text-[#800020] border-b-2 border-[#800020] border-rounded-xl pb-[4px]`;
		CSS[2] = `flex flex-col w-full whitespace-pre`;
		return CSS;
	}
	else if (template == "mathematics"){

		CSS[0] = `flex whitespace-nowrap overflow-hidden
					flex-col items-center p-2 flex-wrap w-full`;
		CSS[1] = `mr-auto text-[#2A6F6F] border-b-2 border-[#2A6F6F] border-rounded-xl pb-[4px]`;
		CSS[2] = `flex flex-col w-full whitespace-pre`;
		return CSS;
	}
	else if (template == "science"){

		CSS[0] = `flex whitespace-nowrap overflow-hidden
					flex-col items-center p-2 flex-wrap w-full`;
		CSS[1] = `mr-auto text-[#2C6B45] border-b-2 border-[#2C6B45] border-rounded-xl pb-[4px]`;
		CSS[2] = `flex flex-col w-full whitespace-pre`;
		return CSS;
	}
	else if (template == "socialscience"){

		CSS[0] = `flex whitespace-nowrap overflow-hidden
					flex-col items-center p-2 flex-wrap w-full`;
		CSS[1] = `mr-auto text-[#E27D60] w-full border-b-2 border-[#E27D60] border-rounded-xl pb-[4px]`;
		CSS[2] = `flex flex-col w-full whitespace-pre`;
		return CSS;
	}
	else {

		CSS[0] = `flex whitespace-nowrap overflow-hidden
					flex-col items-center p-2 flex-wrap w-full`;
		CSS[1] = `mr-auto text-[#005177]`;
		CSS[2] = `flex flex-col w-full whitespace-pre`;
		return CSS;
	}
}

function getProjectsCSS(template){

	let CSS = [];

	if (template == "basic"){

		CSS[0] = `flex whitespace-nowrap overflow-hidden
					flex-col items-center p-2 flex-wrap w-full`;
		CSS[1] = `mr-auto text-[#005177]`;
		CSS[2] = `flex flex-row w-full`;
		CSS[3] = `ml-auto`;
		CSS[4] = `flex flex-row w-full`;
		CSS[5] = `flex flex-col w-full whitespace-pre`;
		return CSS;
	}
	else if (template == "arts"){

		CSS[0] = `flex whitespace-nowrap overflow-hidden
					flex-col items-center p-2 flex-wrap w-full`;
		CSS[1] = `mr-auto bg-[#5b008f] text-white w-full px-2 pb-[7px]`;
		CSS[2] = `flex flex-row w-full px-1`;
		CSS[3] = `ml-auto`;
		CSS[4] = `flex flex-row w-full px-1`;
		CSS[5] = `flex flex-col w-full whitespace-pre px-1`;
		return CSS;
	}
	else if (template == "communications"){

		CSS[0] = `flex whitespace-nowrap overflow-hidden
					flex-col items-center p-2 flex-wrap w-full`;
		CSS[1] = `mr-auto text-[#2A9D8F] w-full border-b-2 border-[#2A9D8F] border-rounded-xl pb-[4px]`;
		CSS[2] = `flex flex-row w-full`;
		CSS[3] = `ml-auto`;
		CSS[4] = `flex flex-row w-full`;
		CSS[5] = `flex flex-col w-full whitespace-pre`;
		return CSS;
	}
	else if (template == "computation"){

		CSS[0] = `flex whitespace-nowrap overflow-hidden
					flex-col items-center p-2 flex-wrap w-full`;
		CSS[1] = `mr-auto text-[#00A8FF] border-b-2 border-[#00A8FF] border-rounded-xl pb-[4px]`;
		CSS[2] = `flex flex-row w-full`;
		CSS[3] = `ml-auto`;
		CSS[4] = `flex flex-row w-full`;
		CSS[5] = `flex flex-col w-full whitespace-pre`;
		return CSS;
	}
	else if (template == "humanities"){

		CSS[0] = `flex whitespace-nowrap overflow-hidden
					flex-col items-center p-2 flex-wrap w-full`;
		CSS[1] = `mr-auto text-[#800020] border-b-2 border-[#800020] border-rounded-xl pb-[4px]`;
		CSS[2] = `flex flex-row w-full`;
		CSS[3] = `ml-auto`;
		CSS[4] = `flex flex-row w-full`;
		CSS[5] = `flex flex-col w-full whitespace-pre`;
		return CSS;
	}
	else if (template == "mathematics"){

		CSS[0] = `flex whitespace-nowrap overflow-hidden
					flex-col items-center p-2 flex-wrap w-full`;
		CSS[1] = `mr-auto text-[#2A6F6F] border-b-2 border-[#2A6F6F] border-rounded-xl pb-[4px]`;
		CSS[2] = `flex flex-row w-full`;
		CSS[3] = `ml-auto`;
		CSS[4] = `flex flex-row w-full`;
		CSS[5] = `flex flex-col w-full whitespace-pre`;
		return CSS;
	}
	else if (template == "science"){

		CSS[0] = `flex whitespace-nowrap overflow-hidden
					flex-col items-center p-2 flex-wrap w-full`;
		CSS[1] = `mr-auto text-[#2C6B45] border-b-2 border-[#2C6B45] border-rounded-xl pb-[4px]`;
		CSS[2] = `flex flex-row w-full`;
		CSS[3] = `ml-auto`;
		CSS[4] = `flex flex-row w-full`;
		CSS[5] = `flex flex-col w-full whitespace-pre`;
		return CSS;
	}
	else if (template == "socialscience"){

		CSS[0] = `flex whitespace-nowrap overflow-hidden
					flex-col items-center p-2 flex-wrap w-full`;
		CSS[1] = `mr-auto text-[#E27D60] w-full border-b-2 border-[#E27D60] border-rounded-xl pb-[4px]`;
		CSS[2] = `flex flex-row w-full`;
		CSS[3] = `ml-auto`;
		CSS[4] = `flex flex-row w-full`;
		CSS[5] = `flex flex-col w-full whitespace-pre`;
		return CSS;
	}
	else {

		CSS[0] = `flex whitespace-nowrap overflow-hidden
					flex-col items-center p-2 flex-wrap w-full`;
		CSS[1] = `mr-auto text-[#005177]`;
		CSS[2] = `flex flex-row w-full`;
		CSS[3] = `ml-auto`;
		CSS[4] = `flex flex-row w-full`;
		CSS[5] = `flex flex-col w-full whitespace-pre`;
		return CSS;
	}
}

function getCertificationsCSS(template){

	let CSS = [];

	if (template == "basic"){

		CSS[0] = `flex whitespace-nowrap overflow-hidden
					flex-col items-center p-2 flex-wrap w-full`;
		CSS[1] = `mr-auto text-[#005177]`;
		CSS[2] = `flex flex-row w-full`;
		CSS[3] = `ml-auto`;
		CSS[4] = `flex flex-row w-full`;
		CSS[5] = `flex w-full`;
		return CSS;
	}
	else if (template == "arts"){

		CSS[0] = `flex whitespace-nowrap overflow-hidden
					flex-col items-center p-2 flex-wrap w-full`;
		CSS[1] = `mr-auto bg-[#5b008f] text-white w-full px-2 pb-[7px]`;
		CSS[2] = `flex flex-row w-full px-1`;
		CSS[3] = `ml-auto`;
		CSS[4] = `flex flex-row w-full px-1`;
		CSS[5] = `flex w-full px-1`;
		return CSS;
	}
	else if (template == "communications"){

		CSS[0] = `flex whitespace-nowrap overflow-hidden
					flex-col items-center p-2 flex-wrap w-full`;
		CSS[1] = `mr-auto text-[#2A9D8F] w-full border-b-2 border-[#2A9D8F] border-rounded-xl pb-[4px]`;
		CSS[2] = `flex flex-row w-full`;
		CSS[3] = `ml-auto`;
		CSS[4] = `flex flex-row w-full`;
		CSS[5] = `flex w-full`;
		return CSS;
	}
	else if (template == "computation"){

		CSS[0] = `flex whitespace-nowrap overflow-hidden
					flex-col items-center p-2 flex-wrap w-full`;
		CSS[1] = `mr-auto text-[#00A8FF] border-b-2 border-[#00A8FF] border-rounded-xl pb-[4px]`;
		CSS[2] = `flex flex-row w-full`;
		CSS[3] = `ml-auto`;
		CSS[4] = `flex flex-row w-full`;
		CSS[5] = `flex w-full`;
		return CSS;
	}
	else if (template == "humanities"){

		CSS[0] = `flex whitespace-nowrap overflow-hidden
					flex-col items-center p-2 flex-wrap w-full`;
		CSS[1] = `mr-auto text-[#800020] border-b-2 border-[#800020] border-rounded-xl pb-[4px]`;
		CSS[2] = `flex flex-row w-full`;
		CSS[3] = `ml-auto`;
		CSS[4] = `flex flex-row w-full`;
		CSS[5] = `flex w-full`;
		return CSS;
	}
	else if (template == "mathematics"){

		CSS[0] = `flex whitespace-nowrap overflow-hidden
					flex-col items-center p-2 flex-wrap w-full`;
		CSS[1] = `mr-auto text-[#2A6F6F] border-b-2 border-[#2A6F6F] border-rounded-xl pb-[4px]`;
		CSS[2] = `flex flex-row w-full`;
		CSS[3] = `ml-auto`;
		CSS[4] = `flex flex-row w-full`;
		CSS[5] = `flex w-full`;
		return CSS;
	}
	else if (template == "science"){

		CSS[0] = `flex whitespace-nowrap overflow-hidden
					flex-col items-center p-2 flex-wrap w-full`;
		CSS[1] = `mr-auto text-[#2C6B45] border-b-2 border-[#2C6B45] border-rounded-xl pb-[4px]`;
		CSS[2] = `flex flex-row w-full`;
		CSS[3] = `ml-auto`;
		CSS[4] = `flex flex-row w-full`;
		CSS[5] = `flex w-full`;
		return CSS;
	}
	else if (template == "socialscience"){

		CSS[0] = `flex whitespace-nowrap overflow-hidden
					flex-col items-center p-2 flex-wrap w-full`;
		CSS[1] = `mr-auto text-[#E27D60] w-full border-b-2 border-[#E27D60] border-rounded-xl pb-[4px]`;
		CSS[2] = `flex flex-row w-full`;
		CSS[3] = `ml-auto`;
		CSS[4] = `flex flex-row w-full`;
		CSS[5] = `flex w-full`;
		return CSS;
	}
	else {

		CSS[0] = `flex whitespace-nowrap overflow-hidden
					flex-col items-center p-2 flex-wrap w-full`;
		CSS[1] = `mr-auto text-[#005177]`;
		CSS[2] = `flex flex-row w-full`;
		CSS[3] = `ml-auto`;
		CSS[4] = `flex flex-row w-full`;
		CSS[5] = `flex w-full`;
		return CSS;
	}
}

function getAwardsHonorsCSS(template){

	let CSS = [];

	if (template == "basic"){

		CSS[0] = `flex whitespace-nowrap overflow-hidden
					flex-col items-center p-2 flex-wrap w-full`;
		CSS[1] = `mr-auto text-[#005177]`;
		CSS[2] = `flex flex-row w-full`;
		CSS[3] = `ml-auto`;
		CSS[4] = `flex w-full whitespace-pre`;
		return CSS;
	}
	else if (template == "arts"){

		CSS[0] = `flex whitespace-nowrap overflow-hidden
					flex-col items-center p-2 flex-wrap w-full`;
		CSS[1] = `mr-auto bg-[#5b008f] text-white w-full px-2 pb-[7px]`;
		CSS[2] = `flex flex-row w-full px-1`;
		CSS[3] = `ml-auto`;
		CSS[4] = `flex w-full whitespace-pre px-1`;
		return CSS;
	}
	else if (template == "communications"){

		CSS[0] = `flex whitespace-nowrap overflow-hidden
					flex-col items-center p-2 flex-wrap w-full`;
		CSS[1] = `mr-auto text-[#2A9D8F] w-full border-b-2 border-[#2A9D8F] border-rounded-xl pb-[4px]`;
		CSS[2] = `flex flex-row w-full`;
		CSS[3] = `ml-auto`;
		CSS[4] = `flex w-full whitespace-pre`;
		return CSS;
	}
	else if (template == "computation"){

		CSS[0] = `flex whitespace-nowrap overflow-hidden
					flex-col items-center p-2 flex-wrap w-full`;
		CSS[1] = `mr-auto text-[#00A8FF] border-b-2 border-[#00A8FF] border-rounded-xl pb-[4px]`;
		CSS[2] = `flex flex-row w-full`;
		CSS[3] = `ml-auto`;
		CSS[4] = `flex w-full whitespace-pre`;
		return CSS;
	}
	else if (template == "humanities"){

		CSS[0] = `flex whitespace-nowrap overflow-hidden
					flex-col items-center p-2 flex-wrap w-full`;
		CSS[1] = `mr-auto text-[#800020] border-b-2 border-[#800020] border-rounded-xl pb-[4px]`;
		CSS[2] = `flex flex-row w-full`;
		CSS[3] = `ml-auto`;
		CSS[4] = `flex w-full whitespace-pre`;
		return CSS;
	}
	else if (template == "mathematics"){

		CSS[0] = `flex whitespace-nowrap overflow-hidden
					flex-col items-center p-2 flex-wrap w-full`;
		CSS[1] = `mr-auto text-[#2A6F6F] border-b-2 border-[#2A6F6F] border-rounded-xl pb-[4px]`;
		CSS[2] = `flex flex-row w-full`;
		CSS[3] = `ml-auto`;
		CSS[4] = `flex w-full whitespace-pre`;
		return CSS;
	}
	else if (template == "science"){

		CSS[0] = `flex whitespace-nowrap overflow-hidden
					flex-col items-center p-2 flex-wrap w-full`;
		CSS[1] = `mr-auto text-[#2C6B45] border-b-2 border-[#2C6B45] border-rounded-xl pb-[4px]`;
		CSS[2] = `flex flex-row w-full`;
		CSS[3] = `ml-auto`;
		CSS[4] = `flex w-full whitespace-pre`;
		return CSS;
	}
	else if (template == "socialscience"){

		CSS[0] = `flex whitespace-nowrap overflow-hidden
					flex-col items-center p-2 flex-wrap w-full`;
		CSS[1] = `mr-auto text-[#E27D60] w-full border-b-2 border-[#E27D60] border-rounded-xl pb-[4px]`;
		CSS[2] = `flex flex-row w-full`;
		CSS[3] = `ml-auto`;
		CSS[4] = `flex w-full whitespace-pre`;
		return CSS;
	}
	else {

		CSS[0] = `flex whitespace-nowrap overflow-hidden
					flex-col items-center p-2 flex-wrap w-full`;
		CSS[1] = `mr-auto text-[#005177]`;
		CSS[2] = `flex flex-row w-full`;
		CSS[3] = `ml-auto`;
		CSS[4] = `flex w-full whitespace-pre`;
		return CSS;
	}
}

function getLeadershipInvolvementCSS(template){
	
	let CSS = [];

	if (template == "basic"){

		CSS[0] = `flex whitespace-nowrap overflow-hidden
					flex-col items-center p-2 flex-wrap w-full`;
		CSS[1] = `mr-auto text-[#005177]`;
		CSS[2] = `flex flex-row w-full`;
		CSS[3] = `ml-auto`;
		CSS[4] = `flex w-full whitespace-pre`;
		return CSS;
	}
	else if (template == "arts"){

		CSS[0] = `flex whitespace-nowrap overflow-hidden
					flex-col items-center p-2 flex-wrap w-full`;
		CSS[1] = `mr-auto bg-[#5b008f] text-white w-full px-2 pb-[7px]`;
		CSS[2] = `flex flex-row w-full px-1`;
		CSS[3] = `ml-auto`;
		CSS[4] = `flex w-full whitespace-pre px-1`;
		return CSS;
	}
	else if (template == "communications"){

		CSS[0] = `flex whitespace-nowrap overflow-hidden
					flex-col items-center p-2 flex-wrap w-full`;
		CSS[1] = `mr-auto text-[#2A9D8F] w-full border-b-2 border-[#2A9D8F] border-rounded-xl pb-[4px]`;
		CSS[2] = `flex flex-row w-full`;
		CSS[3] = `ml-auto`;
		CSS[4] = `flex w-full whitespace-pre`;
		return CSS;
	}
	else if (template == "computation"){

		CSS[0] = `flex whitespace-nowrap overflow-hidden
					flex-col items-center p-2 flex-wrap w-full`;
		CSS[1] = `mr-auto text-[#00A8FF] border-b-2 border-[#00A8FF] border-rounded-xl pb-[4px]`;
		CSS[2] = `flex flex-row w-full`;
		CSS[3] = `ml-auto`;
		CSS[4] = `flex w-full whitespace-pre`;
		return CSS;
	}
	else if (template == "humanities"){

		CSS[0] = `flex whitespace-nowrap overflow-hidden
					flex-col items-center p-2 flex-wrap w-full`;
		CSS[1] = `mr-auto text-[#800020] border-b-2 border-[#800020] border-rounded-xl pb-[4px]`;
		CSS[2] = `flex flex-row w-full`;
		CSS[3] = `ml-auto`;
		CSS[4] = `flex w-full whitespace-pre`;
		return CSS;
	}
	else if (template == "mathematics"){

		CSS[0] = `flex whitespace-nowrap overflow-hidden
					flex-col items-center p-2 flex-wrap w-full`;
		CSS[1] = `mr-auto text-[#2A6F6F] border-b-2 border-[#2A6F6F] border-rounded-xl pb-[4px]`;
		CSS[2] = `flex flex-row w-full`;
		CSS[3] = `ml-auto`;
		CSS[4] = `flex w-full whitespace-pre`;
		return CSS;
	}
	else if (template == "science"){

		CSS[0] = `flex whitespace-nowrap overflow-hidden
					flex-col items-center p-2 flex-wrap w-full`;
		CSS[1] = `mr-auto text-[#2C6B45] border-b-2 border-[#2C6B45] border-rounded-xl pb-[4px]`;
		CSS[2] = `flex flex-row w-full`;
		CSS[3] = `ml-auto`;
		CSS[4] = `flex w-full whitespace-pre`;
		return CSS;
	}
	else if (template == "socialscience"){

		CSS[0] = `flex whitespace-nowrap overflow-hidden
					flex-col items-center p-2 flex-wrap w-full`;
		CSS[1] = `mr-auto text-[#E27D60] w-full border-b-2 border-[#E27D60] border-rounded-xl pb-[4px]`;
		CSS[2] = `flex flex-row w-full`;
		CSS[3] = `ml-auto`;
		CSS[4] = `flex w-full whitespace-pre`;
		return CSS;
	}
	else {

		CSS[0] = `flex whitespace-nowrap overflow-hidden
					flex-col items-center p-2 flex-wrap w-full`;
		CSS[1] = `mr-auto text-[#005177]`;
		CSS[2] = `flex flex-row w-full`;
		CSS[3] = `ml-auto`;
		CSS[4] = `flex w-full whitespace-pre`;
		return CSS;
	}
}