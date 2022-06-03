const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      // unique prevents a user from using the same email that another user has
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid");
        }
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 7,
      trim: true,
      validate(value) {
        if (value.toLowerCase().includes("password")) {
          throw new Error('Password cannot contain the word "password".');
        }
      },
    },
    cart: {
      type: Array,
      trim: true,
    },
    // json web token used to store user
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// userSchema.virtual("tasks", {
//   ref: "Task",
//   localField: "_id",
//   foreignField: "owner",
// });

userSchema.methods.toJSON = function () {
  // (this) refer's to the user in schema
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

userSchema.methods.generateAuthToken = async function () {
  // (this) refer's to the user in schema
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);

  // dont need possibly
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error();
  }
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Unable to login");
  }
  return user;
};

// (pre) with mongoose allows use to do checks or modifications before we store user.
userSchema.pre("save", async function (next) {
  // (this) refer's to the user in schema
  const user = this;

  // hashing password before saving, 8 rounds for security and speed
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  // telling the function to run this code and stop after
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
