const mongoose = require("mongoose");

const dashboardSchema = new mongoose.Schema({

layout: [
{
i: String,
x: Number,
y: Number,
w: Number,
h: Number,
type: String
}
]

});

module.exports = mongoose.model("DashboardLayout", dashboardSchema);