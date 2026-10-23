const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { JWT_SCERET, JWT_EXPIRES_IN } = require("../config/config");

// writing the schema for the user

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a  suitable name"],
      trim: true,
      maxlength: [50, "Name cannot be more then 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please provide a Password"],
      minlength: [6, "Password must have 6 characters"],
      select: false,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      default: null,
    },
    avatar: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    status: {
      type: String,
      enum: ["active", "suspended"],
      default: "active",
    },
    emailVerifiedAt: {
      type: Date,
      default: null,
    }
  },
  { timestamps: true },
);

// hash password before saving in database

UserSchema.pre("save", async function () {
  const user = this;

  if (!user.isModified("password")) {
    return;
  }
  // if password is not hashed then
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
  } catch (error) {
    throw error;
  }
});

// compare passowrd for login

UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// generate JWT token

UserSchema.methods.generateJWT = function () {
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      role: this.role,
    },
    JWT_SCERET,
    {
      expiresIn: JWT_EXPIRES_IN,
    },
  );
};


UserSchema.methods.toJson = function (){
    const userObject = this.toObject();
    delete userObject.password;
    delete userObject._v;
    return userObject;
};

const User = mongoose.model("user", UserSchema);

module.exports = User;