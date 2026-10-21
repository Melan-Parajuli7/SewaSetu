require('dotenv').config();

module.exports = {
    // Server Configuration

    PORT : process.env.PORT,
    NODE_ENV : process.env.NODE_ENV || "development",

    // Database Configuration
    MONGO_URL: process.env.MONGO_URL


}