import BarChartWidget from "../widgets/BarChartWidget";
import LineChartWidget from "../widgets/LineChartWidget";
import PieChartWidget from "../widgets/PieChartWidget";
import AreaChartWidget from "../widgets/AreaChartWidget";
import ScatterChartWidget from "../widgets/ScatterChartWidget";
import TableWidget from "../widgets/TableWidget";
import KPIWidget from "../widgets/KPIWidget";

export default function WidgetRenderer({ widget, range }) {

    if (!widget) return null;

    let content;

    switch (widget.type) {

        case "bar":
            content = <BarChartWidget widget={widget} range={range} />;
            break;

        case "line":
            content = <LineChartWidget widget={widget} range={range} />;
            break;

        case "pie":
            content = <PieChartWidget widget={widget} range={range} />;
            break;

        case "area":
            content = <AreaChartWidget widget={widget} range={range} />;
            break;

        case "scatter":
            content = <ScatterChartWidget widget={widget} range={range} />;
            break;

        case "table":
            content = <TableWidget widget={widget} range={range} />;
            break;

        case "kpi":
            content = <KPIWidget widget={widget} range={range} />;
            break;

        default:
            content = (
                <div className="flex items-center justify-center h-40 text-gray-400">
                    Unsupported widget
                </div>
            );

    }

    return (

        <div className="bg-white rounded shadow h-full w-full p-3">

            {/* Widget Title */}

            {widget.title && (
                <h3 className="text-sm font-semibold text-gray-600 mb-2">
                    {widget.title}
                </h3>
            )}

            {/* Widget Body */}

            <div className="h-full">

                {content}

            </div>

        </div>

    );

}