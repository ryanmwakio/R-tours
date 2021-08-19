const { lineJoin } = require("pdfkit");
const Tour = require("../models/Tour");

exports.getAllTours = async (req, res) => {
  try {
    const queryObj = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);
    //console.log(req.query,queryObj);

    //1. FILTERING
    //const query = Tour.find().where('duration').equals(5).where('difficulty').equals('easy');
    let query = Tour.find(queryObj);

    //2.SORTING
    if (req.query.sort) {
      const sortBy = req.query.split(",").join(" ");
      query = query.sort(sortBy);
      //sort(price ratingsAverage);
    } else {
      query = query.sort("-createdAt");
    }

    //3.FIELD LIMITING
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    //4.PAGINATION
    const page = Number(req.query.page) || 1; //setting default if user doesn't pass a query value
    const limit = Number(req.query.limit) || 100;
    const skip = (page - 1) * limit;
    //page=2&limit=10  1-10,page 1, 11-20,page 2
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const numberOfTours = await Tour.countDocuments();
      if (skip > numberOfTours) throw new Error("This page dose not exist");
    }

    //Execute the query
    //query.sort().select().skip().limit()
    const tours = await query;

    res.status(200).json({
      status: "success",
      results: tours.length,
      data: { tours },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    //const tour=await Tour.findOne({_id: req.params.id})
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: "success",
      data: { tour },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    //const newTour = new Tour(req.body).save();
    const newTour = await Tour.create(req.body);

    return res.status(201).json({
      status: "success",
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    return res.status(500).json({
      status: "fail",
      message: err,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "sucess",
      tour: updatedTour,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      message: "Tour deleted",
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
