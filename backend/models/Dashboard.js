const mongoose = require("mongoose");

const dashboardSchema = new mongoose.Schema({

  layout: {
    type: Array,
    default: []
  }

});

module.exports = mongoose.model("Dashboard", dashboardSchema);