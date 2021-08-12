const morgan = require('morgan');
const express = require('express');

const tourRouter = require('./routes/tourRoutes.js');
const userRouter = require('./routes/userRoutes.js');


const app = express();

//middlewares
app.use(morgan('dev'));
app.use(express.json());

const port = process.env.PORT || 5000;

//Routes
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

//start the server
app.listen(port, () => {console.log(`R-Tours server running on http://localhost:${port}`)});