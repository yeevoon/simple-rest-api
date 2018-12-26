const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const validator = require('express-validator');
const userRoutes = require('./routes');
const errorMsg = require("./lib/messages").error;

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(validator());

app.use(userRoutes);

app.use((res) => {
    res.status(404).json(errorMsg.webpage_not_found);
});

app.listen(5000,() =>{
    console.log("Server running on port 5000");
})

