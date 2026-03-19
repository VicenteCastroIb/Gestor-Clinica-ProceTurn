import { useLocation } from "react-router-dom";
import "../styles/navbar.css";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
	const location = useLocation();
	const navigate = useNavigate()
	const routeNames = {
		"": "Tablero",
		"calendar": "Calendario",
		"patients": "Pacientes",
		"patient": "Ficha de Paciente",
		"staff": "Personal",
		"signup": "Crear Usuario",
		"new-appointment": "Nuevo Turno",
		"edit-appointment": "Editar Turno",
		"editUser": "Editar Personal"
	};

	const currentPath = routeNames[location.pathname.split("/")[1]] || location.pathname.split("/")[1];

	return (
		<nav className="navbar">
			<h2 className="nav-title">{currentPath}</h2>
			<div className="nav-right">
				<div className="search-box">
					<i className="bi bi-search"></i>
					<input type="text" placeholder="Buscar..." />
				</div>
				<button className="btn-appointment" onClick={() => navigate("/new-appointment")}>
					+ Nuevo Turno
				</button>
			</div>
		</nav>
	);
};