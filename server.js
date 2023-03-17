import { PASSWORD, USERNAME } from "./config.js";

// const express = require("express");
import express from "express";
// const bodyParser = require("body-parser");
import bodyParser from "body-parser";
const app = express();
// const MongoClient = require("mongodb").MongoClient;
import { MongoClient } from "mongodb";

const connectionString = `mongodb+srv://${USERNAME}:${PASSWORD}@cluster0.evksjla.mongodb.net/?retryWrites=true&w=majority`;
MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then((client) => {
    console.log("connected to database");
    const db = client.db("star-wars-quotes");
    const quotesCollection = db.collection("quotes");

    app.set("view engine", "ejs");
    app.use(express.static("public"));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.get("/", (req, res) => {
      // res.sendFile(__dirname + "/index.html");
      // console.log(__dirname)
      const cursor = db
        .collection("quotes")
        .find()
        .toArray()
        .then((results) => res.render("index.ejs", { quotes: results }))
        .catch((err) => console.log(err));
    });
    app.post("/quotes", (req, res) => {
      quotesCollection
        .insertOne(req.body)
        .then((result) => {
          res.redirect("/");
        })
        .catch((error) => console.error(error));
    });
    app.put("/quotes", (req, res) => {
      quotesCollection
        .findOneAndUpdate(
          { name: "jeet" },
          {
            $set: {
              name: req.body.name,
              quote: req.body.quote,
            },
          },
          { upsert: true }
        )
        .then((result) => res.json("success"))
        .catch((err) => console.log(err));
    });
    app.delete("/quotes", (req, res) => {
      quotesCollection
        .deleteOne({ name: req.body.name })
        .then((response) => {
          if (response.deletedCount === 0) {
            return res.json("No more quotes to delete");
          }
          res.json(`Deleted Darth Vader's quote`);
        })
        .catch((err) => console.log(err));
    });
    app.listen(3000, function () {
      console.log("server is running on port 3000");
    });
  })
  .catch((error) => console.log(error));
