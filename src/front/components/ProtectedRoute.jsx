import { Navigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { store } = useGlobalReducer();

    if (!store.token) {
        return <Navigate to="/login" />;
    }
    if (adminOnly && store.user?.role !== "admin") {
        return <Navigate to="/" />;
    }

    return children;
};

export default ProtectedRoute;
