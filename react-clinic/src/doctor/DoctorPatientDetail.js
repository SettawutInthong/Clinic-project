import React, { useState, useEffect } from "react";
import DialogContent from "@mui/material/DialogContent";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Grid,
  Switch,
  TextField,
  Typography,
  Button,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Card, CardContent } from "@mui/material";
import { useNavigate } from "react-router-dom";
import TreatmentHistory from "./TreatmentHistory";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTimePicker, LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { setHours, setMinutes } from "date-fns";

const DoctorPatientDetail = () => {
  const { HN } = useParams();
  const [patientData, setPatientData] = useState(null);
  const [diseaseName, setDiseaseName] = useState("");
  const [allergyDetails, setAllergyDetails] = useState("");
  const [treatmentData, setTreatmentData] = useState({
    Heart_Rate: "",
    Pressure: "",
    Temp: "",
    Height: "",
    Weight: "",
    Symptom: "",
  });
  const [treatmentType, setTreatmentType] = useState("");
  const [historyPopupOpen, setHistoryPopupOpen] = useState(false);
  const [treatmentHistory, setTreatmentHistory] = useState([]);
  const [isContraceptionVisible, setContraceptionVisible] = useState(false);
  const [isPregnancyVisible, setPregnancyVisible] = useState(false);
  const [appointmentPopup, setAppointmentPopup] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState(null);
  const navigate = useNavigate();

  const handleOpenAppointmentPopup = () => {
    setAppointmentPopup(true);
  };

  const handleCloseAppointmentPopup = () => {
    setAppointmentPopup(false);
  };

  const handleOpenHistoryPopup = () => {
    setHistoryPopupOpen(true);
  };

  const handleCloseHistoryPopup = () => {
    setHistoryPopupOpen(false);
  };

  const ConfirmAppointment = async () => {
    if (!HN || !appointmentDate) {
      console.error("กรุณาเลือกวันที่นัดหมาย");
      return;
    }

    try {
      const date = appointmentDate.toISOString().split("T")[0];
      const time = appointmentDate.toLocaleTimeString("it-IT");

      await axios.post(`http://localhost:5000/api/appointments`, {
        HN,
        Queue_Date: date,
        Queue_Time: time,
      });

      console.log("บันทึกการนัดหมายสำเร็จ");
      handleCloseAppointmentPopup();
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการบันทึกการนัดหมาย:", error);
    }
  };

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/patient/${HN}`);
        const patient = response.data.data[0];
        setPatientData(patient);

        if (patient.Disease_ID) {
          const diseaseResponse = await axios.get(
            `http://localhost:5000/api/disease/${patient.Disease_ID}`
          );
          setDiseaseName(diseaseResponse.data.diseaseName);
        }

        if (patient.Allergy_ID) {
          const allergyResponse = await axios.get(
            `http://localhost:5000/api/allergy/${patient.Allergy_ID}`
          );
          setAllergyDetails(allergyResponse.data.allergyDetails);
        }

        const treatmentResponse = await axios.get(
          `http://localhost:5000/api/treatment/${HN}/latest`
        );
        if (treatmentResponse.data.data) {
          setTreatmentData(treatmentResponse.data.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchPatientData();
  }, [HN]);

  const calculateAge = (birthdate) => {
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const renderTreatmentForm = () => {
    if (treatmentType === "ทั่วไป") {
      return (
        <>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              รายละเอียดการรักษา
            </Typography>
          </Grid>
          <TextField
            label="การวินิจฉัยเบื้องต้น"
            fullWidth
            value={treatmentData.Symptom}
            margin="dense"
            multiline
            size="small"
          />
          <TextField
            label="รายละเอียดการรักษา"
            fullWidth
            margin="dense"
            multiline
            rows={10}
          />
          <TextField
            label="รายละเอียดตรวจร่างกาย"
            fullWidth
            margin="dense"
            multiline
            rows={10}
          />
          <Button variant="outlined" onClick={handleOpenAppointmentPopup}>
            นัดหมายผู้ป่วย
          </Button>
        </>
      );
    } else if (treatmentType === "ฉีดยาคุม") {
      return (
        <>
          <Typography variant="h6" gutterBottom>
            ข้อมูลการฉีดยาคุมกำเนิด
          </Typography>
          <FormControl fullWidth margin="dense" size="small">
            <InputLabel>ประเภทของการคุมกำเนิด</InputLabel>
            <Select defaultValue="" label="ประเภทของการคุมกำเนิด">
              <MenuItem value="ยาคุมกำเนิด">ยาคุมกำเนิด</MenuItem>
              <MenuItem value="ฉีดยาคุม">ฉีดยาคุม</MenuItem>
              <MenuItem value="ใส่ห่วงอนามัย">ใส่ห่วงอนามัย</MenuItem>
            </Select>
          </FormControl>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="วันที่ฉีดครั้งล่าสุด"
              inputFormat="dd/MM/yyyy"
              slotProps={{
                textField: {
                  fullWidth: true,
                  margin: "dense",
                  size: "small",
                },
              }}
            />
          </LocalizationProvider>
          <TextField
            label="ปัญหาหรืออาการข้างเคียงจากการใช้ยาคุม"
            fullWidth
            margin="dense"
            size="small"
            multiline
            rows={3}
          />
          <Button variant="outlined" onClick={handleOpenAppointmentPopup}>
            นัดหมายผู้ป่วย
          </Button>
        </>
      );
    }
  };

  useEffect(() => {
    if (historyPopupOpen) {
      const fetchTreatmentHistory = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/treatment/${HN}/history`
          );
          setTreatmentHistory(response.data.data);
        } catch (error) {
          console.error("Error fetching treatment history:", error);
        }
      };
      fetchTreatmentHistory();
    }
  }, [historyPopupOpen, HN]);

  return (
    <Box sx={{ flexGrow: 1, padding: 3 }}>
      {patientData ? (
        <Card>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom align="center">
                  ข้อมูลผู้ป่วย - {patientData.HN}
                </Typography>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="ชื่อ"
                    value={patientData.First_Name}
                    InputProps={{
                      readOnly: true,
                      sx: { padding: "5px" }, // เพิ่ม padding ภายในกรอบ TextField
                    }}
                    fullWidth
                    size="small"
                    margin="dense"
                    disabled
                    sx={{ backgroundColor: "#f5f5f5", mb: 2 }}
                  />
                  <TextField
                    label="นามสกุล"
                    value={patientData.Last_Name}
                    InputProps={{
                      readOnly: true,
                      sx: { padding: "5px" }, // เพิ่ม padding ภายในกรอบ TextField
                    }}
                    fullWidth
                    size="small"
                    margin="dense"
                    disabled
                    sx={{ backgroundColor: "#f5f5f5", mb: 2 }}
                  />
                  <TextField
                    label="เพศ"
                    value={patientData.Gender}
                    InputProps={{
                      readOnly: true,
                      sx: { padding: "5px" },
                    }}
                    fullWidth
                    size="small"
                    margin="dense"
                    disabled
                    sx={{ backgroundColor: "#f5f5f5", mb: 2 }}
                  />
                  <TextField
                    label="วันเกิด"
                    value={new Date(patientData.Birthdate).toLocaleDateString("th-TH")}
                    InputProps={{
                      readOnly: true,
                      sx: { padding: "5px" },
                    }}
                    fullWidth
                    size="small"
                    margin="dense"
                    disabled
                    sx={{ backgroundColor: "#f5f5f5", mb: 2 }}
                  />
                  <TextField
                    label="อายุ"
                    value={calculateAge(patientData.Birthdate)}
                    InputProps={{
                      readOnly: true,
                      sx: { padding: "5px" },
                    }}
                    fullWidth
                    size="small"
                    margin="dense"
                    disabled
                    sx={{ backgroundColor: "#f5f5f5", mb: 2 }}
                  />
                  <TextField
                    label="แพ้ยา"
                    value={allergyDetails || "-"}
                    InputProps={{
                      readOnly: true,
                      sx: { padding: "5px" },
                    }}
                    margin="dense"
                    size="small"
                    fullWidth
                    disabled
                    sx={{ backgroundColor: "#f5f5f5", mb: 2 }}
                  />
                  <TextField
                    label="โรคประจำตัว"
                    value={diseaseName || "-"}
                    InputProps={{
                      readOnly: true,
                      sx: { padding: "5px" },
                    }}
                    fullWidth
                    size="small"
                    margin="dense"
                    disabled
                    sx={{ backgroundColor: "#f5f5f5", mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="อัตราการเต้นหัวใจ"
                    value={treatmentData.Heart_Rate || "-"}
                    InputProps={{
                      readOnly: true,
                      sx: { padding: "5px" },
                    }}
                    fullWidth
                    size="small"
                    margin="dense"
                    disabled
                    sx={{ backgroundColor: "#f5f5f5", mb: 2 }}
                  />
                  <TextField
                    label="ความดัน"
                    value={treatmentData.Pressure || "-"}
                    InputProps={{
                      readOnly: true,
                      sx: { padding: "5px" },
                    }}
                    fullWidth
                    size="small"
                    margin="dense"
                    disabled
                    sx={{ backgroundColor: "#f5f5f5", mb: 2 }}
                  />
                  <TextField
                    label="อุณหภูมิ"
                    value={treatmentData.Temp || "-"}
                    InputProps={{
                      readOnly: true,
                      sx: { padding: "5px" },
                    }}
                    fullWidth
                    size="small"
                    margin="dense"
                    disabled
                    sx={{ backgroundColor: "#f5f5f5", mb: 2 }}
                  />
                </Grid>
              </Grid>

              <Grid item xs={12} style={{ marginTop: "20px" }}>
                <FormControl fullWidth size="small">
                  <InputLabel id="treatment-type-label">ประเภทการรักษา</InputLabel>
                  <Select
                    labelId="treatment-type-label"
                    id="treatment-type"
                    value={treatmentType}
                    label="ประเภทการรักษา"
                    onChange={(e) => setTreatmentType(e.target.value)}
                  >
                    <MenuItem value="ทั่วไป">การรักษาทั่วไป</MenuItem>
                    <MenuItem value="ฉีดยาคุม">การคุมกำเนิด</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} style={{ marginTop: "20px" }}>
                {renderTreatmentForm()}
              </Grid>

              <Grid item xs={12} sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                <Button
                  variant="outlined"
                  style={{
                    color: "#1976d2",
                    borderColor: "#1976d2",
                    textTransform: "none",
                    marginRight: "10px",
                  }}
                  onClick={() => navigate(`/doctor_queue/`)}
                >
                  กลับ
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() =>
                    navigate(`/doctor_addorder/${patientData.HN}/${treatmentData.Order_ID}`)
                  }
                >
                  บันทึกการรักษา
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ) : (
        <p>ไม่พบข้อมูลผู้ป่วย</p>
      )}
    </Box>
  );
};

export default DoctorPatientDetail;
