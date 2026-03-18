import { useEffect, useState } from "react";
import { API } from "../api/api";

export default function KPIWidget({ widget, range }) {

    const [value, setValue] = useState(0);
    const [previous, setPrevious] = useState(0);
    const [loading, setLoading] = useState(true);
    const [updatedAt, setUpdatedAt] = useState("");

    useEffect(() => {

        loadKPI();

    }, [widget, range]);


    const loadKPI = async () => {

        try {

            setLoading(true);

            const res = await API.get("/dashboard/kpi", {

                params: {
                    metric: widget.metric || "totalAmount",
                    aggregation: widget.aggregation || "sum",
                    range: range || "All"
                }

            });

            setValue(res.data.value || 0);
            setPrevious(res.data.previous || 0);

            setUpdatedAt(new Date().toLocaleTimeString());

        } catch (error) {

            console.error("KPI error:", error);

        } finally {

            setLoading(false);

        }

    };


    /* -------------------------
       CALCULATE TREND
    ------------------------- */

    const calculateTrend = () => {

        if (!previous) return "0.00%";

        const diff = ((value - previous) / previous) * 100;

        return diff.toFixed(2) + "%";

    };


    /* -------------------------
       FORMAT VALUE
    ------------------------- */

    const formatValue = () => {

        const precision = widget.precision ?? 0;

        if (widget.format === "currency") {

            return new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: precision
            }).format(value);

        }

        return Number(value).toFixed(precision);

    };


    if (loading) {

        return (
            <div className="flex items-center justify-center h-36 text-gray-400">
                Loading KPI...
            </div>
        );

    }


    return (

        <div className="bg-white shadow rounded-xl p-6 h-full flex flex-col justify-between">

            {/* HEADER */}

            <div className="flex justify-between items-center">

                <h3 className="text-sm font-semibold text-gray-500">

                    {widget.title || "KPI"}

                </h3>

                <button
                    onClick={loadKPI}
                    className="text-xs bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
                >
                    Refresh
                </button>

            </div>


            {/* VALUE */}

            <div>

                <h1 className="text-4xl font-bold text-indigo-600">

                    {formatValue()}

                </h1>

                {/* TREND */}

                <p className="text-sm text-gray-400 mt-1">

                    {calculateTrend()} vs previous

                </p>

            </div>


            {/* DESCRIPTION */}

            {widget.description && (

                <p className="text-xs text-gray-400">

                    {widget.description}

                </p>

            )}


            {/* METRIC INFO */}

            <div className="text-xs text-gray-400 mt-2">

                Metric: <b>{widget.metric || "totalAmount"}</b>

                {" | "}

                Aggregation: <b>{widget.aggregation || "sum"}</b>

            </div>


            {/* UPDATED TIME */}

            <div className="text-xs text-gray-400 mt-2">

                Updated: {updatedAt}

            </div>

        </div>

    );

}