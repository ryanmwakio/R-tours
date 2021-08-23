const path = require("path");

const morgan = require("morgan");
const mongoose = require("mongoose");
const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, "config.env") });

const tourRouter = require("./routes/tourRoutes.js");
const userRouter = require("./routes/userRoutes.js");

const app = express();

//Database connection
//const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD);
mongoose
  .connect(process.env.DATABASE_LOCAL, {
    //.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connected successfully"))
  .catch((err) => console.error(err));

//middlewares
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

//Routes
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

//start the server
//console.log(path.dirname(process.mainModule.filename));
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`R-Tours server running on http://localhost:${port}`);
});
