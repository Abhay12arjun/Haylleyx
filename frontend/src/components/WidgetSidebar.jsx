export default function WidgetSidebar({ addWidget }) {

    return (

        <div className="
            w-full 
            md:w-64 
            bg-gray-100 
            p-5 
            border-b md:border-b-0 md:border-r 
            min-h-auto md:min-h-screen
            overflow-x-auto
        ">

            {/* Charts */}

            <h2 className="text-lg font-semibold mb-3">
                Charts
            </h2>

            <p className="text-sm text-gray-500 mb-3">
                (Bar, Line, Area, Scatter)
            </p>

            <div className="
                grid 
                grid-cols-2 
                md:grid-cols-1 
                gap-2
            ">

                <button
                    onClick={() => addWidget("bar")}
                    className="bg-white border p-2 rounded hover:bg-blue-50 text-sm"
                >
                    Bar Chart
                </button>

                <button
                    onClick={() => addWidget("line")}
                    className="bg-white border p-2 rounded hover:bg-blue-50 text-sm"
                >
                    Line Chart
                </button>

                <button
                    onClick={() => addWidget("pie")}
                    className="bg-white border p-2 rounded hover:bg-blue-50 text-sm"
                >
                    Pie Chart
                </button>

                <button
                    onClick={() => addWidget("area")}
                    className="bg-white border p-2 rounded hover:bg-blue-50 text-sm"
                >
                    Area Chart
                </button>

                <button
                    onClick={() => addWidget("scatter")}
                    className="bg-white border p-2 rounded hover:bg-blue-50 text-sm col-span-2 md:col-span-1"
                >
                    Scatter Plot
                </button>

            </div>

            {/* Tables */}

            <h2 className="text-lg font-semibold mt-6 mb-3">
                Tables
            </h2>

            <button
                onClick={() => addWidget("table")}
                className="bg-white border p-2 rounded hover:bg-blue-50 w-full text-sm"
            >
                Table
            </button>

            {/* KPIs */}

            <h2 className="text-lg font-semibold mt-6 mb-3">
                KPIs
            </h2>

            <button
                onClick={() => addWidget("kpi")}
                className="bg-white border p-2 rounded hover:bg-blue-50 w-full text-sm"
            >
                KPI Value
            </button>

        </div>

    );

}