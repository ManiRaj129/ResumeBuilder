import React from "react";
import { EmptyHeader, GeneralFooter } from "./Boilerplate";
import KennyJPG from "../assets/images/profilePic/kenny.jpg";
import ManiJPG from "../assets/images/profilePic/Mani.jpg"
import { ScrollToTop } from "./Utils";

function AboutUs(){

	return (
		<>
			<ScrollToTop/>
			<EmptyHeader/>
			<div className="p-5"/>
			<DisplayAbout/>
			<div className="p-5"/>
			<DisplayCourse/>
			<div className="p-5"/>
			<DisplayAuthors/>
			<div className="p-5"/>
			<GeneralFooter/>
		</>
	)
}
export default AboutUs;

function DisplayAbout() {

	return (
		<div className="about-container flex flex-col items-center p-8 gap-7">
			<p className="text-5xl bg-[#189ab4] text-white p-3 rounded-xl shadow-md font-bold">
				ResumeReady?
			</p>
			<p className="text-center text-lg border-1 border-[#189ab4] shadow-md p-3 rounded-md w-[50%]">
			<strong>ResumeReady</strong> is an intuitive, user-friendly platform designed to 
			help you craft professional resumes quickly and effortlessly. 
			Inspired by the best features of Overleaf and Canva, ResumeReady 
			offers a diverse collection of customizable templates and design 
			assets. <br/>With our real-time editor, you’ll get an instant preview of 
			your work as you go, ensuring your resume looks perfect at every step. 
			Whether you're starting from scratch or enhancing an existing draft, 
			ResumeReady makes resume-building faster, easier, and more enjoyable 
			than ever before.
			</p>
		</div>
	)
};

function DisplayCourse() {

	return (
		<div className="course-container flex flex-col items-center p-8 gap-7">
			<p className="text-5xl bg-[#189ab4] text-white p-3 rounded-xl shadow-md font-bold">
				The Course
			</p>
			<p className="text-center text-lg border-1 border-[#189ab4] shadow-md p-3 rounded-md w-[50%]">
				COM S 3190 Construction of User Interfaces<br/>
				Spring 2025
			</p>
		</div>
	)
};

function DisplayAuthors() {

	return (
		<div className="authors-main-container flex flex-col items-center p-8 gap-7">
			<p className="text-5xl bg-[#189ab4] text-white p-3 rounded-xl shadow-md font-bold">
				The Authors
			</p>
			<div className="text-center text-lg border-1 border-[#189ab4] shadow-md p-3 rounded-md w-fit">
				<div className="authors-container flex flex-col gap-6">
					<div className="kenny-item-container flex flex-col items-center">
						<img src={KennyJPG} alt="kenny jpg"
							 className="w-[355px] rounded-tl-md rounded-tr-md border-1 border-b-0 border-[#189ab4]">
						</img>
						<p className="border-1 border-[#189ab4] p-5 rounded-br-md rounded-bl-md shadow-md w-full">
							Kenny Jia Hui Leong<br/>
							kennyljh@iastate.edu
						</p>
					</div>
					<div className="p-1 bg-[#189ab4] rounded-3xl"/>
					<div className="mani-item-container flex flex-col items-center">
						<img src={ManiJPG} alt="mani jpg"
							 className="w-[355px] rounded-tl-md rounded-tr-md border-1 border-b-0 border-[#189ab4]">
						</img>
						<p className="border-1 border-[#189ab4] p-5 rounded-br-md rounded-bl-md shadow-md w-full">
							Mani Raj Rejinthala<br/>
							sai143@iastate.edu
						</p>
					</div>

				</div>
			</div>
		</div>
	)
};