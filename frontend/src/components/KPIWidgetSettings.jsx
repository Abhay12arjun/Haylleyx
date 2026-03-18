import { useState, useEffect } from "react";

export default function KPIWidgetSettings({ widget, updateWidget }) {

    const [form, setForm] = useState({
        title: widget.title || "Untitled",
        description: widget.description || "",
        width: widget.w || 2,
        height: widget.h || 2,
        metric: widget.metric || "",
        aggregation: widget.aggregation || "sum",
        format: widget.format || "number",
        precision: widget.precision ?? 0
    });

    useEffect(() => {

        setForm({
            title: widget.title || "Untitled",
            description: widget.description || "",
            width: widget.w || 2,
            height: widget.h || 2,
            metric: widget.metric || "",
            aggregation: widget.aggregation || "sum",
            format: widget.format || "number",
            precision: widget.precision ?? 0
        });

    }, [widget]);

    const handleChange = (e) => {

        const { name, value } = e.target;

        setForm({
            ...form,
            [name]: value
        });

    };

    const applySettings = () => {

        updateWidget({
            ...widget,
            title: form.title,
            description: form.description,
            metric: form.metric,
            aggregation: form.aggregation,
            format: form.format,
            precision: Number(form.precision),
            w: Number(form.width),
            h: Number(form.height)
        });

    };

    return (

        <div className="space-y-4">

            <h2 className="text-lg font-semibold">
                KPI Widget Settings
            </h2>

            {/* Widget Title */}

            <div>
                <label>Widget Title *</label>

                <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    className="border p-2 w-full rounded"
                />
            </div>

            {/* Widget Type */}

            <div>
                <label>Widget Type</label>

                <input
                    value="KPI"
                    readOnly
                    className="border p-2 w-full bg-gray-100"
                />
            </div>

            {/* Description */}

            <div>
                <label>Description</label>

                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    className="border p-2 w-full"
                />
            </div>

            {/* Width */}

            <div>
                <label>Width (Columns)</label>

                <input
                    type="number"
                    min="1"
                    name="width"
                    value={form.width}
                    onChange={handleChange}
                    className="border p-2 w-full"
                />
            </div>

            {/* Height */}

            <div>
                <label>Height (Rows)</label>

                <input
                    type="number"
                    min="1"
                    name="height"
                    value={form.height}
                    onChange={handleChange}
                    className="border p-2 w-full"
                />
            </div>

            {/* Metric */}

            <div>
                <label>Select Metric *</label>

                <select
                    name="metric"
                    value={form.metric}
                    onChange={handleChange}
                    className="border p-2 w-full"
                >
                    <option value="">Select</option>
                    <option value="firstName">Customer Name</option>
                    <option value="email">Email</option>
                    <option value="address">Address</option>
                    <option value="product">Product</option>
                    <option value="createdBy">Created By</option>
                    <option value="status">Status</option>
                    <option value="totalAmount">Total Amount</option>
                    <option value="unitPrice">Unit Price</option>
                    <option value="quantity">Quantity</option>
                </select>
            </div>

            {/* Aggregation */}

            <div>
                <label>Aggregation</label>

                <select
                    name="aggregation"
                    value={form.aggregation}
                    onChange={handleChange}
                    className="border p-2 w-full"
                >
                    <option value="sum">Sum</option>
                    <option value="average">Average</option>
                    <option value="count">Count</option>
                </select>
            </div>

            {/* Data Format */}

            <div>
                <label>Data Format</label>

                <select
                    name="format"
                    value={form.format}
                    onChange={handleChange}
                    className="border p-2 w-full"
                >
                    <option value="number">Number</option>
                    <option value="currency">Currency</option>
                </select>
            </div>

            {/* Decimal Precision */}

            <div>
                <label>Decimal Precision</label>

                <input
                    type="number"
                    min="0"
                    name="precision"
                    value={form.precision}
                    onChange={handleChange}
                    className="border p-2 w-full"
                />
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