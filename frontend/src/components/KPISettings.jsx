import { useState } from "react";

export default function KPISettings({ widget, updateWidget }) {

    const [form, setForm] = useState({
        title: widget.title || "Untitled",
        description: widget.description || "",
        width: widget.w || 2,
        height: widget.h || 2,
        metric: widget.metric || "",
        aggregation: widget.aggregation || "count",
        format: widget.format || "number",
        precision: widget.precision || 0
    });

    const handleChange = (e) => {

        const { name, value } = e.target;

        setForm({
            ...form,
            [name]: value
        });
    };

    const save = () => {

        updateWidget({
            ...widget,
            ...form,
            w: Number(form.width),
            h: Number(form.height)
        });

    };

    return (

        <div className="p-4">

            <h2 className="text-lg font-bold mb-3">
                KPI Settings
            </h2>

            {/* Widget Title */}

            <label>Widget Title</label>

            <input
                name="title"
                value={form.title}
                onChange={handleChange}
                className="border p-2 w-full"
            />

            {/* Widget Type */}

            <label className="mt-3 block">Widget Type</label>

            <input
                value="KPI"
                readOnly
                className="border p-2 w-full bg-gray-100"
            />

            {/* Description */}

            <label className="mt-3 block">Description</label>

            <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="border p-2 w-full"
            />

            {/* Width */}

            <label className="mt-3 block">Width (Columns)</label>

            <input
                type="number"
                name="width"
                min="1"
                value={form.width}
                onChange={handleChange}
                className="border p-2 w-full"
            />

            {/* Height */}

            <label className="mt-3 block">Height (Rows)</label>

            <input
                type="number"
                name="height"
                min="1"
                value={form.height}
                onChange={handleChange}
                className="border p-2 w-full"
            />

            {/* Metric */}

            <label className="mt-3 block">Select Metric</label>

            <select
                name="metric"
                value={form.metric}
                onChange={handleChange}
                className="border p-2 w-full"
            >

                <option value="">Select</option>
                <option value="customerId">Customer ID</option>
                <option value="customerName">Customer Name</option>
                <option value="email">Email Id</option>
                <option value="address">Address</option>
                <option value="orderDate">Order Date</option>
                <option value="product">Product</option>
                <option value="createdBy">Created By</option>
                <option value="status">Status</option>
                <option value="totalAmount">Total Amount</option>
                <option value="unitPrice">Unit Price</option>
                <option value="quantity">Quantity</option>

            </select>

            {/* Aggregation */}

            <label className="mt-3 block">Aggregation</label>

            <select
                name="aggregation"
                value={form.aggregation}
                onChange={handleChange}
                className="border p-2 w-full"
            >

                <option value="sum">Sum</option>
                <option value="avg">Average</option>
                <option value="count">Count</option>

            </select>

            {/* Format */}

            <label className="mt-3 block">Data Format</label>

            <select
                name="format"
                value={form.format}
                onChange={handleChange}
                className="border p-2 w-full"
            >

                <option value="number">Number</option>
                <option value="currency">Currency</option>

            </select>

            {/* Decimal */}

            <label className="mt-3 block">Decimal Precision</label>

            <input
                type="number"
                min="0"
                name="precision"
                value={form.precision}
                onChange={handleChange}
                className="border p-2 w-full"
            />

            <button
                onClick={save}
                className="bg-blue-600 text-white px-4 py-2 mt-4 rounded"
            >
                Save
            </button>

        </div>
    );
}