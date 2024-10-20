import "./App.css";
import Login from "./Login";
import NurseHeaderbar from "./nurse/NurseHeaderbar";
import DoctorHeaderbar from "./doctor/DoctorHeaderbar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";
import NurseDashboard from "./nurse/NurseDashboard";
import NursePatient from "./nurse/NursePatient";
import NurseQueue from "./nurse/NurseQueue";
import NurseOrder from "./nurse/NurseOrder";
import NurseBill from "./nurse/NurseBill";
import DoctorQueue from "./doctor/DoctorQueue";
import DoctorPatientDetail from "./doctor/DoctorPatientDetail";
import TreatmentHistory from "./doctor/TreatmentHistory";
import AddTreatment from "./doctor/AddTreatment";
import AddOrder from "./doctor/AddOrder";
import DoctorPatient from "./doctor/DoctorPatient";
import MedDetail from "./doctor/MedDetail";
import AddStock from "./doctor/AddStock";

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
    <div className="bg">
      <BrowserRouter>
        {userRole === 1 ? <NurseHeaderbar /> : <DoctorHeaderbar />}
        <Routes>
          {userRole === 1 ? (
            <>
              <Route path="/" element={<NurseDashboard />} />
              <Route path="/nurse_dashboard" element={<NurseDashboard />} />
              <Route path="/nurse_patient" element={<NursePatient />} />
              <Route path="/nurse_queue" element={<NurseQueue />} />
              <Route path="/nurse_order" element={<NurseOrder />} />
              <Route path="/nurse_bill" element={<NurseBill />} />
            </>
          ) : userRole === 0 ? (
            <>
              <Route path="/" element={<NurseDashboard />} />
              <Route path="/nurse_dashboard" element={<NurseDashboard />} />
              <Route path="/doctor_queue" element={<DoctorQueue />} />
              <Route path="/doctor_patientdetail/:HN" element={<DoctorPatientDetail />} />
              <Route path="/doctor_treatmenthistory/:HN" element={<TreatmentHistory />} />
              <Route path="/doctor_addtreatment/:HN" element={<AddTreatment />} />
              <Route path="/doctor_addorder/:HN" element={<AddOrder />} />
              <Route path="/doctor_patient" element={<DoctorPatient />} />
              <Route path="/doctor_meddetail" element={<MedDetail />} />
              <Route path="/doctor_addstock" element={<AddStock />} />
            </>
          ) : null}
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
