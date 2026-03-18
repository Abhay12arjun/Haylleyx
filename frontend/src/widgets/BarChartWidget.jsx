import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { API } from "../api/api";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    LabelList,
    Cell
} from "recharts";

/* ---------------- LABEL FORMAT ---------------- */

const formatLabel = (label) => {
    if (!label) return "";
    return label.length > 10 ? label.slice(0, 10) + "..." : label;
};

/* ---------------- VALID AXIS OPTIONS ---------------- */

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

export default function BarChartWidget({ widget = {} }) {

    const chartRef = useRef();

    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [autoRefresh, setAutoRefresh] = useState(false);
    const [showChart, setShowChart] = useState(true);

    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("desc");

    /* ---------------- WIDGET VALIDATION ---------------- */

    if (widget.type && widget.type !== "bar") {
        return null;
    }

    const xAxisField = validFields.includes(widget.xAxis)
        ? widget.xAxis
        : "product";

    const yAxisField = validFields.includes(widget.yAxis)
        ? widget.yAxis
        : "totalAmount";

    const chartColor = isValidHex(widget.color)
        ? widget.color
        : "#3b82f6";

    const chartHeight =
        widget.height && widget.height >= 1
            ? widget.height * 60
            : 260;

    /* ---------------- LOAD DATA ---------------- */

    const loadChart = useCallback(async () => {

        try {

            setLoading(true);
            setError(null);

            const res = await API.get("/dashboard/widget-data", {
                params: {
                    xAxis: xAxisField,
                    yAxis: yAxisField,
                    aggregation: widget.aggregation || "sum"
                }
            });

            setData(res.data || []);

        } catch (err) {

            console.error(err);
            setError("Failed to load chart data");

        } finally {

            setLoading(false);

        }

    }, [xAxisField, yAxisField, widget.aggregation]);

    /* ---------------- INITIAL LOAD ---------------- */

    useEffect(() => {
        loadChart();
    }, [loadChart]);

    /* ---------------- AUTO REFRESH ---------------- */

    useEffect(() => {

        if (!autoRefresh) return;

        const interval = setInterval(loadChart, 10000);

        return () => clearInterval(interval);

    }, [autoRefresh, loadChart]);

    /* ---------------- FILTER + SORT ---------------- */

    useEffect(() => {

        let result = [...data];

        if (search) {

            result = result.filter((d) =>
                d.name.toLowerCase().includes(search.toLowerCase())
            );

        }

        if (sort === "desc") {

            result.sort((a, b) => b.value - a.value);

        } else {

            result.sort((a, b) => a.value - b.value);

        }

        setFilteredData(result);

    }, [data, search, sort]);

    /* ---------------- EXPORT CSV ---------------- */

    const exportCSV = () => {

        if (!filteredData.length) return;

        const rows = [
            ["Name", "Value"],
            ...filteredData.map((d) => [d.name, d.value])
        ];

        const csv = rows.map((r) => r.join(",")).join("\n");

        const blob = new Blob([csv], { type: "text/csv" });

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "bar-chart-data.csv";
        link.click();

        URL.revokeObjectURL(url);

    };

    /* ---------------- EXPORT SVG ---------------- */

    const exportSVG = () => {

        const svg = chartRef.current?.querySelector("svg");

        if (!svg) return;

        const serializer = new XMLSerializer();
        const source = serializer.serializeToString(svg);

        const blob = new Blob([source], {
            type: "image/svg+xml;charset=utf-8"
        });

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `${widget.title || "chart"}.svg`;
        link.click();

        URL.revokeObjectURL(url);

    };

    /* ---------------- TOOLTIP FORMAT ---------------- */

    const formatTooltip = (value) => {

        if (widget.format === "currency") {
            return `$${Number(value).toFixed(widget.precision || 0)}`;
        }

        return Number(value).toFixed(widget.precision || 0);

    };

    /* ---------------- METRICS ---------------- */

    const metrics = useMemo(() => {

        if (!filteredData.length) {
            return { total: 0, avg: 0, max: 0 };
        }

        const total = filteredData.reduce((a, b) => a + b.value, 0);
        const max = Math.max(...filteredData.map((d) => d.value));
        const avg = total / filteredData.length;

        return { total, avg, max };

    }, [filteredData]);

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

    if (!filteredData.length) {

        return (
            <div className="flex items-center justify-center h-64 text-gray-400">
                No data available
            </div>
        );

    }

    return (

        <div
            ref={chartRef}
            className="w-full bg-white rounded-lg shadow p-4"
            style={{ minHeight: chartHeight }}
        >

            {/* HEADER */}

            <div className="flex flex-wrap justify-between items-center gap-2 mb-2">

                <div>

                    <h3 className="text-sm font-semibold text-gray-700">
                        {widget.title || "Bar Chart"}
                    </h3>

                    {widget.description && (
                        <p className="text-xs text-gray-400">
                            {widget.description}
                        </p>
                    )}

                </div>

                <div className="flex flex-wrap gap-2">

                    <button
                        onClick={loadChart}
                        className="text-xs bg-gray-200 px-2 py-1 rounded"
                    >
                        Refresh
                    </button>

                    <button
                        onClick={() => setShowChart(!showChart)}
                        className="text-xs bg-gray-200 px-2 py-1 rounded"
                    >
                        Toggle
                    </button>

                    <button
                        onClick={() => setAutoRefresh(!autoRefresh)}
                        className="text-xs bg-gray-200 px-2 py-1 rounded"
                    >
                        {autoRefresh ? "Stop Auto" : "Auto"}
                    </button>

                    <button
                        onClick={exportCSV}
                        className="text-xs bg-gray-200 px-2 py-1 rounded"
                    >
                        CSV
                    </button>

                    <button
                        onClick={exportSVG}
                        className="text-xs bg-gray-200 px-2 py-1 rounded"
                    >
                        SVG
                    </button>

                </div>

            </div>

            {/* FILTER */}

            <div className="flex gap-2 mb-3">

                <input
                    placeholder="Search..."
                    className="border px-2 py-1 text-xs rounded"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="border px-2 py-1 text-xs rounded"
                >
                    <option value="desc">High → Low</option>
                    <option value="asc">Low → High</option>
                </select>

            </div>

            {/* CHART */}

            {showChart && (

                <ResponsiveContainer width="100%" height={chartHeight}>

                    <BarChart
                        data={filteredData}
                        margin={{ top: 20, right: 20, left: 10, bottom: 60 }}
                    >

                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis
                            dataKey="name"
                            tickFormatter={formatLabel}
                            angle={-20}
                            textAnchor="end"
                            interval={0}
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

                        <Bar dataKey="value" radius={[6, 6, 0, 0]}>

                            {filteredData.map((entry, index) => (

                                <Cell
                                    key={index}
                                    fill={
                                        entry.value === metrics.max
                                            ? "#ef4444"
                                            : chartColor
                                    }
                                />

                            ))}

                            {widget.showLabel && (
                                <LabelList dataKey="value" position="top" />
                            )}

                        </Bar>

                    </BarChart>

                </ResponsiveContainer>

            )}

            {/* METRICS */}

            <div className="grid grid-cols-3 text-xs text-gray-500 mt-3">

                <div>Total: {formatTooltip(metrics.total)}</div>

                <div>Average: {formatTooltip(metrics.avg)}</div>

                <div>Max: {formatTooltip(metrics.max)}</div>

            </div>

        </div>

    );

}