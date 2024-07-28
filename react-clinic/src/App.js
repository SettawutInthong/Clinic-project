import "./App.css";
import Login from "./Login";
import NurseHeaderbar from "./nurse/NurseHeaderbar";
import DoctorHeaderbar from "./doctor/DoctorHeaderbar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";
import NurseDashboard from "./nurse/NurseDashboard";
import DoctorDashboard from "./doctor/DoctorDashboard";
import NursePatient from "./nurse/NursePatient";

const App = () => {
  const token = localStorage.getItem("accessToken");
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUserRole(user.Role_ID);
    }
  }, []);

  if (!token) {
    return <Login />;
  }
  return (
    <BrowserRouter>
      {userRole === 1 ? <NurseHeaderbar /> : <DoctorHeaderbar />}
      <Routes>
        {userRole === 1 ? (
          <>
            <Route path="/" element={<NurseDashboard />} />
            <Route path="/nurse_dashboard" element={<NurseDashboard />} />
            <Route path="/nurse_patient" element={<NursePatient />} />
          </>
        ) : userRole === 0 ? (
          <>
            <Route path="/" element={<DoctorDashboard />} />
            <Route path="/doctor_dashboard" element={<DoctorDashboard />} />
          </>
        ) : null}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
