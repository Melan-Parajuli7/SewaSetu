const express = require('express')
const {PORT } = require("./config/config")
const app = express();
const connectDb = require('./config/db')

// routes
const userRoutes = require("./routes/user.routes")


connectDb();
app.use(express.json());

//Routes structure
app.use("/api/users", userRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on PORT Number ${PORT}` );
});


module.exports = app;