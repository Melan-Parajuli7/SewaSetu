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
  try {
    const phoneVal = phone?.trim() || "";
    const emailVal = email?.trim() || "";

    // 1. Ensure at least one identifier is provided
    if (!phoneVal && !emailVal) {
      const error = new Error("Phone or Email is required");
      error.statusCode = 400;
      throw error;
    }

    if (!password || !password.trim()) {
      const error = new Error("Password is required");
      error.statusCode = 400;
      throw error;
    }

    // 2. Build the query dynamically based on what was provided
    let query = {};

    if (phoneVal && phoneVal.includes("@")) {
      // User typed an email into the phone field (common frontend mistake)
      query = { email: phoneVal.toLowerCase() };
    } else if (emailVal && !emailVal.includes("@")) {
      // User typed a phone into the email field
      query = { phone: emailVal };
    } else if (phoneVal) {
      // Normal phone login
      query = { phone: phoneVal };
    } else {
      // Normal email login
      query = { email: emailVal.toLowerCase() };
    }

    console.log("Searching DB with query:", query);

    // 3. Find the user (using the dynamic query)
    const user = await User.findOne(query).select("+password");

    if (!user) {
      const error = new Error("Invalid credentials");
      error.statusCode = 401;
      throw error;
    }

    // 4. Check if account is suspended
    if (!user.status || user.status === "suspended") {
      const error = new Error("Your account is suspended");
      error.statusCode = 403;
      throw error;
    }

    // 5. Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      const error = new Error("Invalid credentials");
      error.statusCode = 401;
      throw error;
    }

    // 6. Generate Token and return success
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
    console.error("Error in Login User:", error.message);
    throw error;
  }
};

module.exports = {registerUser, loginUser};
