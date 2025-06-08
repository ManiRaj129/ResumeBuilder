const express = require("express");
const cors = require("cors");
const app = express();
const fs = require("fs");
const bodyParser = require("body-parser");

const {MongoClient} = require("mongodb");
const url = "mongodb://localhost:27017";
const dbName = "coms3190"
const client = new MongoClient(url);

app.use(cors());
app.use(bodyParser.json({limit: '20mb'}));

const port = "8080";
const host = "localhost";

async function startServer() {

	try {
		await client.connect();
		const db = client.db(dbName);
		console.log("Connected to MongoDB");

		// passing db to routers
		const usersRouter = require("./routes/users.js")(db);
		app.use("/users", usersRouter);

		const resumesRouter = require("./routes/resumes.js")(db);
		app.use("/resumes", resumesRouter);

		const templatesRouter = require("./routes/templates.js")(db);
		app.use("/templates", templatesRouter);
        
		const otpRouter=require("./routes/genOTP.js");
		app.use("/sendOtp", otpRouter);

		const assetsRouter = require("./routes/assets.js")(db);
		app.use("/assets", assetsRouter);

		const servicesRouter = require("./routes/services.js")(db);
		app.use("/services", servicesRouter);

		const subscriptionsRouter = require("./routes/subscriptions.js")(db);
		app.use("/subscriptions", subscriptionsRouter);

		const assetsmetadataRouter = require("./routes/assetsmetadata.js")(db);
		app.use("/assetsmetadata", assetsmetadataRouter);

		app.listen(port, () => {
			console.log("App listening at http://%s:%s", host, port);
		});
	} catch (err) {
		console.error("Failed to start server:", err);
	}
}
startServer();

process.on("SIGINT", async () => {
	console.log("\nSIGINT received. Closing MongoDB connection...");
	await client.close();
	process.exit(0);
  });