const fs = require('fs');
const path = require('path');

const filePath = path.join(
  path.dirname(process.mainModule.filename),
  "dev-data",
  "data",
  "tours-simple.json"
);
const tours = JSON.parse(fs.readFileSync(filePath, "utf-8"));

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: "success",
    time: req.requestTime,
    results: tours.length,
    data: { tours },
  });
};

exports.getTour = (req, res) => {
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

exports.createTour = (req, res) => {
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

exports.updateTour = (req, res) => {
  res.status(200).json({
    status: "sucess",
    tour: "updated tour",
  });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: "success",
    message: "tour deleted",
  });
};