const express = require("express");

module.exports = function (db) {

	const router = express.Router();

	router.post("/", async (req, res) => {

		console.log(`\n\n>>>>>>>>>>>>>>>>>>>>`);

		try {
			const newResume = {...req.body};
			console.log(newResume);

			const resume = await db
				.collection("resumes")
				.findOne({resumeid: newResume.resumeid});

			if (resume){
				console.log("POST request for /resumes failed");
				return res.status(404).send({error: `Resume with ID ${resume.resumeid} already exists`});
			}

			const result = await db
					.collection("resumes")
					.insertOne(newResume);

			console.log("POST request for /resumes");
			return res.status(200).send(result);

		} catch (error) {
			console.error("Cannot POST user:", error);
			res.status(500).send("Internal Server Error");
		}
	});

	router.put("/", async (req, res) => {

		console.log(`\n\n>>>>>>>>>>>>>>>>>>>>`);

		try {
			const newResume = {...req.body};
			console.log(newResume);

			const resume = await db
				.collection("resumes")
				.findOne({resumeid: newResume.resumeid});

			if (!resume){
				console.log("PUT request for /resumes failed");
				return res.status(404).send({error: `Resume with ID ${newResume.resumeid} does not exists`});
			}

			const result = await db
				.collection("resumes")
				.updateOne({resumeid: newResume.resumeid}, {$set: newResume});

			console.log("PUT request for /resumes");
			return res.status(200).send(result);

		} catch (error) {
			console.error("Cannot PUT user:", error);
			res.status(500).send("Internal Server Error");
		}
	});

	router.get("/", async (req, res) => {

		console.log(`\n\n>>>>>>>>>>>>>>>>>>>>`);

		try {
			console.log("GET request for /resumes");

			const resumes = await db
				.collection("resumes")
				.find({})
				.limit(100)
				.toArray();

			console.log("Success:", resumes);
			res.status(200).send(resumes);
		} catch (error) {
			console.error("Cannot GET resumes:", error);
			res.status(500).send("Internal Server Error");
		}
	});

	router.get("/resume", async (req, res) => {

		console.log(`\n\n>>>>>>>>>>>>>>>>>>>>`);

		try {
			console.log("GET request for /resumes/resume");

			const {userid, resumeid} = req.query;
			const resume = await db
				.collection("resumes")
				.findOne({userid: Number(userid), resumeid: resumeid});

			console.log("Success:", resume);
			res.status(200).send(resume);
		} catch (error) {
			console.error("Cannot GET resume:", error);
			res.status(500).send("Internal Server Error");
		}
	});

	router.get("/:id", async (req, res) => {

		console.log(`\n\n>>>>>>>>>>>>>>>>>>>>`);

		try {
			console.log("GET request for /resumes/:id");

			const resumes = await db
				.collection("resumes")
				.find({userid: Number(req.params.id)})
				.limit(100)
				.toArray();

			console.log("Success:", resumes);
			res.status(200).send(resumes);
		} catch (error) {
			console.error("Cannot GET resumes:", error);
			res.status(500).send("Internal Server Error");
		}
	});

	router.delete("/delete", async(req, res) => {

		console.log(`\n\n>>>>>>>>>>>>>>>>>>>>`);

		try {
			console.log("DELETE request for /resumes/delete");

			const {userid, resumeid} = req.query;
			const result = await db
				.collection("resumes")
				.deleteOne({userid: Number(userid), resumeid: resumeid});

			if (result.deletedCount === 0){
				console.log("DELETE request for /resumes/delete failed");
				return res.status(404).send({error: `Resume with userid: ${userid}, resumeid: ${resumeid} does not exists`});
			}

			console.log("Success:", result);
			res.status(200).send({Success: `Deleted resume with userid: ${userid}, resumeid: ${resumeid}`});
		} catch (error) {
			console.error("Cannot DELETE resume:", error);
			res.status(500).send("Internal Server Error");
		}
	})

	return router;
};