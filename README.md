# 🏥 ProceTurn - Sistema Integral de Gestión de Turnos Clínicos

> **Proyecto Final - Bootcamp Full Stack Developer @ 4Geeks Academy**

ProceTurn es una plataforma web B2B diseñada para modernizar y optimizar la asignación de turnos para procedimientos médicos en clínicas. Desarrollada para reemplazar la gestión manual e ineficiente, la aplicación centraliza agendas, historiales de pacientes, comunicación por chat (WhatsApp) y gestión del personal, apoyada por alertas automáticas e Inteligencia Artificial.

![ProceTurn Dashboard](./docs/assets/Dashboard.jpg)
![ProceTurn Dashboard](./docs/assets/Calendar.jpg)
![ProceTurn Dashboard](./docs/assets/Patients.jpg)
![ProceTurn Dashboard](./docs/assets/Chat.jpg)
![ProceTurn Dashboard](./docs/assets/Staff.jpg)
![ProceTurn Dashboard](./docs/assets/EditUser.jpg)
![ProceTurn Dashboard](./docs/assets/NewAppointment.jpg)

## 🚀 Mis Contribuciones (Vicente Castro)

Como desarrollador **Full Stack** en este proyecto colaborativo, participé activamente en todo el ciclo de vida del software (End-to-End). Mis responsabilidades y desarrollos principales incluyeron:

### Frontend (React + Vite + Bootstrap)

- **Diseño e implementación de UI/UX:** Construcción desde cero de las vistas principales de la aplicación asegurando un diseño limpio, moderno y responsivo.
- **Módulo "Tablero" (Dashboard):** Creación del panel de control principal que permite visualizar métricas diarias, administrar el estado de los turnos en tiempo real (Confirmado, Demorado, Cancelado) y reasignar horarios.
- **Módulo "Calendario":** Desarrollo de la vista interactiva mensual para pronóstico de disponibilidad y bloqueo de fechas.
- **Módulo "Personal":** Creación del panel de administración (CRUD) para la gestión del staff administrativo, control de roles y reseteo de credenciales.

### Backend & Base de Datos (Python + Flask + PostgreSQL)

- **Modelado de Datos:** Diseño y construcción de modelos relacionales clave utilizando **SQLAlchemy**.
- **Desarrollo de API REST:** Creación de múltiples endpoints en **Flask** para conectar el cliente (React) con la base de datos de manera eficiente.
- **Seguridad y Autenticación:** Implementación de flujos de seguridad utilizando tokens **JWT** para proteger rutas privadas y gestionar sesiones de administradores.

---

## 🛠️ Stack Tecnológico y Arquitectura

El sistema está construido sobre una arquitectura moderna y escalable, integrando servicios externos para potenciar sus funcionalidades.

**Frontend:**
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white) ![Bootstrap](https://img.shields.io/badge/bootstrap-%238511FA.svg?style=for-the-badge&logo=bootstrap&logoColor=white) ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E) ![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)

**Backend & DB:**
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54) ![Flask](https://img.shields.io/badge/flask-%23000.svg?style=for-the-badge&logo=flask&logoColor=white) ![PostgreSQL](https://img.shields.io/badge/postgresql-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white) ![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)

**Integraciones:**
![Twilio](https://img.shields.io/badge/Twilio-F22F46?style=for-the-badge&logo=Twilio&logoColor=white) ![Gemini AI](https://img.shields.io/badge/Gemini_IA-8E75B2?style=for-the-badge&logo=googlebard&logoColor=white)

<!-- NOTA PARA VICENTE: Sube la imagen de tu diagrama de Arquitectura aquí, ¡suma muchísimos puntos! -->

![Arquitectura ProceTurn](./docs/assets/ArchitectureDiagram.jpg)


---

## 📌 Funcionalidades Destacadas

- 📊 **Dashboard de Control:** Monitoreo en tiempo real de la capacidad clínica diaria.
- 📅 **Gestión Avanzada de Agendas:** Cambios de estado dinámicos (posponer, demorar, cancelar) con impacto visual inmediato.
- 👥 **Base de Pacientes:** Registro completo e historial médico/turnos para toma de decisiones informadas (ej. ratio de cancelaciones).
- 💬 **Comunicación Omnicanal (Twilio):** Vista de chat integrada directamente en la aplicación para interactuar con los pacientes vía WhatsApp.
- 🤖 **Asistencia con IA (Gemini):** Sugerencias inteligentes integradas en el flujo de trabajo.
- 🔐 **Gestión de Accesos:** Panel de administración exclusivo para el personal con control total sobre la plataforma.

---

## 🤝 Equipo de Desarrollo

Este proyecto fue desarrollado bajo metodologías ágiles simulando un entorno de trabajo real, junto a mis compañeros:

- **Vicente Castro Ibarra** - _Full Stack Developer_ - [GitHub](https://github.com/VicenteCastroIb)
- **Jaime Vega** - _Full Stack Developer_ - [GitHub](https://github.com/Drokko-Dev)
- **Francisco M. Gómez** - _Full Stack Developer_ - [GitHub](https://github.com/Fragoz22)
- **Laureano González** - _Full Stack Developer_ - [GitHub](https://github.com/laureanogonzalez02)