import { useEffect, useState, useCallback } from "react";
import { API } from "../api/api";

import {
    PieChart,
    Pie,
    Tooltip,
    ResponsiveContainer,
    Cell,
    Legend
} from "recharts";

/* ---------------- VALID DATA FIELDS ---------------- */

const validFields = [
    "product",
    "quantity",
    "unitPrice",
    "totalAmount",
    "status",
    "createdBy"
];

/* ---------------- CHART COLORS ---------------- */

const COLORS = [
    "#6366f1",
    "#22c55e",
    "#f59e0b",
    "#ef4444",
    "#06b6d4",
    "#8b5cf6",
    "#14b8a6",
    "#e879f9"
];

export default function PieChartWidget({ widget = {}, range = "All" }) {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [autoRefresh, setAutoRefresh] = useState(false);

    /* ---------------- WIDGET TYPE VALIDATION ---------------- */

    if (widget.type && widget.type !== "pie") {
        return null;
    }

    /* ---------------- VALIDATED SETTINGS ---------------- */

    const dataField = validFields.includes(widget?.dataField)
        ? widget.dataField
        : "status";

    const chartHeight = (widget?.height || 4) * 70;

    const showLegend = widget?.showLegend !== false;

    /* ---------------- LOAD DATA ---------------- */

    const loadChart = useCallback(async () => {

        try {

            setLoading(true);
            setError(null);

            const res = await API.get("/dashboard/widget-data", {

                params: {
                    field: dataField,
                    range: range || "All"
                }

            });

            setData(res.data || []);

        } catch (err) {

            console.error("Pie chart error:", err);
            setError("Failed to load chart data");

        } finally {

            setLoading(false);

        }

    }, [dataField, range]);

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

        const header = "Name,Value\n";

        const rows = data
            .map(d => `${d.name},${d.value}`)
            .join("\n");

        const csv = header + rows;

        const blob = new Blob([csv], { type: "text/csv" });

        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;
        link.download = "pie-chart-data.csv";

        link.click();

        window.URL.revokeObjectURL(url);

    };

    /* ---------------- LABEL FORMAT ---------------- */

    const renderLabel = ({ percent }) =>
        `${(percent * 100).toFixed(0)}%`;

    /* ---------------- TOOLTIP FORMAT ---------------- */

    const formatTooltip = (value) => {

        if (widget?.format === "currency") {
            return `$${Number(value).toFixed(widget?.precision || 0)}`;
        }

        return Number(value).toFixed(widget?.precision || 0);

    };

    /* ---------------- LOADING ---------------- */

    if (loading) {

        return (
            <div className="flex items-center justify-center h-64 text-gray-500">
                Loading chart...
            </div>
        );

    }

    /* ---------------- ERROR ---------------- */

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

    /* ---------------- EMPTY ---------------- */

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

            <div className="flex justify-between items-center mb-3">

                <div>

                    <h2 className="text-lg font-semibold text-gray-800">
                        {widget?.title || "Untitled"}
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

            {/* CHART */}

            <ResponsiveContainer width="100%" height={chartHeight}>

                <PieChart>

                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius="70%"
                        label={renderLabel}
                        animationDuration={500}
                    >

                        {data.map((entry, index) => (

                            <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                            />

                        ))}

                    </Pie>

                    <Tooltip formatter={formatTooltip} />

                    {showLegend && <Legend />}

                </PieChart>

            </ResponsiveContainer>

        </div>

    );

}