const Dashboard = require("../models/Dashboard");
const Order = require("../models/Order");


// SAVE DASHBOARD CONFIG

exports.saveDashboard = async (req, res) => {

  const { layout } = req.body;

  let dashboard = await Dashboard.findOne();

  if (dashboard) {

    dashboard.layout = layout;

    await dashboard.save();

  } else {

    dashboard = new Dashboard({ layout });

    await dashboard.save();

  }

  res.json(dashboard);

};


// GET DASHBOARD LAYOUT

exports.getDashboard = async (req, res) => {

  const dashboard = await Dashboard.findOne();

  res.json(dashboard || { layout: [] });

};



// GET WIDGET DATA FROM CUSTOMER ORDERS

exports.getWidgetData = async (req, res) => {

  try {

    const { metric, aggregation, xAxis } = req.query;

    let orders = await Order.find();

    let result = {};

    orders.forEach(order => {

      const key = order[xAxis];

      if (!result[key]) result[key] = [];

      result[key].push(order[metric]);

    });

    let data = Object.keys(result).map(key => {

      let values = result[key];

      let value = 0;

      if (aggregation === "sum") {

        value = values.reduce((a, b) => a + b, 0);

      }

      if (aggregation === "average") {

        value = values.reduce((a, b) => a + b, 0) / values.length;

      }

      if (aggregation === "count") {

        value = values.length;

      }

      return {

        name: key,
        value

      };

    });

    res.json(data);

  } catch (error) {

    console.error(error);

    res.status(500).json({ message: "Server error" });

  }

};