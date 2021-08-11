const path = require('path');
const fs = require('fs');

const express = require('express');

const router = express.Router();


const filePath = path.join(path.dirname(process.mainModule.filename), "dev-data", "data", "tours-simple.json");
const tours = JSON.parse(fs.readFileSync(filePath, "utf-8"));

const getAllTours = (req, res) => {
  res.status(200).json({
    status: "success",
    time: req.requestTime,
    results: tours.length,
    data: { tours },
  });
};

const getTour = (req, res) => {
  const id = Number(req.params.id);
  const tour = tours.find((item) => item.id === id);
  if (!tour) {
    return res.status(404).json({
      status: "fail",
      message: "No tour by this id",
    });
  }

  res.status(200).json({
    status: "success",
    data: { tour },
  });
};

const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);

  fs.writeFile(filePath, JSON.stringify(tours), (err) => {
    if (err) {
      console.error(err);
      return res.status(404).json("Server error");
    }

    return res.status(201).json({
      status: "success",
      data: {
        tour: newTour,
      },
    });
  });
};

const updateTour = (req, res) => {
  res.status(200).json({
    status: "sucess",
    tour: "updated tour",
  });
};

const deleteTour = (req, res) => {
  res.status(204).json({
    status: "success",
    message: "tour deleted",
  });
};


router.route("/").get(getAllTours).post(createTour);
router.route("/:id").get(getTour).patch(updateTour).delete(deleteTour);

module.exports=router