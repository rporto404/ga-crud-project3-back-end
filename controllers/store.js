// we possibly remove the express require & cors require
const express = require("express");
const cors = require("cors");

// store model
const Store = require("../models/storeModel");

// seed data for testing
const storeSeed = require("../models/storeSeed.js");

// config
const router = express.Router();

// middle-ware
router.use(express.json());
router.use(cors());
router.use(express.urlencoded({ extended: false }));

// post data
router.post("/", (req, res) => {
  Store.create(req.body, (err, createdStore) => {
    res.json(createdStore);
  });
});

// get data
router.get("/", (req, res) => {
  Store.find({}, (err, foundStore) => {
    res.json(foundStore);
  });
});

// delete data
router.delete("/:id", (req, res) => {
  Store.findByIdAndRemove(req.params.id, { new: true }, (err, deletedStore) => {
    res.json(deletedStore);
  });
});

// update data
router.put("/:id", (req, res) => {
  Store.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (err, updatedStore) => {
      res.json(updatedStore);
    }
  );
});

// We should consider a route to seed the store db below

// --------------------------

// export to server
module.exports = router;

// *** seed data into database once and comment out after ***

// Create for Store

// Store.create(storeSeed, (err, data) => {
//   if (err) console.log(err.message);
//   console.log("Added provided movie data....");
// });
// *** Drop collection ***

// Store.collection.drop();
