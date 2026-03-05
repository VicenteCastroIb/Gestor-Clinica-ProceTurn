import { useState } from "react";
import "../styles/signup.css";
import useGlobalReducer from "../hooks/useGlobalReducer";

const Signup = () => {
    const { store } = useGlobalReducer();
    const [success, setSuccess] = useState("");
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        role: "",
        dni: "",
        full_name: "",
        phone: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");
        try {
            const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${store.token}`,
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (response.ok) {
                setSuccess("Usuario creado exitosamente");
                setFormData({
                    email: "",
                    password: "",
                    role: "",
                    dni: "",
                    full_name: "",
                    phone: ""
                });

            } else {
                setError(data.msg || "Error al registrar");
            }
        } catch (error) {
            console.error("Error:", error);
            setError("Error de conexión con el servidor");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-5">
                    <div className="signup-card">
                        <h2 className="text-center mb-4 fw-bold">Crear Usuario</h2>
                        <form onSubmit={handleSubmit}>
                            {error && <div className="alert alert-danger">{error}</div>}
                            {success && <div className="alert alert-success">{success}</div>}
                            <div className="mb-3">
                                <label className="form-label">Email</label>
                                <input type="email" className="form-control" name="email"
                                    value={formData.email} onChange={handleChange} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Contraseña</label>
                                <input type="password" className="form-control" name="password"
                                    value={formData.password} onChange={handleChange} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Rol</label>
                                <select className="form-select" name="role" value={formData.role}
                                    onChange={handleChange} required>
                                    <option value="">Seleccionar rol</option>
                                    <option value="admin">Administrador</option>
                                    <option value="user">Usuario</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">DNI</label>
                                <input type="text" className="form-control" name="dni"
                                    value={formData.dni} onChange={handleChange} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Nombre Completo</label>
                                <input type="text" className="form-control" name="full_name"
                                    value={formData.full_name} onChange={handleChange} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Teléfono</label>
                                <input type="text" className="form-control" name="phone"
                                    value={formData.phone} onChange={handleChange} required />
                            </div>
                            <button type="submit" className="btn btn-signup w-100 py-2" disabled={loading}>
                                {loading ? "Creando..." : "Crear Usuario"}
                            </button>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
