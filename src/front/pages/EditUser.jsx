import React, { useState, useContext, useEffect } from "react";
import { StoreContext } from "../hooks/useGlobalReducer";
import { useNavigate } from "react-router-dom";

export const EditUser = () => {
    const { store, dispatch } = useContext(StoreContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        phone: "",
        dni: "",
        role: "",
        is_active: true
    });

    useEffect(() => {
        if (store.singleUser) {
            setFormData({
                full_name: store.singleUser.full_name || "",
                email: store.singleUser.email || "",
                phone: store.singleUser.phone || "",
                dni: store.singleUser.dni || "",
                role: store.singleUser.role || "",
                is_active: store.singleUser.is_active
            });
        } else {
            navigate("/staff");
        }
    }, [store.singleUser]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.role === "admin") {
            const respuesta = window.confirm("¿Estás seguro de que deseas otorgar privilegios de Administrador a este usuario? Esto le dará acceso total al sistema.");
            if (!respuesta) return;
        }

        let backendURL = import.meta.env.VITE_BACKEND_URL;
        if (backendURL.endsWith('/')) backendURL = backendURL.slice(0, -1);
        const url = `${backendURL}/api/users/${store.singleUser.id}`;
        const token = localStorage.getItem("token");

        try {
            const response = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                console.log("%c ¡ACTUALIZACIÓN EXITOSA! ", "background: #222; color: #bada55; font-size: 1.2rem");
                console.log("Mensaje del servidor:", data.msg);
                console.log("Admin que editó (ID):", data.audit.modified_by);
                console.log("Fecha y Hora:", data.audit.date_time);
                console.log("Detalle de cambios realizados:");
                console.table(data.audit.changes);
                if (data.confirmation) console.log("Nota:", data.confirmation);
                dispatch({ type: "set_user", payload: null });
                navigate("/staff");
            } else {
                alert("Server error: " + (data.msg || "Cannot update"));
            }
        } catch (error) {
            console.error("Error updating user:", error);
            alert("Red or CORS error. Check Flask terminal")
        }
    };

    return (
        <div className="container py-5">
            <div className="card shadow border-0 rounded-4 p-4 mx-auto" style={{ maxWidth: "600px" }}>
                <h2 className="fw-bold mb-4">Editar Personal</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label fw-bold">Nombre Completo</label>
                        <input type="text" className="form-control" name="full_name" value={formData.full_name} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label fw-bold">Email</label>
                        <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label fw-bold">Teléfono</label>
                            <input type="text" className="form-control" name="phone" value={formData.phone} onChange={handleChange} />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label fw-bold">DNI</label>
                            <input type="text" className="form-control" name="dni" value={formData.dni} onChange={handleChange} required />
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label fw-bold">Rol</label>
                        <select className="form-select" name="role" value={formData.role} onChange={handleChange}>
                            <option value="usuario">Usuario</option>
                            <option value="admin">Administrador</option>
                        </select>
                    </div>
                    <div className="form-check form-switch mb-4">
                        <input className="form-check-input" type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} id="activeSwitch" />
                        <label className="form-check-label fw-bold" htmlFor="activeSwitch">Usuario Activo</label>
                    </div>

                    <div className="d-flex gap-2">
                        <button type="submit" className="btn btn-dark w-100 py-2 fw-bold">Guardar Cambios</button>
                        <button type="button" className="btn btn-light w-100 py-2 fw-bold" onClick={() => navigate("/staff")}>Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};