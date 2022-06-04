const express = require("express");
const cors = require("cors");
const auth = require("../middleware/auth");

const User = require("../models/userModel");
// const userSeed = require("../models/userSeed.js");

// config
const router = express.Router();

// middle-ware
router.use(express.json());
router.use(cors());
router.use(express.urlencoded({ extended: false }));

// ---------------------testing user routes--------------------------
// get users data
// router.get("/", (req, res) => {
//   User.find({}, (err, foundUsers) => {
//     res.json(foundUsers);
//   });
// });

// // get user data
// router.get("/:id", (req, res) => {
//   User.findById(req.params.id, req.body, (err, foundUser) => {
//     res.json(foundUser);
//   });
// });

// ---------------------End testing user routes--------------------------

// code from task app re-work!

// testing creating new user
router.post("/register", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    // const token = await user.generateAuthToken();
    res.status(201).send({ user });
  } catch (err) {
    res.status(400).send(err);
  }
});

// testing login functionality
router.post("/login", async (req, res) => {
  //   console.log("route");
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (err) {
    res.status(400).send(err);
  }
});

// testing logout functionality
router.post("/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send();
  } catch (err) {
    res.status(500).send();
  }
});

// testing logout all
// router.post("/logoutAll", auth, async (req, res) => {
//   try {
//     req.user.tokens = [];
//     await req.user.save();
//     res.send();
//   } catch (err) {
//     res.status(500).send(err);
//   }
// });

// testing add to cart
router.post("/me/addtocart", async (req, res) => {
  const cart = req.body.cart;
  try {
    const user = User.find({ email: req.body.email });
    console.log(user);
    res.send(req.body);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

router.get("/me", async (req, res) => {
  //   console.log(req.body);
  //   const user = User.find({ email: req.body.email });
  res.send(res.user);
});

router.post("/email", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    res.send({ user });
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

router.patch("/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password"];
  const isValidUpdate = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidUpdate) {
    return res.status(400).send({ error: "Invalid updates!" });
  }
  try {
    // we know they logged in so dont need a test case for that
    updates.forEach((update) => (req.user[update] = req.body[update])); // needed to get middleware to run correctly
    await req.user.save();
    res.send(req.user);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.delete("/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    res.send(req.user);
  } catch (err) {
    res.status(500).send(err);
  }
});

// *** routes to see and delete sub db users ***

// Drop users sub db
router.delete("/delete_users", (req, res) => {
  User.collection.drop((err, data) => {
    if (err) {
      res.json("Could not delete user sub db");
    }
    res.json("Deleted user sub db!");
  });
});

// export to server
module.exports = router;

// *** seed data into database once and comment out after ***
// Create for user

// User.create(userSeed, (err, data) => {
//   if (err) console.log(err.message);
//   console.log("Added provided user data....");
// });

// Drop user sub db

// User.collection.drop();
