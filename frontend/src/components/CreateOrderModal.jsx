import { useState, useEffect } from "react";
import { API } from "../api/api";

export default function CreateOrderModal({
    closeModal,
    refreshOrders,
    editOrder
}) {

    const initialForm = {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
        product: "",
        quantity: 1,
        unitPrice: 0,
        totalAmount: 0,
        status: "Pending",
        createdBy: ""
    };

    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState({});


    // Load data when editing
    useEffect(() => {

        if (editOrder) {

            setForm({
                firstName: editOrder.firstName || "",
                lastName: editOrder.lastName || "",
                email: editOrder.email || "",
                phone: editOrder.phone || "",
                address: editOrder.address || "",
                city: editOrder.city || "",
                state: editOrder.state || "",
                postalCode: editOrder.postalCode || "",
                country: editOrder.country || "",
                product: editOrder.product || "",
                quantity: editOrder.quantity || 1,
                unitPrice: editOrder.unitPrice || 0,
                totalAmount: editOrder.totalAmount || 0,
                status: editOrder.status || "Pending",
                createdBy: editOrder.createdBy || ""
            });

        }

    }, [editOrder]);


    const handleChange = (e) => {

        const { name, value } = e.target;

        const updated = {
            ...form,
            [name]: value
        };

        updated.totalAmount =
            Number(updated.quantity) * Number(updated.unitPrice);

        setForm(updated);

        setErrors({
            ...errors,
            [name]: ""
        });
    };


    // Form validation
    const validate = () => {

        const newErrors = {};

        if (!form.firstName.trim())
            newErrors.firstName = "First name is required";

        if (!form.lastName.trim())
            newErrors.lastName = "Last name is required";

        if (!form.email.trim())
            newErrors.email = "Email is required";

        if (form.email && !/\S+@\S+\.\S+/.test(form.email))
            newErrors.email = "Invalid email";

        if (!form.phone.trim())
            newErrors.phone = "Phone number is required";

        if (form.quantity < 1)
            newErrors.quantity = "Quantity must be at least 1";

        if (!form.product)
            newErrors.product = "Please select a product";

        if (!form.createdBy)
            newErrors.createdBy = "Please select creator";

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!validate()) return;

        try {

            if (editOrder) {

                await API.put(`/orders/${editOrder._id}`, form);

            } else {

                await API.post("/orders", form);

            }

            refreshOrders();
            closeModal();

        } catch (error) {

            console.error(error);
            alert("Something went wrong");

        }
    };


    return (

        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">

            <div className="bg-white p-6 w-[700px] rounded-lg shadow-lg">

                <h2 className="text-xl font-bold mb-4">

                    {editOrder ? "Edit Order" : "Create Order"}

                </h2>


                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">

                    {/* First Name */}

                    <div>
                        <input
                            name="firstName"
                            value={form.firstName}
                            placeholder="First Name"
                            className="border p-2 w-full"
                            onChange={handleChange}
                        />
                        {errors.firstName &&
                            <p className="text-red-500 text-sm">{errors.firstName}</p>}
                    </div>


                    {/* Last Name */}

                    <div>
                        <input
                            name="lastName"
                            value={form.lastName}
                            placeholder="Last Name"
                            className="border p-2 w-full"
                            onChange={handleChange}
                        />
                        {errors.lastName &&
                            <p className="text-red-500 text-sm">{errors.lastName}</p>}
                    </div>


                    {/* Email */}

                    <div>
                        <input
                            name="email"
                            value={form.email}
                            placeholder="Email"
                            className="border p-2 w-full"
                            onChange={handleChange}
                        />
                        {errors.email &&
                            <p className="text-red-500 text-sm">{errors.email}</p>}
                    </div>


                    {/* Phone */}

                    <div>
                        <input
                            name="phone"
                            value={form.phone}
                            placeholder="Phone"
                            className="border p-2 w-full"
                            onChange={handleChange}
                        />
                        {errors.phone &&
                            <p className="text-red-500 text-sm">{errors.phone}</p>}
                    </div>


                    {/* Address */}

                    <input
                        name="address"
                        value={form.address}
                        placeholder="Street Address"
                        className="border p-2 col-span-2"
                        onChange={handleChange}
                    />


                    {/* City */}

                    <input
                        name="city"
                        value={form.city}
                        placeholder="City"
                        className="border p-2"
                        onChange={handleChange}
                    />


                    {/* State */}

                    <input
                        name="state"
                        value={form.state}
                        placeholder="State / Province"
                        className="border p-2"
                        onChange={handleChange}
                    />


                    {/* Postal Code */}

                    <input
                        name="postalCode"
                        value={form.postalCode}
                        placeholder="Postal Code"
                        className="border p-2"
                        onChange={handleChange}
                    />


                    {/* Country */}

                    <select
                        name="country"
                        value={form.country}
                        className="border p-2"
                        onChange={handleChange}
                    >
                        <option value="">Country</option>
                        <option>United States</option>
                        <option>Canada</option>
                        <option>Australia</option>
                        <option>Singapore</option>
                        <option>Hong Kong</option>
                    </select>


                    {/* Product */}

                    <div>
                        <select
                            name="product"
                            value={form.product}
                            className="border p-2 w-full"
                            onChange={handleChange}
                        >
                            <option value="">Choose Product</option>
                            <option>Fiber Internet 300 Mbps</option>
                            <option>5G Unlimited Mobile Plan</option>
                            <option>Fiber Internet 1 Gbps</option>
                            <option>Business Internet 500 Mbps</option>
                            <option>VoIP Corporate Package</option>
                        </select>

                        {errors.product &&
                            <p className="text-red-500 text-sm">{errors.product}</p>}
                    </div>


                    {/* Quantity */}

                    <div>
                        <input
                            type="number"
                            name="quantity"
                            value={form.quantity}
                            min="1"
                            className="border p-2 w-full"
                            onChange={handleChange}
                        />
                        {errors.quantity &&
                            <p className="text-red-500 text-sm">{errors.quantity}</p>}
                    </div>


                    {/* Unit Price */}

                    <input
                        type="number"
                        name="unitPrice"
                        value={form.unitPrice}
                        placeholder="Unit Price"
                        className="border p-2"
                        onChange={handleChange}
                    />


                    {/* Total */}

                    <input
                        name="totalAmount"
                        value={form.totalAmount}
                        readOnly
                        className="border p-2 bg-gray-100"
                    />


                    {/* Status */}

                    <select
                        name="status"
                        value={form.status}
                        className="border p-2"
                        onChange={handleChange}
                    >
                        <option>Pending</option>
                        <option>In progress</option>
                        <option>Completed</option>
                    </select>


                    {/* Created By */}

                    <div>
                        <select
                            name="createdBy"
                            value={form.createdBy}
                            className="border p-2 w-full"
                            onChange={handleChange}
                        >
                            <option value="">Created By</option>
                            <option>Mr. Michael Harris</option>
                            <option>Mr. Ryan Cooper</option>
                            <option>Ms. Olivia Carter</option>
                            <option>Mr. Lucas Martin</option>
                        </select>

                        {errors.createdBy &&
                            <p className="text-red-500 text-sm">{errors.createdBy}</p>}
                    </div>


                    {/* Buttons */}

                    <div className="col-span-2 flex justify-end gap-3 mt-4">

                        <button
                            type="button"
                            onClick={closeModal}
                            className="bg-gray-400 text-white px-4 py-2 rounded"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded"
                        >
                            {editOrder ? "Update Order" : "Create Order"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}