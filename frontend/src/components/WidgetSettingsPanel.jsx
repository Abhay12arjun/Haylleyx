export default function WidgetSettingsPanel({
    widget,
    updateWidget,
    close
}) {

    const update = (field, value) => {

        updateWidget({
            ...widget,
            [field]: value
        });

    };

    return (

        <div className="w-96 bg-white shadow-lg border-l p-6 overflow-auto">

            <h2 className="text-xl font-bold mb-5">
                Widget Settings
            </h2>

            {/* Widget Title */}

            <div className="mb-4">

                <label className="text-sm font-medium">
                    Widget Title
                </label>

                <input
                    value={widget.title || ""}
                    onChange={(e) =>
                        update("title", e.target.value)
                    }
                    className="border p-2 w-full rounded"
                />

            </div>

            {/* Widget Width */}

            <div className="mb-4">

                <label className="text-sm font-medium">
                    Width (Columns)
                </label>

                <input
                    type="number"
                    min="1"
                    value={widget.w || 4}
                    onChange={(e) =>
                        update("w", Number(e.target.value))
                    }
                    className="border p-2 w-full rounded"
                />

            </div>

            {/* Widget Height */}

            <div className="mb-4">

                <label className="text-sm font-medium">
                    Height (Rows)
                </label>

                <input
                    type="number"
                    min="1"
                    value={widget.h || 4}
                    onChange={(e) =>
                        update("h", Number(e.target.value))
                    }
                    className="border p-2 w-full rounded"
                />

            </div>

            {/* Metric Selection */}

            <div className="mb-4">

                <label className="text-sm font-medium">
                    Select Metric
                </label>

                <select
                    value={widget.metric || ""}
                    onChange={(e) =>
                        update("metric", e.target.value)
                    }
                    className="border p-2 w-full rounded"
                >

                    <option value="">Select Metric</option>
                    <option value="customerId">Customer ID</option>
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

            <div className="mb-4">

                <label className="text-sm font-medium">
                    Aggregation
                </label>

                <select
                    value={widget.aggregation || "sum"}
                    onChange={(e) =>
                        update("aggregation", e.target.value)
                    }
                    className="border p-2 w-full rounded"
                >

                    <option value="sum">Sum</option>
                    <option value="average">Average</option>
                    <option value="count">Count</option>

                </select>

            </div>

            {/* Data Format */}

            <div className="mb-4">

                <label className="text-sm font-medium">
                    Data Format
                </label>

                <select
                    value={widget.format || "number"}
                    onChange={(e) =>
                        update("format", e.target.value)
                    }
                    className="border p-2 w-full rounded"
                >

                    <option value="number">Number</option>
                    <option value="currency">Currency</option>

                </select>

            </div>

            {/* Decimal Precision */}

            <div className="mb-4">

                <label className="text-sm font-medium">
                    Decimal Precision
                </label>

                <input
                    type="number"
                    min="0"
                    value={widget.precision || 0}
                    onChange={(e) =>
                        update("precision", Number(e.target.value))
                    }
                    className="border p-2 w-full rounded"
                />

            </div>

            {/* Chart Color */}

            <div className="mb-4">

                <label className="text-sm font-medium">
                    Chart Color
                </label>

                <input
                    type="color"
                    value={widget.color || "#3b82f6"}
                    onChange={(e) =>
                        update("color", e.target.value)
                    }
                />

            </div>

            {/* Show Data Labels */}

            <div className="mb-4 flex items-center gap-2">

                <input
                    type="checkbox"
                    checked={widget.showLabel || false}
                    onChange={(e) =>
                        update("showLabel", e.target.checked)
                    }
                />

                <label className="text-sm">
                    Show Data Label
                </label>

            </div>

            {/* Buttons */}

            <div className="flex justify-between mt-6">

                <button
                    onClick={close}
                    className="bg-gray-300 px-4 py-2 rounded"
                >
                    Cancel
                </button>

                <button
                    onClick={close}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Apply
                </button>

            </div>

        </div>

    );

}