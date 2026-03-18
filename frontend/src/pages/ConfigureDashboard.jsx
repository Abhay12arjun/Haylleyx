import { useEffect, useState } from "react";
import { API } from "../api/api";

import { Responsive } from "react-grid-layout";

import WidgetSidebar from "../components/WidgetSidebar";
import WidgetRenderer from "../components/WidgetRenderer";
import WidgetSettingsPanel from "../components/WidgetSettingsPanel";
import DateFilter from "../components/DateFilter";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

export default function ConfigureDashboard() {

    const [widgets, setWidgets] = useState([]);
    const [activeWidget, setActiveWidget] = useState(null);
    const [range, setRange] = useState("All");

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {

        try {

            const res = await API.get("/dashboard");

            if (res.data?.layout) {
                setWidgets(res.data.layout);
            }

        } catch (error) {
            console.error("Dashboard load error", error);
        }

    };

    const addWidget = (type) => {

        const widget = {
            i: Date.now().toString(),
            type,
            x: 0,
            y: Infinity,
            w: 6,
            h: 5,
            title: "Untitled"
        };

        setWidgets(prev => [...prev, widget]);

    };

    const deleteWidget = (id) => {

        if (!window.confirm("Delete this widget?")) return;

        setWidgets(prev =>
            prev.filter(w => w.i !== id)
        );

    };

    const updateWidget = (updatedWidget) => {

        setWidgets(prev =>
            prev.map(w =>
                w.i === updatedWidget.i ? updatedWidget : w
            )
        );

    };

    const onLayoutChange = (layout) => {

        setWidgets(prev =>
            prev.map(w => {

                const updated = layout.find(l => l.i === w.i);

                return updated ? { ...w, ...updated } : w;

            })
        );

    };

    const saveDashboard = async () => {

        try {

            await API.post("/dashboard/save", {
                layout: widgets
            });

            alert("Dashboard saved");

        } catch (error) {

            console.error("Save error", error);

        }

    };

    return (

        <div className="flex flex-col md:flex-row min-h-screen">

            {/* Sidebar */}

            <WidgetSidebar addWidget={addWidget} />

            {/* Canvas */}

            <div className="flex-1 p-4 md:p-6 overflow-auto">

                <DateFilter setRange={setRange} />

                <div className="w-full">

                    <Responsive

                        layouts={{ lg: widgets }}

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

                        rowHeight={70}

                        width={1200}

                        isDraggable
                        isResizable

                        onLayoutChange={onLayoutChange}

                        className="mt-4"

                    >

                        {widgets.map(widget => (

                            <div
                                key={widget.i}
                                className="bg-white shadow rounded p-3 relative group"
                            >

                                {/* Hover Controls */}

                                <div className="absolute top-2 right-2 hidden group-hover:flex gap-2">

                                    <button
                                        onClick={() => setActiveWidget(widget)}
                                        className="bg-gray-200 px-2 py-1 rounded"
                                    >
                                        ⚙
                                    </button>

                                    <button
                                        onClick={() => deleteWidget(widget.i)}
                                        className="bg-red-500 text-white px-2 py-1 rounded"
                                    >
                                        🗑
                                    </button>

                                </div>

                                <WidgetRenderer
                                    widget={widget}
                                    range={range}
                                />

                            </div>

                        ))}

                    </Responsive>

                </div>

                {/* Save Button */}

                <button
                    onClick={saveDashboard}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 mt-6 rounded"
                >
                    Save Configuration
                </button>

            </div>

            {/* Settings Panel */}

            {activeWidget && (

                <div className="fixed inset-0 flex justify-end bg-black bg-opacity-30">

                    <WidgetSettingsPanel
                        widget={widgets.find(w => w.i === activeWidget.i)}

                        updateWidget={(updated) => {

                            updateWidget(updated);
                            setActiveWidget(updated);

                        }}

                        close={() => setActiveWidget(null)}
                    />

                </div>

            )}

        </div>

    );

}