const express = require("express");

// need to have an argument that accepts a declared db, otherwise won't work
module.exports = function (db) {
  const router = express.Router();

  router.get("/", async (req, res) => {
    console.log(`\n\n>>>>>>>>>>>>>>>>>>>>`);

    try {
      console.log("GET request for /users");

      const users = await db.collection("users").find({}).limit(100).toArray();

      console.log("Success:", users);
      res.status(200).send(users);
    } catch (error) {
      console.error("Cannot GET users:", error);
      res.status(500).send("Internal Server Error");
    }
  });

  router.get("/:id", async (req, res) => {
    console.log(`\n\n>>>>>>>>>>>>>>>>>>>>`);

    try {
      console.log("GET request for /users/:id");

      const user = await db
        .collection("users")
        .findOne({ id: Number(req.params.id) });

      if (user.length === 0) {
        console.log("GET request for /users/:id failed");
        return res
          .status(404)
          .send({ error: `User with ID ${req.params.id} does not exists` });
      }

      console.log("Success:", user);
      res.status(200).send(user);
    } catch (error) {
      console.error("Cannot GET user:", error);
      res.status(500).send("Internal Server Error");
    }
  });

  router.get("/email/:email", async (req, res) => {
    console.log(`\n\n>>>>>>>>>>>>>>>>>>>>`);

    try {
      console.log("GET request for /users/email/" + req.params.email);

      const user = await db
        .collection("users")
        .findOne({ email: req.params.email });
      console.log(user);
      if (!user) {
        console.log("GET request for /users/email/:email failed");
        return res.status(404).send({
          error: `User with email ${req.params.email} does not exist`,
        });
      }

      console.log("Success:", user);
      res.status(200).send(user);
    } catch (error) {
      console.error("Cannot GET user:", error);
      res.status(500).send("Internal Server Error");
    }
  });

  router.post("/add", async (req, res) => {
    try {
      let ID = await db.collection("users").countDocuments({});
      ID += 1;
      const newUser = {
        id: ID,
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      };
      const result = await db.collection("users").insertOne(newUser);
      res.status(200);
      res.send(result);
    } catch (error) {
      console.error(" User addition failed" + error);
      res.status(500);
      res.send({ acknowledged: false });
    }
  });

  router.delete("/delete/:id", async (req, res) => {
    try {
      const result = await db
        .collection("users")
        .deleteOne({ id: Number(req.params.id) });
      if (result.deletedCount === 0) {
        return res
          .status(404)
          .send({ message: `No user with id: ${req.params.id}` });
      }

      const deleteResumes = await db
        .collection("resumes")
        .deleteMany({ userid: Number(req.params.id) });

      console.log(deleteResumes);

      res.status(200).send(result);
    } catch (error) {
      console.error(500).send({ message: "internal server error" });
    }
  });

  router.put("/update/:id", async (req, res) => {
    console.log(req.body);
    const updateUser = {
      $set: req.body,
    };
    try {
      const result = await db
        .collection("users")
        .updateOne({ id: Number(req.params.id) }, updateUser);

      if (result.modifiedCount === 0) {
        if (result.matchedCount === 0) {
          console.log("hello");
          return res
            .status(404)
            .send({ message: "No user found with this ID" });
        }

        return res
          .status(200)
          .send({ message: "No changes were made; data is identical" });
      }

      res.status(200).send(result);
    } catch (error) {
      console.log("hello");
      console.error(error);
      res.status(500).send({ message: "Internal server error" });
    }
  });
  return router;
};
