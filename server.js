const express = require("express");
const mongoose = require("mongoose");
// const cors = require("cors");
const env = require("dotenv").config({ path: ".env" });
const storeController = require("./controller/store.js");

const app = express();

// might not need this here as well
app.use(express.json());
app.use(cors());

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

// app.listen(3000, () => {
//   console.log('listening...');
// });

// mongoose.connect('mongodb://localhost:27017');
// mongoose.connection.once('open', () => {
//   console.log('connected to mongod...');
// });

// ____________________________________________________________

//Database
const PORT = process.env.PORT || 3000;
const db = mongoose.connection;

// connect to the database either via heroku/atlas
const MONGODB_URI = process.env.MONGODB_URI;

// local
// const mongoURI = "mongodb://0.0.0.0:27017/store";

// Connect to Mongo atlas
mongoose.connect(MONGODB_URI, () => {
  console.log("connected to mongo");
});

// connect local
// mongoose.connect(mongoURI, () => {
//   console.log("connected to mongo");
// });

// Error / success / mongo atlas
db.on("error", (err) => console.log(err.message + " is Mongod not running?"));
db.on("connected", () => console.log("mongo connected: ", MONGODB_URI));
db.on("disconnected", () => console.log("mongo disconnected"));

// Error / success / mongo local
// db.on("error", (err) => console.log(err.message + " is Mongod not running?"));
// db.on("connected", () => console.log("mongo connected: ", mongoURI));
// db.on("disconnected", () => console.log("mongo disconnected"));

// change to /movies as default route name
app.use("/store", storeController);

// maybe we dont need
// db.once("open", () => {
//   console.log("Connected to mongod ...");
// });

app.listen(PORT, () => console.log("Listening on port:", PORT));
