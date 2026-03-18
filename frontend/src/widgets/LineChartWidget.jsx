import { useEffect, useState, useCallback } from "react";
import { API } from "../api/api";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    Legend,
    LabelList
} from "recharts";

/* ---------------- LABEL FORMAT ---------------- */

const formatLabel = (label) => {
    if (!label) return "";
    return label.length > 14 ? label.slice(0, 14) + "..." : label;
};

/* ---------------- VALID AXIS FIELDS ---------------- */

const validFields = [
    "product",
    "quantity",
    "unitPrice",
    "totalAmount",
    "status",
    "createdBy",
    "duration"
];

/* ---------------- HEX COLOR VALIDATION ---------------- */

const isValidHex = (color) => {
    return /^#([0-9A-F]{3}){1,2}$/i.test(color);
};

export default function LineChartWidget({ widget = {}, range = "All" }) {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showLine, setShowLine] = useState(true);
    const [autoRefresh, setAutoRefresh] = useState(false);

    /* ---------------- WIDGET TYPE VALIDATION ---------------- */

    if (widget.type && widget.type !== "line") {
        return null;
    }

    /* ---------------- VALIDATED SETTINGS ---------------- */

    const xAxisField = validFields.includes(widget.xAxis)
        ? widget.xAxis
        : "product";

    const yAxisField = validFields.includes(widget.yAxis)
        ? widget.yAxis
        : "totalAmount";

    const chartColor = isValidHex(widget.color)
        ? widget.color
        : "#6366f1";

    const chartHeight =
        widget.height && widget.height >= 1
            ? widget.height * 60
            : 320;

    /* ---------------- LOAD CHART DATA ---------------- */

    const loadChart = useCallback(async () => {

        try {

            setLoading(true);
            setError(null);

            const res = await API.get("/dashboard/widget-data", {

                params: {
                    xAxis: xAxisField,
                    yAxis: yAxisField,
                    aggregation: widget.aggregation || "sum",
                    range: range || "All"
                }

            });

            setData(res.data || []);

        } catch (err) {

            console.error("Line chart error:", err);
            setError("Failed to load chart data");

        } finally {

            setLoading(false);

        }

    }, [xAxisField, yAxisField, widget.aggregation, range]);

    /* ---------------- INITIAL LOAD ---------------- */

    useEffect(() => {
        loadChart();
    }, [loadChart]);

    /* ---------------- AUTO REFRESH ---------------- */

    useEffect(() => {

        if (!autoRefresh) return;

        const interval = setInterval(() => {
            loadChart();
        }, 10000);

        return () => clearInterval(interval);

    }, [autoRefresh, loadChart]);

    /* ---------------- EXPORT CSV ---------------- */

    const downloadCSV = () => {

        if (!data.length) return;

        const rows = [
            ["Name", "Value"],
            ...data.map((d) => [d.name, d.value])
        ];

        const csv = rows.map((r) => r.join(",")).join("\n");

        const blob = new Blob([csv], { type: "text/csv" });

        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "line-chart-data.csv";
        link.click();

        window.URL.revokeObjectURL(url);

    };

    /* ---------------- TOOLTIP FORMAT ---------------- */

    const formatTooltip = (value) => {

        if (widget.format === "currency") {
            return `$${Number(value).toFixed(widget.precision || 0)}`;
        }

        return Number(value).toFixed(widget.precision || 0);

    };

    /* ---------------- STATES ---------------- */

    if (loading) {

        return (
            <div className="flex items-center justify-center h-64 text-gray-500">
                Loading chart...
            </div>
        );

    }

    if (error) {

        return (
            <div className="flex flex-col items-center justify-center h-64 text-red-400">

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
            className="bg-white shadow rounded-lg p-4 w-full"
            style={{ minHeight: chartHeight }}
        >

            {/* HEADER */}

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3">

                <div>

                    <h2 className="text-lg font-bold text-gray-800">
                        {widget.title || "Line Chart"}
                    </h2>

                    {widget.description && (
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
                        onClick={() => setShowLine(!showLine)}
                        className="text-xs bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
                    >
                        Toggle
                    </button>

                    <button
                        onClick={() => setAutoRefresh(!autoRefresh)}
                        className="text-xs bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
                    >
                        {autoRefresh ? "Stop Auto" : "Auto"}
                    </button>

                    <button
                        onClick={downloadCSV}
                        className="text-xs bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
                    >
                        Export
                    </button>

                </div>

            </div>

            {/* CHART */}

            <ResponsiveContainer width="100%" height={chartHeight}>

                <LineChart
                    data={data}
                    margin={{ top: 20, right: 20, left: 10, bottom: 60 }}
                >

                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis
                        dataKey="name"
                        tickFormatter={formatLabel}
                        angle={-30}
                        textAnchor="end"
                        interval={0}
                        height={70}
                        label={{
                            value: xAxisField,
                            position: "insideBottom",
                            offset: -5
                        }}
                    />

                    <YAxis
                        label={{
                            value: yAxisField,
                            angle: -90,
                            position: "insideLeft"
                        }}
                    />

                    <Tooltip formatter={formatTooltip} />

                    <Legend />

                    {showLine && (

                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke={chartColor}
                            strokeWidth={3}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                            animationDuration={500}
                        >

                            {widget.showLabel && (
                                <LabelList
                                    dataKey="value"
                                    position="top"
                                />
                            )}

                        </Line>

                    )}

                </LineChart>

            </ResponsiveContainer>

        </div>

    );

}