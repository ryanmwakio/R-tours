const morgan = require('morgan');
const express = require('express');

const tourRouter = require('./routes/tourRoutes.js');
const userRouter = require('./routes/userRoutes.js');


const app = express();

//middlewares
app.use(morgan('dev'));
app.use(express.json());

//Routes
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

//start the server
module.exports = app;