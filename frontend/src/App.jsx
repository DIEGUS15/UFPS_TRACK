import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { BuildingProvider } from "./context/BuildingContext";
import { ReservationProvider } from "./context/ReservationContext";

import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import HomePage from "./pages/HomePage";
import AdminDashboard from "./pages/AdminDashboard";
import WatchmanDashboard from "./pages/WatchmanDashboard";
import StudentDashboard from "./pages/StudentDashboard";

import ProtectedRoute from "./ProtectedRoute";
import Navbar from "./components/Navbar";

function App() {
  return (
    <AuthProvider>
      <BuildingProvider>
        <ReservationProvider>
          <BrowserRouter>
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route element={<ProtectedRoute />}>
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/watchman" element={<WatchmanDashboard />} />
                  <Route path="/student" element={<StudentDashboard />} />
                </Route>
              </Routes>
            </main>
          </BrowserRouter>
        </ReservationProvider>
      </BuildingProvider>
    </AuthProvider>
  );
}

export default App;
