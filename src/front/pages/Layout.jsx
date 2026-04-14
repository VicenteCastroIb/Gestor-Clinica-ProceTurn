import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { Outlet } from "react-router-dom"
import ScrollToTop from "../components/ScrollToTop"
import { Navbar } from "../components/Navbar"
import { Sidebar } from "../components/Sidebar"
import { isTokenExpired } from "../utils";
import "../styles/layout.css";

// Base component that maintains the navbar and sidebar throughout the page and the scroll to top functionality.
export const Layout = () => {
    const navigate = useNavigate();
    const { store, dispatch } = useGlobalReducer(); // useGlobalReducer is a custom hook, internally uses useContext(StoreContext)

    useEffect(() => {
        // if token dont exist or token is expired, automatic logout for user, and redirect to "/login", with "navigate" function.
        if (!store.token || isTokenExpired(store.token)) {   
            console.warn("Token no encontrado o expirado al cargar Layout.");
            dispatch({ type: "logout" });
            navigate("/login");
        }
    }, [navigate, dispatch, store.token]);
    return (
        <ScrollToTop>
            <div className="app-wrapper">
                <Sidebar />
                <div className="main-content">
                    <Navbar />
                    <div className="page-body">
                        <Outlet /> {/*Reserved word from React, always shows components in "Outlet" */}
                    </div>
                </div>
            </div>
        </ScrollToTop>
    );
};