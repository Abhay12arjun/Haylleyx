import { useEffect, useState, useMemo } from "react";
import { API } from "../api/api";

/* -----------------------------
AVAILABLE COLUMNS
------------------------------*/

const COLUMN_MAP = {
    customerId: "Customer ID",
    customerName: "Customer Name",
    email: "Email",
    phone: "Phone",
    address: "Address",
    orderId: "Order ID",
    product: "Product",
    quantity: "Quantity",
    unitPrice: "Unit Price",
    totalAmount: "Total Amount",
    status: "Status",
    createdBy: "Created By"
};

export default function TableWidget({ widget = {}, range = "All" }) {

    /* -----------------------------
    VALIDATE WIDGET TYPE
    ------------------------------*/

    if (widget.type && widget.type !== "table") return null;

    /* -----------------------------
    SETTINGS FROM WIDGET CONFIG
    ------------------------------*/

    const width = Math.max(widget?.width || 4, 1);
    const height = Math.max(widget?.height || 4, 1);

    const fontSize = Math.min(Math.max(widget?.fontSize || 14, 12), 18);

    const headerColor = widget?.headerBackground || "#54bd95";

    const pageSize = widget?.pagination || 5;

    const enableFilter = widget?.applyFilter || false;

    const columns = widget?.columns || [
        "customerName",
        "product",
        "quantity",
        "unitPrice",
        "totalAmount",
        "status"
    ];

    /* -----------------------------
    STATE
    ------------------------------*/

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const [sortKey, setSortKey] = useState("orderId");
    const [sortDir, setSortDir] = useState("desc");

    /* -----------------------------
    LOAD DATA
    ------------------------------*/

    useEffect(() => {
        load();
    }, [range]);

    const load = async () => {

        try {

            setLoading(true);

            const res = await API.get("/dashboard/table-data", {
                params: { range }
            });

            setOrders(res.data || []);

        } catch (err) {

            console.error("Table load error:", err);

        } finally {

            setLoading(false);

        }

    };

    /* -----------------------------
    FILTER + SORT
    ------------------------------*/

    const filtered = useMemo(() => {

        let data = [...orders];

        if (enableFilter && search) {

            data = data.filter(o =>
                Object.values(o)
                    .join(" ")
                    .toLowerCase()
                    .includes(search.toLowerCase())
            );

        }

        data.sort((a, b) => {

            const A = a[sortKey] ?? "";
            const B = b[sortKey] ?? "";

            if (sortDir === "asc") return A > B ? 1 : -1;
            return A < B ? 1 : -1;

        });

        return data;

    }, [orders, search, sortKey, sortDir, enableFilter]);

    /* -----------------------------
    PAGINATION
    ------------------------------*/

    const paginated = filtered.slice(
        (page - 1) * pageSize,
        page * pageSize
    );

    const totalPages = Math.ceil(filtered.length / pageSize);

    useEffect(() => {
        setPage(1);
    }, [search]);

    /* -----------------------------
    EXPORT CSV
    ------------------------------*/

    const exportCSV = () => {

        const header =
            columns.map(c => COLUMN_MAP[c]).join(",") + "\n";

        const rows = orders
            .map(o =>
                columns
                    .map(c => {

                        if (c === "customerName") {
                            return `${o.firstName || ""} ${o.lastName || ""}`;
                        }

                        return o[c] || "";

                    })
                    .join(",")
            )
            .join("\n");

        const blob = new Blob(
            [header + rows],
            { type: "text/csv" }
        );

        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");

        a.href = url;
        a.download = "table-data.csv";

        a.click();

    };

    /* -----------------------------
    STATUS COLOR
    ------------------------------*/

    const statusColor = status => {

        switch (status) {

            case "Delivered":
                return "bg-green-100 text-green-700";

            case "Pending":
                return "bg-yellow-100 text-yellow-700";

            case "Cancelled":
                return "bg-red-100 text-red-700";

            default:
                return "bg-blue-100 text-blue-600";

        }

    };

    /* -----------------------------
    LOADING
    ------------------------------*/

    if (loading) {

        return (
            <div className="flex justify-center items-center h-40 text-gray-400">
                Loading table...
            </div>
        );

    }

    return (

        <div
            className="bg-white rounded shadow p-4"
            style={{
                gridColumn: `span ${width}`,
                minHeight: height * 70,
                fontSize
            }}
        >

            {/* HEADER */}

            <div className="flex justify-between items-center mb-3">

                <h3 className="font-semibold">
                    {widget?.title || "Untitled"}
                </h3>

                <div className="flex gap-2">

                    <button
                        onClick={load}
                        className="text-xs bg-gray-200 px-2 py-1 rounded"
                    >
                        Refresh
                    </button>

                    <button
                        onClick={exportCSV}
                        className="text-xs bg-blue-500 text-white px-2 py-1 rounded"
                    >
                        Export
                    </button>

                </div>

            </div>

            {/* FILTER */}

            {enableFilter && (

                <input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full border px-3 py-2 rounded mb-3"
                />

            )}

            {/* SORT */}

            <div className="flex gap-2 mb-3 text-xs">

                <select
                    value={sortKey}
                    onChange={e => setSortKey(e.target.value)}
                    className="border px-2 py-1 rounded"
                >
                    {columns.map(c => (
                        <option key={c} value={c}>
                            Sort by {COLUMN_MAP[c]}
                        </option>
                    ))}
                </select>

                <select
                    value={sortDir}
                    onChange={e => setSortDir(e.target.value)}
                    className="border px-2 py-1 rounded"
                >
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                </select>

            </div>

            {/* TABLE */}

            <div className="overflow-auto max-h-64">

                <table className="w-full">

                    <thead style={{ background: headerColor }}>

                        <tr>

                            {columns.map(col => (

                                <th
                                    key={col}
                                    className="p-2 text-left text-white"
                                >
                                    {COLUMN_MAP[col]}
                                </th>

                            ))}

                        </tr>

                    </thead>

                    <tbody>

                        {paginated.map(order => (

                            <tr
                                key={order._id}
                                className="border-t hover:bg-gray-50"
                            >

                                {columns.map(col => (

                                    <td key={col} className="p-2">

                                        {col === "customerName" ? (

                                            `${order.firstName || ""} ${order.lastName || ""}`

                                        ) : col === "status" ? (

                                            <span
                                                className={`px-2 py-1 rounded text-xs ${statusColor(order[col])}`}
                                            >
                                                {order[col]}
                                            </span>

                                        ) : (

                                            order[col]

                                        )}

                                    </td>

                                ))}

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

            {/* PAGINATION */}

            <div className="flex justify-between mt-3 text-xs">

                <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="px-2 py-1 bg-gray-200 rounded disabled:opacity-40"
                >
                    Prev
                </button>

                <span>
                    Page {page} / {totalPages}
                </span>

                <button
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                    className="px-2 py-1 bg-gray-200 rounded disabled:opacity-40"
                >
                    Next
                </button>

            </div>

        </div>

    );

}