require('dotenv').config();

module.exports = {
    // Server Configuration

    PORT : process.env.PORT,
    NODE_ENV : process.env.NODE_ENV || "development",

    // Database Configuration
    MONGO_URL: process.env.MONGO_URL,

    // jwt configuration
    JWT_SCERET : process.env.JWT_SCERET,
    JWT_EXPIRES_IN : process.env.JWT_EXPIRES_IN || "2d", 
    


}