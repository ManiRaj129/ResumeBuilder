const express = require("express");

module.exports = function (db) {

	const router = express.Router();

	router.get("/", async (req, res) => {

		console.log(`\n\n>>>>>>>>>>>>>>>>>>>>`);

		try {
			console.log("GET request for /assets");

			const assets = await db
				.collection("assets")
				.find({})
				.limit(100)
				.toArray();

			console.log("Success:", assets);
			res.status(200).send(assets);
		} catch (error) {
			console.error("Cannot GET assets:", error);
			res.status(500).send("Internal Server Error");
		}
	});

	router.get("/:id", async (req, res) => {

		console.log(`\n\n>>>>>>>>>>>>>>>>>>>>`);

		try {
			console.log("GET request for /assets/:id");
			query = {id: Number(req.params.id)};

			const asset = await db
				.collection("assets")
				.findOne(query);

			if (!asset || asset.length === 0){
				console.log("GET request for /assets/:id failed");
				return res.status(404).send({error: `Asset with ID ${req.params.id} does not exists`});
			}

			console.log("Success:", asset);
			res.status(200).send(asset);
		} catch (error) {
			console.error("Cannot GET asset:", error);
			res.status(500).send("Internal Server Error");
		}
	});
	return router;
};