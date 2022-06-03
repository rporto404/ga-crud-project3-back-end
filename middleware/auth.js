const jwt = require("jsonwebtoken");
const user = require("../models/userModel");
const User = require("../models/userModel");

const auth = async (req, res, next) => {
  //   console.log("auth, middleware");
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    }); // find a user with a correct id that still has a valid token

    if (!user) {
      throw new Error();
    }
    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    console.log(e);
    res.status(401).send({ error: "Please authenticate." });
  }
};

module.exports = auth;
