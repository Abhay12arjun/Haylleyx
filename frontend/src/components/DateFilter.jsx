import { useState } from "react";

export default function DateFilter({ setRange }) {

    const [value, setValue] = useState("All");

    const handleChange = (e) => {

        const val = e.target.value;

        setValue(val);
        setRange(val);

    };

    return (

        <div className="flex items-center gap-2 mb-4">

            <label className="text-sm font-medium">
                Show data for
            </label>

            <select
                value={value}
                onChange={handleChange}
                className="border p-2 rounded"
            >
                <option value="All">All Time</option>
                <option value="Today">Today</option>
                <option value="Last7Days">Last 7 Days</option>
                <option value="Last30Days">Last 30 Days</option>
                <option value="Last90Days">Last 90 Days</option>
            </select>

        </div>

    );

}