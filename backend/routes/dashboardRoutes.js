const express = require("express");
const router = express.Router();

const Dashboard = require("../models/Dashboard");
const Order = require("../models/Order");


/* ----------------------------------------------------
SAVE DASHBOARD LAYOUT
---------------------------------------------------- */

router.post("/save", async (req, res) => {

  try {

    const { layout } = req.body;

    if (!layout) {
      return res.status(400).json({
        message: "Layout is required"
      });
    }

    let dashboard = await Dashboard.findOne();

    if (dashboard) {

      dashboard.layout = layout;

    } else {

      dashboard = new Dashboard({ layout });

    }

    await dashboard.save();

    res.json({
      success: true,
      dashboard
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Dashboard save failed"
    });

  }

});


/* ----------------------------------------------------
GET DASHBOARD CONFIGURATION
---------------------------------------------------- */

router.get("/", async (req, res) => {

  try {

    const dashboard = await Dashboard.findOne();

    res.json(dashboard || { layout: [] });

  } catch (error) {

    res.status(500).json({
      message: "Dashboard fetch error"
    });

  }

});


/* ----------------------------------------------------
CHART WIDGET DATA
---------------------------------------------------- */

router.get("/widget-data", async (req, res) => {

  try {

    const {
      metric = "totalAmount",
      aggregation = "sum",
      xAxis = "product",
      range = "All"
    } = req.query;


    /* -------------------------
       DATE FILTER
    ------------------------- */

    let matchStage = {};

    if (range !== "All") {

      const now = new Date();

      let date;

      if (range === "Today") {

        date = new Date();
        date.setHours(0,0,0,0);

      }

      if (range === "Last7Days") {

        date = new Date(now);
        date.setDate(now.getDate() - 7);

      }

      if (range === "Last30Days") {

        date = new Date(now);
        date.setDate(now.getDate() - 30);

      }

      if (range === "Last90Days") {

        date = new Date(now);
        date.setDate(now.getDate() - 90);

      }

      matchStage = {
        createdAt: { $gte: date }
      };

    }


    /* -------------------------
       AGGREGATION OPERATOR
    ------------------------- */

    let operator = "$sum";

    if (aggregation === "average") operator = "$avg";
    if (aggregation === "count") operator = "$sum";


    /* -------------------------
       MONGODB AGGREGATION
    ------------------------- */

    const pipeline = [

      { $match: matchStage },

      {
        $group: {

          _id: `$${xAxis}`,

          value:
            aggregation === "count"
              ? { $sum: 1 }
              : { [operator]: `$${metric}` }

        }
      },

      {
        $project: {

          name: "$_id",
          value: { $round: ["$value", 2] },
          _id: 0

        }
      }

    ];

    const data = await Order.aggregate(pipeline);

    res.json(data);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Widget data error"
    });

  }

});


/* ----------------------------------------------------
TABLE WIDGET DATA
---------------------------------------------------- */

router.get("/table-data", async (req, res) => {

  try {

    const { range = "All" } = req.query;

    let query = {};

    if (range !== "All") {

      const now = new Date();
      let date;

      if (range === "Last7Days") {

        date = new Date(now);
        date.setDate(now.getDate() - 7);

      }

      if (range === "Last30Days") {

        date = new Date(now);
        date.setDate(now.getDate() - 30);

      }

      query.createdAt = { $gte: date };

    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(orders);

  } catch (error) {

    res.status(500).json({
      message: "Table data error"
    });

  }

});


/* ----------------------------------------------------
KPI CARD DATA
---------------------------------------------------- */

router.get("/kpi", async (req, res) => {

  try {

    const {
      metric = "totalAmount",
      aggregation = "sum"
    } = req.query;


    let pipeline;

    if (aggregation === "count") {

      pipeline = [
        { $count: "value" }
      ];

    } else {

      const operator =
        aggregation === "average" ? "$avg" : "$sum";

      pipeline = [

        {
          $group: {

            _id: null,
            value: { [operator]: `$${metric}` }

          }
        }

      ];

    }

    const result = await Order.aggregate(pipeline);

    const value = result.length ? result[0].value : 0;

    res.json({ value });

  } catch (error) {

    res.status(500).json({
      message: "KPI calculation failed"
    });

  }

});


module.exports = router;