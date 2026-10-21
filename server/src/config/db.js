const mongoose = require('mongoose')

async function connectDB() {
    try{
        await mongoose.connect(process.env.MONGO_URL, {}),
        console.log("Connected to The DataBase");
    }catch(e){
        console.log("Error connecting to DataBase", e);
        process.exit(1);
    }
    
}

module.exports = connectDB;