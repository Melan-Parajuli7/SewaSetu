const User = require("../models/user");
const jwt = require("jsonwebtoken");

// User Registeration Bussiness Logic

const registerUser = async (userData) => {
  try {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error("User already Exists, You can directly login");
    }
    const user = new User({
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: userData.role,
      phone: userData.phone,
    });
    await user.save();

    return {
      success: true,
      message: "User registered Successfully",
      data: { user },
    };
  } catch (error) {
    console.error("Error while registering user", error);
    throw error;
  }
};

// User login Bussiness Logic

const loginUser = async (phone, email, password) => {
  // phone instead of email because most of the people are familier with phone and password
  // login pattern instead of email or password
  try {
    const user = await User.findOne({ phone, email }).select("+password");

    if (!user) {
      const error = new Error("Invalid credientals");
      error.statusCode = 401;
      throw error;
    }
    if (!user.status) {
      const error = new Error("Your account is suspended");
      error.statusCode = 403;
      throw error;
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      const error = new Error("Invalid credientals");
      error.statusCode = 401;
      throw error;
    }

    // Generate token using model method (which already includes role)

    const token = user.generateJWT();
    const userObject = user.toObject();
    delete userObject.password;

    return {
      success: true,
      message: "Login Successfully",
      jwtToken: token,
      name: userObject.name,
    };
  } catch (error) {
    console.error("Error in Login User", error.message);
    throw error;
  }
};

module.exports = {registerUser, loginUser};
