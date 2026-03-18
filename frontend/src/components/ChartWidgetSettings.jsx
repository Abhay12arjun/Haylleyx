import { useState, useEffect } from "react";

export default function ChartWidgetSettings({ widget, updateWidget }) {

    const [form, setForm] = useState({
        title: "",
        type: "",
        description: "",
        width: 5,
        height: 5,
        xAxis: "",
        metric: "",
        aggregation: "sum",
        format: "number",
        precision: 0,
        color: "#3b82f6",
        showLabel: false
    });


    useEffect(() => {

        setForm({
            title: widget.title || "Untitled",
            type: widget.type || "Bar Chart",
            description: widget.description || "",
            width: widget.w || 5,
            height: widget.h || 5,
            xAxis: widget.xAxis || "",
            metric: widget.metric || "",
            aggregation: widget.aggregation || "sum",
            format: widget.format || "number",
            precision: widget.precision ?? 0,
            color: widget.color || "#3b82f6",
            showLabel: widget.showLabel || false
        });

    }, [widget]);


    const handleChange = (e) => {

        const { name, value, type, checked } = e.target;

        setForm(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));

    };


    const applySettings = () => {

        updateWidget({
            ...widget,
            title: form.title,
            description: form.description,
            xAxis: form.xAxis,
            metric: form.metric,
            aggregation: form.aggregation,
            format: form.format,
            precision: Number(form.precision),
            color: form.color,
            showLabel: form.showLabel,
            w: Number(form.width),
            h: Number(form.height)
        });

    };


    return (

        <div className="space-y-4">

            <h2 className="text-lg font-semibold">
                Chart Widget Settings
            </h2>


            {/* TITLE */}

            <div>

                <label className="text-sm font-medium">
                    Widget Title *
                </label>

                <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    className="border p-2 w-full rounded"
                />

            </div>


            {/* TYPE */}

            <div>

                <label className="text-sm font-medium">
                    Widget Type
                </label>

                <input
                    value={form.type}
                    readOnly
                    className="border p-2 w-full bg-gray-100 rounded"
                />

            </div>


            {/* DESCRIPTION */}

            <div>

                <label>Description</label>

                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    className="border p-2 w-full rounded"
                />

            </div>


            {/* WIDTH */}

            <div>

                <label>Width (Columns)</label>

                <input
                    type="number"
                    name="width"
                    min="1"
                    value={form.width}
                    onChange={handleChange}
                    className="border p-2 w-full rounded"
                />

            </div>


            {/* HEIGHT */}

            <div>

                <label>Height (Rows)</label>

                <input
                    type="number"
                    name="height"
                    min="1"
                    value={form.height}
                    onChange={handleChange}
                    className="border p-2 w-full rounded"
                />

            </div>


            {/* X AXIS */}

            <div>

                <label>Choose X-Axis Data *</label>

                <select
                    name="xAxis"
                    value={form.xAxis}
                    onChange={handleChange}
                    className="border p-2 w-full rounded"
                >

                    <option value="">Select</option>

                    <option value="product">Product</option>
                    <option value="status">Status</option>
                    <option value="createdBy">Created by</option>
                    <option value="country">Country</option>

                </select>

            </div>


            {/* METRIC */}

            <div>

                <label>Select Metric *</label>

                <select
                    name="metric"
                    value={form.metric}
                    onChange={handleChange}
                    className="border p-2 w-full rounded"
                >

                    <option value="">Select</option>

                    <option value="quantity">Quantity</option>
                    <option value="unitPrice">Unit price</option>
                    <option value="totalAmount">Total amount</option>

                </select>

            </div>


            {/* AGGREGATION */}

            <div>

                <label>Aggregation</label>

                <select
                    name="aggregation"
                    value={form.aggregation}
                    onChange={handleChange}
                    className="border p-2 w-full rounded"
                >

                    <option value="sum">Sum</option>
                    <option value="average">Average</option>
                    <option value="count">Count</option>

                </select>

            </div>


            {/* DATA FORMAT */}

            <div>

                <label>Data Format</label>

                <select
                    name="format"
                    value={form.format}
                    onChange={handleChange}
                    className="border p-2 w-full rounded"
                >

                    <option value="number">Number</option>
                    <option value="currency">Currency</option>

                </select>

            </div>


            {/* DECIMAL PRECISION */}

            <div>

                <label>Decimal Precision</label>

                <input
                    type="number"
                    min="0"
                    name="precision"
                    value={form.precision}
                    onChange={handleChange}
                    className="border p-2 w-full rounded"
                />

            </div>


            {/* COLOR */}

            <div>

                <label>Chart Color</label>

                <input
                    type="color"
                    name="color"
                    value={form.color}
                    onChange={handleChange}
                />

            </div>


            {/* LABEL */}

            <div className="flex items-center gap-2">

                <input
                    type="checkbox"
                    name="showLabel"
                    checked={form.showLabel}
                    onChange={handleChange}
                />

                <label>Show Data Label</label>

            </div>


            <button
                onClick={applySettings}
                className="bg-blue-600 text-white px-4 py-2 rounded"
            >
                Apply Settings
            </button>

        </div>

    );

}