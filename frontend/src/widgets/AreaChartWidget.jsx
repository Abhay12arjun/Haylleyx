import { useEffect, useState, useCallback } from "react";
import { API } from "../api/api";

import {
    AreaChart,
    Area,
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

const validMetrics = [
    "quantity",
    "unitPrice",
    "totalAmount",
    "duration"
];

/* ---------------- HEX COLOR VALIDATION ---------------- */

const isValidHex = (color) => {
    return /^#([0-9A-F]{3}){1,2}$/i.test(color);
};

export default function AreaChartWidget({ widget = {}, range = "All" }) {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showChart, setShowChart] = useState(true);
    const [autoRefresh, setAutoRefresh] = useState(false);

    /* ---------------- WIDGET TYPE VALIDATION ---------------- */

    if (widget.type && widget.type !== "area") {
        return null;
    }

    /* ---------------- VALIDATED SETTINGS ---------------- */

    const xAxisField = validFields.includes(widget?.xAxis)
        ? widget.xAxis
        : "product";

    const metricField = validMetrics.includes(widget?.metric)
        ? widget.metric
        : "totalAmount";

    const chartColor = isValidHex(widget?.color)
        ? widget.color
        : "#6366f1";

    const chartHeight =
        widget?.height && widget.height >= 1
            ? widget.height * 60
            : 320;

    /* ---------------- LOAD DATA ---------------- */

    const loadChart = useCallback(async () => {

        try {

            setLoading(true);
            setError(null);

            const res = await API.get("/dashboard/widget-data", {

                params: {
                    xAxis: xAxisField,
                    metric: metricField,
                    aggregation: widget?.aggregation || "sum",
                    range: range || "All"
                }

            });

            setData(res.data || []);

        } catch (err) {

            console.error("Area chart error:", err);
            setError("Failed to load chart data");

        } finally {

            setLoading(false);

        }

    }, [xAxisField, metricField, widget?.aggregation, range]);

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

    const exportCSV = () => {

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
        link.download = "area-chart-data.csv";
        link.click();

        window.URL.revokeObjectURL(url);

    };

    /* ---------------- TOOLTIP FORMAT ---------------- */

    const formatTooltip = (value) => {

        if (widget?.format === "currency") {
            return `$${Number(value).toFixed(widget?.precision || 0)}`;
        }

        if (widget?.format === "percent") {
            return `${Number(value).toFixed(widget?.precision || 0)}%`;
        }

        return Number(value).toFixed(widget?.precision || 0);

    };

    /* ---------------- PEAK VALUE ---------------- */

    const maxValue = data.length
        ? Math.max(...data.map((d) => d.value))
        : 0;

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
            className="w-full bg-white shadow rounded-lg p-4"
            style={{ minHeight: chartHeight }}
        >

            {/* HEADER */}

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3">

                <div>

                    <h2 className="text-lg font-bold text-gray-800">
                        {widget?.title || "Area Chart"}
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
                        onClick={() => setShowChart(!showChart)}
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
                        onClick={exportCSV}
                        className="text-xs bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
                    >
                        Export
                    </button>

                </div>

            </div>

            {/* CHART */}

            {showChart && (

                <ResponsiveContainer width="100%" height={chartHeight}>

                    <AreaChart
                        data={data}
                        margin={{ top: 20, right: 20, left: 10, bottom: 60 }}
                    >

                        <defs>

                            <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">

                                <stop
                                    offset="5%"
                                    stopColor={chartColor}
                                    stopOpacity={0.8}
                                />

                                <stop
                                    offset="95%"
                                    stopColor={chartColor}
                                    stopOpacity={0}
                                />

                            </linearGradient>

                        </defs>

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
                                value: metricField,
                                angle: -90,
                                position: "insideLeft"
                            }}
                        />

                        <Tooltip formatter={formatTooltip} />

                        <Legend />

                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke={chartColor}
                            fillOpacity={1}
                            fill="url(#colorArea)"
                            strokeWidth={3}
                            animationDuration={700}
                        >

                            {widget?.showLabel && (
                                <LabelList
                                    dataKey="value"
                                    position="top"
                                />
                            )}

                        </Area>

                    </AreaChart>

                </ResponsiveContainer>

            )}

            {/* PEAK VALUE */}

            <div className="text-xs text-gray-400 mt-2">
                Peak Value: {formatTooltip(maxValue)}
            </div>

        </div>

    );

}