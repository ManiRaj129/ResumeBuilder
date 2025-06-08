const express = require("express");

module.exports = function (db) {

	const router = express.Router();

	router.get("/", async (req, res) => {

		console.log(`\n\n>>>>>>>>>>>>>>>>>>>>`);

		try {
			console.log("GET request for /templates");

			const templates = await db
				.collection("templates")
				.find({})
				.limit(100)
				.toArray();

			console.log("Success:", templates);
			res.status(200).send(templates);
		} catch (error) {
			console.error("Cannot GET templates:", error);
			res.status(500).send("Internal Server Error");
		}
	});

	router.get("/:id", async (req, res) => {

		console.log(`\n\n>>>>>>>>>>>>>>>>>>>>`);

		try {
			console.log("GET request for /templates/:id");
			query = {id: Number(req.params.id)};

			const template = await db
				.collection("templates")
				.findOne(query);

			if (template.length === 0){
				console.log("GET request for /templates/:id failed");
				return res.status(404).send({error: `Template with ID ${req.params.id} does not exists`});
			}

			console.log("Success:", template);
			res.status(200).send(template);
		} catch (error) {
			console.error("Cannot GET template:", error);
			res.status(500).send("Internal Server Error");
		}
	});
	return router;
};