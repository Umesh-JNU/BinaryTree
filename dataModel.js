const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
  root: {
    type: Number,
    required: true,
  },
  left: {
    type: Number,
    default: null,
  },
  right: {
    type: Number,
    default: null,
  },
});

module.exports = {
  dataModel: mongoose.model("data", dataSchema),
};
