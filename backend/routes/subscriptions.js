const express = require("express");

module.exports = function (db) {

	const router = express.Router();

	router.get("/", async (req, res) => {

		console.log(`\n\n>>>>>>>>>>>>>>>>>>>>`);

		try {
			console.log("GET request for /subscriptions");

			const subscriptions = await db
				.collection("subscriptions")
				.find({})
				.limit(100)
				.toArray();

			console.log("Success:", subscriptions);
			res.status(200).send(subscriptions);
		} catch (error) {
			console.error("Cannot GET subscriptions:", error);
			res.status(500).send("Internal Server Error");
		}
	});

	router.get("/:id", async (req, res) => {

		console.log(`\n\n>>>>>>>>>>>>>>>>>>>>`);

		try {
			console.log("GET request for /subscriptions/:id");
			query = {id: Number(req.params.id)};

			const subscription = await db
				.collection("subscriptions")
				.findOne(query);

			if (!subscription || subscription.length === 0){
				console.log("GET request for /subscriptions/:id failed");
				return res.status(404).send({error: `Subscription with ID ${req.params.id} does not exists`});
			}

			console.log("Success:", subscription);
			res.status(200).send(subscription);
		} catch (error) {
			console.error("Cannot GET subscription:", error);
			res.status(500).send("Internal Server Error");
		}
	});
	return router;
};