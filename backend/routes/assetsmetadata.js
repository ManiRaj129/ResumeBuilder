const express = require("express");

module.exports = function (db) {

	const router = express.Router();

	router.get("/", async (req, res) => {

		console.log(`\n\n>>>>>>>>>>>>>>>>>>>>`);

		try {
			console.log("GET request for /assetsmetadata");

			const metadatas = await db
				.collection("assetsmetadata")
				.find({})
				.limit(100)
				.toArray();

			console.log("Success:", metadatas);
			res.status(200).send(metadatas);
		} catch (error) {
			console.error("Cannot GET assets metadatas:", error);
			res.status(500).send("Internal Server Error");
		}
	});

	router.get("/specific", async (req, res) => {

		console.log(`\n\n>>>>>>>>>>>>>>>>>>>>`);

		try {
			console.log("GET request for /assetsmetadata/specific");

			const ids = req.query.assets.split(',').map(Number);
			const metadatas = await db
				.collection("assetsmetadata")
				.find({
					id: {$in : ids}
				})
				.limit(100)
				.toArray();

			if (!metadatas || metadatas.length === 0){
				console.log("GET request for /assetsmetadata/specific failed");
				return res.status(404).send({error: `Metadatas with ID ${req.query.assets} does not exists`});
			}

			console.log("Success:", metadatas);
			res.status(200).send(metadatas);
		} catch (error) {
			console.error("Cannot GET metadatas:", error);
			res.status(500).send("Internal Server Error");
		}
	});
	return router;
};