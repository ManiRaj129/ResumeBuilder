const express = require("express");

module.exports = function (db) {

	const router = express.Router();

	router.get("/", async (req, res) => {

		console.log(`\n\n>>>>>>>>>>>>>>>>>>>>`);

		try {
			console.log("GET request for /services");

			const services = await db
				.collection("services")
				.find({})
				.limit(100)
				.toArray();

			console.log("Success:", services);
			res.status(200).send(services);
		} catch (error) {
			console.error("Cannot GET services:", error);
			res.status(500).send("Internal Server Error");
		}
	});

	router.get("/:id", async (req, res) => {

		console.log(`\n\n>>>>>>>>>>>>>>>>>>>>`);

		try {
			console.log("GET request for /services/:id");
			query = {id: Number(req.params.id)};

			const service = await db
				.collection("services")
				.findOne(query);

			if (!service || service.length === 0){
				console.log("GET request for /services/:id failed");
				return res.status(404).send({error: `Service with ID ${req.params.id} does not exists`});
			}

			console.log("Success:", service);
			res.status(200).send(service);
		} catch (error) {
			console.error("Cannot GET service:", error);
			res.status(500).send("Internal Server Error");
		}
	});
	return router;
};