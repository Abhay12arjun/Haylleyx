import { useEffect, useState, useRef } from "react";
import { API } from "../api/api";
import { Responsive } from "react-grid-layout";
import { useNavigate } from "react-router-dom";

import WidgetRenderer from "../components/WidgetRenderer";

export default function Dashboard() {

    const [layout, setLayout] = useState([]);
    const [width, setWidth] = useState(1200);
    const containerRef = useRef(null);

    const navigate = useNavigate();

    useEffect(() => {
        loadDashboard();
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                setWidth(containerRef.current.offsetWidth);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const loadDashboard = async () => {
        try {
            const res = await API.get("/dashboard");

            if (res.data?.layout) {

                const cols = 12;

                const updatedLayout = res.data.layout.map((item, index) => {

                    const w = item.w || 4;
                    const h = item.h || 6;

                    const itemsPerRow = Math.floor(cols / w);

                    return {
                        ...item,
                        w,
                        h,
                        x: (index % itemsPerRow) * w,
                        y: Math.floor(index / itemsPerRow) * h
                    };
                });

                setLayout(updatedLayout);
            }

        } catch (error) {
            console.error("Dashboard load error:", error);
        }
    };

    if (!layout.length) {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh]">
                <h2 className="text-xl font-semibold text-gray-700">
                    No widgets configured
                </h2>

                <p className="text-gray-400 mt-2">
                    Click Configure Dashboard to add widgets
                </p>

                <button
                    onClick={() => navigate("/configure")}
                    className="mt-4 bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
                >
                    Configure Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen p-6 bg-gray-100">

            <div ref={containerRef} className="w-full">

                <Responsive
                    width={width}
                    layouts={{ lg: layout }}

                    breakpoints={{
                        lg: 1200,
                        md: 996,
                        sm: 768,
                        xs: 480,
                        xxs: 0
                    }}

                    cols={{
                        lg: 12,
                        md: 10,
                        sm: 6,
                        xs: 4,
                        xxs: 2
                    }}

                    rowHeight={90}
                    margin={[20, 20]}

                    isDraggable={false}
                    isResizable={false}

                    compactType={null}          // 🔥 KEY FIX
                    preventCollision={true}
                    useCSSTransforms={false}   // 🔥 stability fix
                >

                    {layout.map(widget => (
                        <div
                            key={widget.i}
                            className="bg-white rounded-xl shadow-md p-4 h-full overflow-auto"
                        >
                            <WidgetRenderer widget={widget} />
                        </div>
                    ))}

                </Responsive>

            </div>

        </div>
    );
}