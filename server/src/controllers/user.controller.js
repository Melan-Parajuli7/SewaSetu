const userService = require("../services/user.services");

// simple validation helper - easy for beginners to understand

const validateRegister = (data) => {
  const errors = [];

  if (!data.name || data.name.trim() == "") {
    errors.push("Name is Required");
  }

  if (!data.email || data.email.trim() == "") {
    errors.push("Email is Required");
  } else if (!data.email.includes("@")) {
    errors.push("Please Provide a valid email address");
  }

  if (!data.password || data.password.trim() == "") {
    errors.push("Password is Required");
  } else if (data.password.length < 6) {
    errors.push("Password must be at least 6 characters");
  }
  return errors;
};

const validateLogin = (data) => {
  const errors = [];

  const phone = data.phone?.trim() || "";
  const email = data.email?.trim() || "";
  const password = data.password?.trim() || "";

  // At least one of phone or email is required
  if (!phone && !email) {
    errors.push("Either phone number or email is required");
  }

  // Password is always required
  if (!password) {
    errors.push("Password is Required");
  }

  return errors;
};

// ------------------------------------------------------------------------------------------------------------------- //

// register User

const register = async (req, res) => {
  try {
    // Simple Validators
    const errors = validateRegister(req.body);
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation Failed",
        error: errors,
      });
    }
    const { name, email, password, role, phone } = req.body;
    const result = await userService.registerUser({
      name,
      email,
      password,
      role,
      phone,
    });
    res.status(201).json({
      success: true,
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

const login = async (req, res) => {
  try {
    const errors = validateLogin(req.body);
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        messsage: "Validation Failed",
        error: errors,
      });
    }

    const { email, phone, password } = req.body;
    const result = await userService.loginUser(email, phone, password);

    // Make sure the result contains the full user with role

    res.status(200).json({
      success: true,
      message: result.message,
      jwtToken: result.jwtToken,
      name: result.name,
      role: result.role,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

module.exports = {
  register,
  login,
};
