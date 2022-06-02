// we possibly remove the express require & cors require
const express = require("express");
const cors = require("cors");

const Store = require("../models/storeModel");

// seed data for testing
const storeSeed = require("../models/storeSeed.js");

// config
const router = express.Router();

// middle-ware
router.use(express.json());
router.use(cors());
router.use(express.urlencoded({ extended: false }));

// parsing function
const escapeRegex = (text) => {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

// post data
router.post("/", (req, res) => {
  Store.create(req.body, (err, createdStore) => {
    res.json(createdStore);
  });
});

// get data with search
router.get("/", (req, res) => {
  if (req.query.search) {
    const regex = new RegExp(escapeRegex(req.query.search));
    Store.find({ name: regex }, (err, searchItem) => {
      if (err) {
        console.log(err.message);
      } else {
        if (searchItem === undefined) {
          const result = "Search Found Nothing";
          res.json(result);
        } else {
          res.json(searchItem);
        }
      }
    })
  } else {
    Store.find({}, (err, foundStore) => {
      res.json(foundStore);
    });
  }
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

// export to server
module.exports = router;

// *** seed data into database once and comment out after ***

// Store.create(storeSeed, (err, data) => {
//   if (err) console.log(err.message);
//   console.log("Added provided movie data....");
// });

// *** Drop collection ***

// Store.collection.drop();
