import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Dashboard } from "./pages/Dashboard";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { EditUser } from "./pages/EditUser";
import ProtectedRoute from "./components/ProtectedRoute";
import { Staff } from "./pages/Staff";
import { Calendar } from "./pages/Calendar";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NewAppointment from "./components/NewAppointment";
import { Patients } from "./pages/Patients";
import { PatientProfile } from "./pages/PatientProfile";
import Chat from "./components/Chat";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
    {/*3 free routes for login and reset-password*/}
      <Route path="/login" element={<Login />} /> 
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/*Routes in parent layout (SideBar - NavBar), 2 ways to protect routes, "ProtectedRoute" is token required. "adminOnly" is token and admin role required.*/}
      <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>}> {/*errorElement for non existing routes.*/}
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
        <Route path="/signup" element={<ProtectedRoute adminOnly><Signup /></ProtectedRoute>} />

        {/* Route "/new=appointment" and "/edit-appointment/:id" use the same component. The ":id" make the route dinamic to autocomplete input for editing more efficiently*/}
        <Route path="/new-appointment" element={<ProtectedRoute><NewAppointment /></ProtectedRoute>} />
        <Route path="/edit-appointment/:id" element={<ProtectedRoute><NewAppointment /></ProtectedRoute>} />
        
        <Route path="/staff" element={<ProtectedRoute adminOnly><Staff /></ProtectedRoute>} />
        <Route path="/editUser" element={<ProtectedRoute adminOnly><EditUser /></ProtectedRoute>} />
        <Route path="/patients" element={<ProtectedRoute ><Patients /></ProtectedRoute>} />
        <Route path="/patient/:id" element={<ProtectedRoute><PatientProfile /></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
      </Route>
    </>
  )
);