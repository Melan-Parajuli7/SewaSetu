const express = require('express')
const {PORT } = require("./config/config")
const app = express();
const connectDb = require('./config/db')


connectDb();

app.use(express.json());
app.listen(PORT, () => {
    console.log(`Server is running on PORT Number ${PORT}` );
});


module.exports = app;