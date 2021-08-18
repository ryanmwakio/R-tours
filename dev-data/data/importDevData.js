const path = require("path");
const fs = require('fs');

const mongoose = require("mongoose");
const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const Tour = require('../../models/Tour');


const app = express();

//Database connection
//const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
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

  

//Read json file
const tours =JSON.parse(fs.readFileSync(path.join(__dirname,'./tours-simple.json'), 'utf-8'));

//import data into the database
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data successfully imported');
  } catch (err) {
    console.log(err);
  }
  process.exit();
}

//Delete all data in the database
const deleteData = async () => {
    try {
    await Tour.deleteMany();
    console.log('Data successfully deleted');
  } catch (err) {
    console.log(err);
  }
  process.exit();
}

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2]==='--delete') {
  deleteData();
}

