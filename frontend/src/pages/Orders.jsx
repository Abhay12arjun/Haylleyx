import { useEffect, useState } from "react";
import { API } from "../api/api";
import CreateOrderModal from "../components/CreateOrderModal";

export default function Orders() {

    const [orders, setOrders] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editOrder, setEditOrder] = useState(null);
    const [range, setRange] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchOrders = async () => {

        try {

            setLoading(true);

            const res = await API.get(`/orders?range=${range}`);

            setOrders(res.data);

            setLoading(false);

        } catch (error) {

            console.error(error);
            setLoading(false);

        }

    };

    useEffect(() => {
        fetchOrders();
    }, [range]);

    const deleteOrder = async (id) => {

        if (!window.confirm("Are you sure you want to delete this order?")) return;

        try {

            await API.delete(`/orders/${id}`);

            fetchOrders();

        } catch (error) {

            console.error(error);

        }

    };

    const editHandler = (order) => {

        setEditOrder(order);
        setShowModal(true);

    };

    return (

        <div className="p-4 md:p-6">

            {/* Header */}

            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">

                <h2 className="text-xl md:text-2xl font-bold">
                    Customer Orders
                </h2>

                <div className="flex flex-col sm:flex-row gap-3">

                    {/* Date Filter */}

                    <select
                        className="border p-2 rounded w-full sm:w-auto"
                        value={range}
                        onChange={(e) => setRange(e.target.value)}
                    >

                        <option value="">All time</option>
                        <option value="Today">Today</option>
                        <option value="Last7Days">Last 7 Days</option>
                        <option value="Last30Days">Last 30 Days</option>
                        <option value="Last90Days">Last 90 Days</option>

                    </select>

                    {/* Create Order */}

                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded w-full sm:w-auto"
                        onClick={() => {
                            setEditOrder(null);
                            setShowModal(true);
                        }}
                    >
                        Create Order
                    </button>

                </div>

            </div>


            {/* Orders Table */}

            <div className="bg-white shadow rounded overflow-x-auto">

                <table className="min-w-full text-sm md:text-base">

                    <thead className="bg-gray-100">

                        <tr>

                            <th className="p-3 text-left">Customer</th>
                            <th className="p-3 text-left">Product</th>
                            <th className="p-3 text-left">Quantity</th>
                            <th className="p-3 text-left">Total</th>
                            <th className="p-3 text-left">Status</th>
                            <th className="p-3 text-left">Actions</th>

                        </tr>

                    </thead>

                    <tbody>

                        {loading ? (

                            <tr>
                                <td colSpan="6" className="text-center p-6">
                                    Loading orders...
                                </td>
                            </tr>

                        ) : orders.length === 0 ? (

                            <tr>
                                <td colSpan="6" className="text-center p-6 text-gray-500">
                                    No orders found
                                </td>
                            </tr>

                        ) : (

                            orders.map(order => (

                                <tr
                                    key={order._id}
                                    className="border-t hover:bg-gray-50"
                                >

                                    <td className="p-3">
                                        {order.firstName} {order.lastName}
                                    </td>

                                    <td className="p-3">
                                        {order.product}
                                    </td>

                                    <td className="p-3">
                                        {order.quantity}
                                    </td>

                                    <td className="p-3">
                                        ${order.totalAmount}
                                    </td>

                                    <td className="p-3">

                                        <span className={`px-2 py-1 rounded text-sm

                                            ${order.status === "Pending" && "bg-yellow-200"}
                                            ${order.status === "In progress" && "bg-blue-200"}
                                            ${order.status === "Completed" && "bg-green-200"}

                                        `}>

                                            {order.status}

                                        </span>

                                    </td>

                                    <td className="flex flex-wrap gap-2 p-3">

                                        <button
                                            className="bg-yellow-500 text-white px-3 py-1 rounded"
                                            onClick={() => editHandler(order)}
                                        >
                                            Edit
                                        </button>

                                        <button
                                            className="bg-red-600 text-white px-3 py-1 rounded"
                                            onClick={() => deleteOrder(order._id)}
                                        >
                                            Delete
                                        </button>

                                    </td>

                                </tr>

                            ))

                        )}

                    </tbody>

                </table>

            </div>


            {/* Modal */}

            {showModal && (

                <CreateOrderModal
                    closeModal={() => setShowModal(false)}
                    refreshOrders={fetchOrders}
                    editOrder={editOrder}
                />

            )}

        </div>

    );

}