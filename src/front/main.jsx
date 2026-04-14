import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { StoreProvider } from './hooks/useGlobalReducer';
import { BackendURL } from './components/BackendURL';

const Main = () => {
    // if "Main" component dont found VITE_BACKEND_URL in .env, cannot run front, then shows component "BackendURL" that contains the URL for vite variable in .env file.
    if (! import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_BACKEND_URL == "") return (
        <React.StrictMode>
            <BackendURL />
        </React.StrictMode>
    );
    // if .env variable is right, run front correctly (StrictMode for warnings. | StoreProvider for global store for all routes. | RouterProvider for routes.)
    return (
        <React.StrictMode>
            <StoreProvider>
                <RouterProvider router={router}>
                </RouterProvider>
            </StoreProvider>
        </React.StrictMode>
    );
}
// Then ReactDOM inyects component "main" to div "root" in index.html. 
ReactDOM.createRoot(document.getElementById('root')).render(<Main />)
