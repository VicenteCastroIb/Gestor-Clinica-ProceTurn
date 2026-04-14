import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";


const Login = () => {
    const navigate = useNavigate();
    const { dispatch } = useGlobalReducer();

    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
        isAdmin: false,
        dni: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false); // disable login button in charge

    const handleChange = (e) => {
        const value = e.target.type === "checkbox"? e.target.checked : e.target.value; // define target value between checkbox and other values.
        setLoginData({
            ...loginData, [e.target.name]: value});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(loginData),
            });
            const data = await response.json();
            if (response.ok) {
                dispatch({ type: "login", payload: { token: data.access_token, user: data.user } });
                navigate("/");
            } else { // backend errors
                setError(data.msg || "Error al iniciar sesión");
            }
        } catch (error) {// red errors
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
                            <h2 className="text-center mb-4 fw-bold">Iniciar Sesión</h2>
                            {error && <div className="alert alert-danger">{error}</div>}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input type="email" className="form-control" name="email"
                                        value={loginData.email} onChange={(e) => handleChange(e)} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Contraseña</label>
                                    <input type="password" className="form-control" name="password"
                                        value={loginData.password} onChange={(e) => handleChange(e)} required />
                                </div>
                                <div className="form-check mb-3">
                                    <input type="checkbox" className="form-check-input" id="adminCheck" name="isAdmin"
                                        checked={loginData.isAdmin} onChange={(e) => handleChange(e)} />
                                    <label className="form-check-label" htmlFor="adminCheck"> {/*connect label to input*/}
                                        Soy administrador
                                    </label>
                                </div>
                                {loginData.isAdmin && ( //if user is admin, needs to type DNI.
                                    <div className="mb-3">
                                        <label className="form-label">DNI</label>
                                        <input type="text" className="form-control" name="dni"
                                            value={loginData.dni} onChange={(e) => handleChange(e)} required />
                                    </div>
                                )}
                                <button type="submit" className="btn btn-signup w-100 py-2" disabled={loading}>
                                    {loading ? "Ingresando..." : "Ingresar"}
                                </button>
                                <p className="text-center text-muted mt-3">
                                    <Link to="/forgot-password" className="text-muted text-decoration-none">
                                        ¿Desea recuperar su contraseña?
                                    </Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
    );
};

export default Login;