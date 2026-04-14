import { Navigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { isTokenExpired } from "../utils";
// If Routes dont have "adminOnly", then assume is false. If user pass two verifications
// (Token exist and token not expired, and, in adminOnly routes user is admin) the component shows children.
const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { store } = useGlobalReducer();

    if (!store.token || isTokenExpired(store.token)) {
        return <Navigate to="/login" replace />; // replace for clear navigate record and prevent loop
    }
    if (adminOnly && store.user?.role !== "admin") {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
