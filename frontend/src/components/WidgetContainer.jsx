import { FaTrash, FaCog } from "react-icons/fa";

export default function WidgetContainer({ remove, id, children }) {

    return (

        <div className="relative bg-white shadow rounded p-3">

            <div className="absolute right-2 top-2 flex gap-2 opacity-0 hover:opacity-100">

                <button onClick={() => remove(id)}>

                    <FaTrash />

                </button>

                <button>

                    <FaCog />

                </button>

            </div>

            {children}

        </div>

    )

}