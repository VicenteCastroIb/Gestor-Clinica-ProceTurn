import { Navigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { isTokenExpired } from "../utils";

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { store } = useGlobalReducer();

    if (!store.token || isTokenExpired(store.token)) {
        return <Navigate to="/login" replace />;
    }
    if (adminOnly && store.user?.role !== "admin") {
        return <Navigate to="/" />;
    }

    return children;
};

export default ProtectedRoute;
