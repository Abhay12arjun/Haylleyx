import { useEffect, useState, useCallback } from "react";
import { API } from "../api/api";

import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
    Legend,
    ZAxis
} from "recharts";

/* ---------------- VALID FIELDS ---------------- */

const validFields = [
    "product",
    "quantity",
    "unitPrice",
    "totalAmount",
    "status",
    "createdBy",
    "duration"
];

/* ---------------- COLOR VALIDATION ---------------- */

const isValidHex = (color) => /^#([0-9A-F]{3}){1,2}$/i.test(color);

export default function ScatterChartWidget({ widget = {}, range = "All" }) {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [autoRefresh, setAutoRefresh] = useState(false);
    const [error, setError] = useState(null);

    if (widget.type && widget.type !== "scatter") return null;

    /* ---------------- SAFE CONFIG ---------------- */

    const xAxisField = validFields.includes(widget?.xAxis)
        ? widget.xAxis
        : "quantity";

    const yAxisField = validFields.includes(widget?.yAxis)
        ? widget.yAxis
        : "totalAmount";

    const chartColor = isValidHex(widget?.color)
        ? widget.color
        : "#6366f1";

    const containerHeight =
        widget?.height && widget.height >= 1
            ? widget.height * 80
            : 420;

    /* ---------------- LOAD DATA ---------------- */

    const loadChart = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await API.get("/orders");
            const orders = res.data || [];

            const formatted = orders
                .map((o) => ({
                    x: Number(o[xAxisField]) || 0,
                    y: Number(o[yAxisField]) || 0,
                    size: Number(o.quantity || 1),
                    product: o.product || "Unknown",   // ✅ ADDED
                    orderId: o._id
                }))
                .filter(d => !isNaN(d.x) && !isNaN(d.y));

            setData(formatted);

        } catch (err) {
            console.error("Scatter chart error:", err);
            setError("Failed to load chart data");
        } finally {
            setLoading(false);
        }
    }, [xAxisField, yAxisField]);

    useEffect(() => {
        loadChart();
    }, [loadChart]);

    /* ---------------- AUTO REFRESH ---------------- */

    useEffect(() => {
        if (!autoRefresh) return;

        const interval = setInterval(loadChart, 10000);
        return () => clearInterval(interval);

    }, [autoRefresh, loadChart]);

    /* ---------------- EXPORT CSV ---------------- */

    const exportCSV = () => {
        if (!data.length) return;

        const header = "Product,X,Y\n"; // ✅ UPDATED

        const rows = data
            .map(d => `${d.product},${d.x},${d.y}`)
            .join("\n");

        const csv = header + rows;

        const blob = new Blob([csv], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "scatter-chart-data.csv";
        link.click();

        window.URL.revokeObjectURL(url);
    };

    /* ---------------- STATS ---------------- */

    const stats = {
        avgX: data.reduce((sum, d) => sum + d.x, 0) / (data.length || 1),
        avgY: data.reduce((sum, d) => sum + d.y, 0) / (data.length || 1),
        maxY: data.length ? Math.max(...data.map(d => d.y)) : 0,
        minY: data.length ? Math.min(...data.map(d => d.y)) : 0
    };

    /* ---------------- CUSTOM TOOLTIP ---------------- */

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const d = payload[0].payload;

            return (
                <div className="bg-white p-2 border rounded shadow text-xs">
                    <p><strong>Product:</strong> {d.product}</p>
                    <p>{xAxisField}: {d.x}</p>
                    <p>{yAxisField}: {d.y}</p>
                </div>
            );
        }
        return null;
    };

    /* ---------------- STATES ---------------- */

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64 text-gray-500">
                Loading Scatter Chart...
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-red-500">
                <p>{error}</p>
                <button
                    onClick={loadChart}
                    className="mt-2 bg-gray-200 px-3 py-1 rounded"
                >
                    Retry
                </button>
            </div>
        );
    }

    if (!data.length) {
        return (
            <div className="flex items-center justify-center h-64 text-gray-400">
                No data available
            </div>
        );
    }

    return (
        <div
            className="bg-white shadow rounded-lg p-4 flex flex-col"
            style={{ height: containerHeight }}
        >

            {/* HEADER */}

            <div className="flex justify-between items-center mb-3">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                        {widget?.title || "Scatter Chart"}
                    </h2>

                    {widget?.description && (
                        <p className="text-sm text-gray-500">
                            {widget.description}
                        </p>
                    )}
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={loadChart}
                        className="text-xs bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
                    >
                        Refresh
                    </button>

                    <button
                        onClick={exportCSV}
                        className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                    >
                        Export
                    </button>

                    <button
                        onClick={() => setAutoRefresh(!autoRefresh)}
                        className={`text-xs px-2 py-1 rounded ${autoRefresh
                            ? "bg-green-500 text-white"
                            : "bg-gray-200"
                            }`}
                    >
                        Auto
                    </button>
                </div>
            </div>

            {/* STATS */}

            <div className="grid grid-cols-4 gap-2 mb-3 text-xs text-gray-600">
                <div className="bg-gray-50 p-2 rounded">
                    Avg X: {stats.avgX.toFixed(2)}
                </div>
                <div className="bg-gray-50 p-2 rounded">
                    Avg Y: {stats.avgY.toFixed(2)}
                </div>
                <div className="bg-gray-50 p-2 rounded">
                    Max Y: {stats.maxY}
                </div>
                <div className="bg-gray-50 p-2 rounded">
                    Min Y: {stats.minY}
                </div>
            </div>

            {/* CHART */}

            <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart
                        margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 50
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis
                            type="number"
                            dataKey="x"
                            name={xAxisField}
                        />

                        <YAxis
                            type="number"
                            dataKey="y"
                            name={yAxisField}
                        />

                        <ZAxis
                            type="number"
                            dataKey="size"
                            range={[60, 400]}
                        />

                        {/* ✅ CUSTOM TOOLTIP */}
                        <Tooltip content={<CustomTooltip />} />

                        <Legend />

                        <Scatter
                            name="Orders"
                            data={data}
                            fill={chartColor}
                        />
                    </ScatterChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}