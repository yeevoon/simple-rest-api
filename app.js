const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const validator = require('express-validator');
const userRoutes = require('./routes');
const errorMsg = require("./lib/messages").error;
const port = 5000;

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(validator());

app.use(userRoutes);

app.use((res) => {
    res.status(404).json(errorMsg.webpage_not_found);
});

app.listen(port,() =>{
    console.log("Server running on port 5000");
})

