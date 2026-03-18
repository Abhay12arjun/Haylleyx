import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children, isAuth }) {

    const location = useLocation();

    //////////////////////////////////////////////////////
    // 🔐 NOT AUTHENTICATED → REDIRECT TO LOGIN
    //////////////////////////////////////////////////////
    if (!isAuth) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location }} // 🔥 remember previous route
            />
        );
    }

    //////////////////////////////////////////////////////
    // ✅ AUTHORIZED
    //////////////////////////////////////////////////////
    return children;
}