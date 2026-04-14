import { useState } from "react";
import "../styles/signup.css";
import useGlobalReducer from "../hooks/useGlobalReducer";
import ConfirmModal from "../components/ConfirmModal";

const Signup = () => {
    const { store } = useGlobalReducer(); //access to global-state
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        role: "",
        dni: "",
        full_name: "",
        phone: ""
    });
    const [loading, setLoading] = useState(false); //prevent double submit
    const [alert, setAlert] = useState({ show: false, msg: "", type: "" });

    const handleChange = (e) => {
        if (alert.show) setAlert({ show: false, msg: "", type: "" }); //remove alert when user is typing
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {  // for submit form.
        e.preventDefault();
        if (formData.role === "admin") { // early return to show modal | admin case, handler direct by modal
            return;
        }
        confirmSubmit(); // if role not admin run Submit
    };

    const confirmSubmit = async () => {
        setLoading(true); //active loading
        setAlert({ show: false, msg: "", type: "" }); //clear alerts before submit
        try {
            const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/signup", { // following code await for the fetch response | Read variable from .env file.
                method: "POST",
                headers: {
                    "Content-Type": "application/json", // tells flaks body coming in JSON format.
                    "Authorization": `Bearer ${store.token}`, // "Bearer " + store.token,   (possible)
                },
                body: JSON.stringify(formData), //convert object to JSON, flask only can read JSON
            });
            const data = await response.json(); //convert response from backend to object
            if (response.ok) {
                setAlert({ show: true, msg: "Usuario creado exitosamente", type: "success" }); // if success, show success alert and clear FormData.
                setFormData({
                    email: "",
                    password: "",
                    role: "",
                    dni: "",
                    full_name: "",
                    phone: ""
                });

            } else { // shows backend responses and set in Alert variable to show in front.
                if (data.msg === "User already exists") {
                    setAlert({ show: true, msg: "El correo electrónico ya está registrado.", type: "danger" });
                } else if (data.msg === "DNI already exists") {
                    setAlert({ show: true, msg: "El DNI ya está registrado en el sistema.", type: "danger" });
                } else if (data.msg === "All fields are required") {
                    setAlert({ show: true, msg: "Todos los campos son obligatorios.", type: "warning" });
                } else {
                    setAlert({ show: true, msg: data.msg || "Error al registrar", type: "danger" });
                }
            }
        } catch (error) { // for server problems
            setAlert({ show: true, msg: "Error de conexión con el servidor.", type: "warning" });
        } finally { // Activate button again
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
                            {alert.show && ( // conditional render.
                                <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert"> {/*alert.type property define alert color*/}
                                    <i className="fa-solid fa-circle-exclamation me-2"></i>
                                    {alert.msg} {/*alert.msg property define alert message*/}
                                    <button type="button" className="btn-close" onClick={() => setAlert({ ...alert, show: false })} aria-label="Close"></button>
                                </div>
                            )}
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
                            <button
                                type={formData.role === "admin" ? "button" : "submit"}
                                className="btn btn-signup w-100 py-2"
                                disabled={loading}
                                data-bs-toggle={formData.role === "admin" ? "modal" : undefined} // toggle activate modal
                                data-bs-target={formData.role === "admin" ? "#confirmAdminModal" : undefined} // target defines what modal activate
                            >
                                {loading ? "Creando..." : "Crear Usuario"}
                            </button>
                        </form>

                    </div>
                </div>
            </div>
            <ConfirmModal
                id="confirmAdminModal"
                title="Confirmar Creación de Admin"
                message="¿Estás seguro de crear este usuario como administrador?"
                warning="Los administradores tienen acceso total al sistema."
                onConfirm={confirmSubmit}
            />
        </div>
    );
};

export default Signup;
