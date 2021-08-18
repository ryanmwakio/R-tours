const Tour = require('../models/Tour');
 
exports.getAllTours =async (req, res) => {
  try {
    const tours = await Tour.find();

    res.status(200).json({
      status: "success",
      results: tours.length,
      data: { tours },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    })
  }
};



exports.getTour = async (req, res) => {
  try {
    //const tour=await Tour.findOne({_id: req.params.id})
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {tour}
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

exports.createTour =async (req, res) => {
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
      status: 'fail',
      message: err
    });
  }    
};

exports.updateTour =async (req, res) => {
  try {
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    
     res.status(200).json({
       status: "sucess",
       tour: updatedTour,
     });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
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
      status: 'fail',
      message: err
    });
  }
 
};