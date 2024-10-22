import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  Paper,
  Typography,
  Grid,
  TextField,
  DialogContent,
  CircularProgress,
  ButtonGroup,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useNavigate } from "react-router-dom";

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
  const [treatmentType, setTreatmentType] = useState(""); // สร้าง state สำหรับประเภทการรักษา
  const [historyPopupOpen, setHistoryPopupOpen] = useState(false);
  const [treatmentHistory, setTreatmentHistory] = useState([]);
  const [isContraceptionVisible, setContraceptionVisible] = useState(false); // สถานะสำหรับเปิด/ปิดข้อ 1
  const [isPregnancyVisible, setPregnancyVisible] = useState(false); // สถานะสำหรับเปิด/ปิดข้อ 2
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
        const response = await axios.get(
          `http://localhost:5000/api/patient/${HN}`
        );
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

  
  return (
    <Box sx={{ flexGrow: 1, padding: 3 }}>
      <Paper sx={{ padding: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <ButtonGroup variant="outlined" color="primary">
            <Button onClick={() => navigate(`/doctor_treatmenthistory/${HN}`)}>
              ไปยังประวัติการรักษา
              <PlayArrowIcon />
            </Button>
            <Button onClick={() => navigate(`/doctor_addtreatment/${HN}`)}>
              ไปยังบันทึกการรักษา
              <PlayArrowIcon />
              <PlayArrowIcon />
            </Button>
            <Button onClick={() => navigate(`/doctor_addorder/${HN}`)}>
              ไปยังรายการจ่ายยา
              <PlayArrowIcon />
              <PlayArrowIcon />
              <PlayArrowIcon />
            </Button>
          </ButtonGroup>
        </Box>
        {patientData ? (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                ข้อมูลผู้ป่วย - {patientData.HN}
              </Typography>
            </Grid>

            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="ชื่อ"
                    value={`${patientData.First_Name} ${patientData.Last_Name}`}
                    InputProps={{ readOnly: true }}
                    fullWidth
                    size="small"
                    margin="dense"
                    disabled
                    sx={{ backgroundColor: "#f5f5f5" }}
                  />
                  <TextField
                    label="วันเกิด"
                    value={new Date(patientData.Birthdate).toLocaleDateString(
                      "th-TH"
                    )}
                    InputProps={{ readOnly: true }}
                    fullWidth
                    size="small"
                    margin="dense"
                    disabled
                    sx={{ backgroundColor: "#f5f5f5" }}
                  />
                  <TextField
                    label="อายุ"
                    value={calculateAge(patientData.Birthdate)}
                    InputProps={{ readOnly: true }}
                    fullWidth
                    size="small"
                    margin="dense"
                    disabled
                    sx={{ backgroundColor: "#f5f5f5" }}
                  />
                  <TextField
                    label="เพศ"
                    value={patientData.Gender}
                    InputProps={{ readOnly: true }}
                    fullWidth
                    size="small"
                    margin="dense"
                    disabled
                    sx={{ backgroundColor: "#f5f5f5" }}
                  />
                  <TextField
                    label="แพ้ยา"
                    value={patientData.Allergy || "-"}
                    InputProps={{ readOnly: true }}
                    fullWidth
                    size="small"
                    margin="dense"
                    disabled
                    sx={{ backgroundColor: "#f5f5f5" }}
                  />
                  <TextField
                    label="โรคประจำตัว"
                    value={patientData.Disease || "-"}
                    InputProps={{ readOnly: true }}
                    fullWidth
                    size="small"
                    margin="dense"
                    disabled
                    sx={{ backgroundColor: "#f5f5f5" }}
                  />
                  <TextField
                    label="อัตราการเต้นหัวใจ"
                    value={treatmentData.Heart_Rate || "-"}
                    InputProps={{ readOnly: true }}
                    fullWidth
                    size="small"
                    margin="dense"
                    disabled
                    sx={{ backgroundColor: "#f5f5f5" }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="ความดัน"
                    value={treatmentData.Pressure || "-"}
                    InputProps={{ readOnly: true }}
                    fullWidth
                    size="small"
                    margin="dense"
                    disabled
                    sx={{ backgroundColor: "#f5f5f5" }}
                  />
                  <TextField
                    label="อุณหภูมิ"
                    value={treatmentData.Temp || "-"}
                    InputProps={{ readOnly: true }}
                    fullWidth
                    size="small"
                    margin="dense"
                    disabled
                    sx={{ backgroundColor: "#f5f5f5" }}
                  />
                  <TextField
                    label="น้ำหนัก"
                    value={treatmentData.Weight || "-"}
                    InputProps={{ readOnly: true }}
                    fullWidth
                    size="small"
                    margin="dense"
                    disabled
                    sx={{ backgroundColor: "#f5f5f5" }}
                  />
                  <TextField
                    label="ส่วนสูง"
                    value={treatmentData.Height || "-"}
                    InputProps={{ readOnly: true }}
                    fullWidth
                    size="small"
                    margin="dense"
                    disabled
                    sx={{ backgroundColor: "#f5f5f5" }}
                  />
                  <TextField
                    label="อาการ"
                    value={treatmentData.Symptom || "-"}
                    InputProps={{ readOnly: true }}
                    fullWidth
                    size="small"
                    margin="dense"
                    multiline
                    rows={5.5}
                    disabled
                    sx={{ backgroundColor: "#f5f5f5" }}
                  />
                </Grid>
              </Grid>
            </DialogContent>

            <Grid item xs={12}>
              <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate(`/doctor_queue/`)}
                  style={{
                    color: "#1976d2",
                    borderColor: "#1976d2",
                    marginRight: "10px",
                  }}
                >
                  กลับ
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate(`/doctor_treatmenthistory/${HN}`)}
                >
                  ต่อไป
                </Button>
              </Box>
            </Grid>
          </Grid>
        ) : (
          <Typography>ไม่พบข้อมูลผู้ป่วย</Typography>
        )}
      </Paper>
    </Box>
  );
};

export default DoctorPatientDetail;
