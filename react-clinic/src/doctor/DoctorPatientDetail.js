import React, { useState, useEffect } from "react";
import DialogContent from "@mui/material/DialogContent";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Grid,
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
  const navigate = useNavigate();

  const handleOpenHistoryPopup = () => {
    setHistoryPopupOpen(true);
  };

  const handleCloseHistoryPopup = () => {
    setHistoryPopupOpen(false);
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

  // ฟังก์ชันสำหรับแสดงฟอร์มตามประเภทการรักษา
  const renderTreatmentForm = () => {
    if (treatmentType === "ทั่วไป") {
      return (
        <>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleOpenHistoryPopup} // เมื่อกดปุ่มนี้จะเปิด popup
          >
            ดูประวัติการรักษา
          </Button>
          <TextField
            label="อาการ"
            fullWidth
            value={treatmentData.Symptom}
            margin="dense"
            multiline
            rows={4}
          />
          <TextField
            label="อัตราการเต้นหัวใจ"
            fullWidth
            value={treatmentData.Heart_Rate}
            margin="dense"
          />
          <TextField
            label="ความดัน"
            fullWidth
            value={treatmentData.Pressure}
            margin="dense"
          />
          <TextField
            label="อุณหภูมิ"
            fullWidth
            value={treatmentData.Temp}
            margin="dense"
          />
        </>
      );
    } else if (treatmentType === "ฉีดยาคุม") {
      return (
        <>
          <Grid item xs={12} sm={6}></Grid>
          <TextField
            label="วันที่ฉีดยาคุม"
            fullWidth
            margin="dense"
            size="small"
          />
          <TextField
            label="ประจำเดือนครั้งสุดท้าย"
            fullWidth
            margin="dense"
            size="small"
          />
          <TextField
            label="ยี่ห้อยาคุม"
            fullWidth
            margin="dense"
            size="small"
          />
          <TextField
            label="รายละเอียดการรักษา"
            fullWidth
            margin="dense"
            multiline
            rows={4}
          />
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
          setTreatmentHistory(response.data.data); // เก็บข้อมูลประวัติการรักษาใน state
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
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography
                  variant="h6"
                  gutterBottom
                  style={{ flexGrow: 1, textAlign: "center" }}
                >
                  ข้อมูลผู้ป่วย - {patientData.HN}
                </Typography>
              </Grid>

              <DialogContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box display="flex" flexDirection="row" gap={2}>
                      <TextField
                        label="คำนำหน้า"
                        value={`${patientData.Title}`}
                        InputProps={{ readOnly: true }}
                        fullWidth
                        size="small"
                        margin="dense"
                        disabled
                        sx={{ backgroundColor: "#f5f5f5" }} // เปลี่ยนสีพื้นหลังให้เป็นสีเทาอ่อน
                      />
                      <TextField
                        label="เพศ"
                        value={`${patientData.Gender}`}
                        InputProps={{ readOnly: true }}
                        fullWidth
                        size="small"
                        margin="dense"
                        disabled
                        sx={{ backgroundColor: "#f5f5f5" }} // เปลี่ยนสีพื้นหลังให้เป็นสีเทาอ่อน
                      />
                    </Box>
                    <TextField
                      label="ชื่อ"
                      value={`${patientData.First_Name}`}
                      InputProps={{ readOnly: true }}
                      fullWidth
                      size="small"
                      margin="dense"
                      disabled
                      sx={{ backgroundColor: "#f5f5f5" }} // เปลี่ยนสีพื้นหลังให้เป็นสีเทาอ่อน
                    />
                    <TextField
                      label="ชื่อ-นามสกุล"
                      value={`${patientData.Last_Name}`}
                      InputProps={{ readOnly: true }}
                      fullWidth
                      size="small"
                      margin="dense"
                      disabled
                      sx={{ backgroundColor: "#f5f5f5" }} // เปลี่ยนสีพื้นหลังให้เป็นสีเทาอ่อน
                    />
                    <TextField
                      label="เพศ"
                      value={patientData.Gender}
                      InputProps={{ readOnly: true }}
                      fullWidth
                      size="small"
                      margin="dense"
                      disabled
                      sx={{ backgroundColor: "#f5f5f5" }} // เปลี่ยนสีพื้นหลังให้เป็นสีเทาอ่อน
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
                      sx={{ backgroundColor: "#f5f5f5" }} // เปลี่ยนสีพื้นหลังให้เป็นสีเทาอ่อน
                    />
                    <TextField
                      label="อายุ"
                      value={calculateAge(patientData.Birthdate)}
                      InputProps={{ readOnly: true }}
                      fullWidth
                      size="small"
                      margin="dense"
                      disabled
                      sx={{ backgroundColor: "#f5f5f5" }} // เปลี่ยนสีพื้นหลังให้เป็นสีเทาอ่อน
                    />
                    <TextField
                      label="แพ้ยา"
                      value={allergyDetails || "-"}
                      InputProps={{ readOnly: true }}
                      margin="dense"
                      size="small"
                      fullWidth
                      disabled
                      sx={{ backgroundColor: "#f5f5f5" }} // เปลี่ยนสีพื้นหลังให้เป็นสีเทาอ่อน
                    />
                    <TextField
                      label="โรคประจำตัว"
                      value={diseaseName || "-"}
                      InputProps={{ readOnly: true }}
                      fullWidth
                      size="small"
                      margin="dense"
                      disabled
                      sx={{ backgroundColor: "#f5f5f5" }} // เปลี่ยนสีพื้นหลังให้เป็นสีเทาอ่อน
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
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
                      label="อาการ"
                      value={treatmentData.Symptom || "-"}
                      InputProps={{ readOnly: true }}
                      fullWidth
                      size="small"
                      margin="dense"
                      multiline
                      rows={6}
                      disabled
                      sx={{ backgroundColor: "#f5f5f5" }}
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <Grid item xs={12} style={{ marginTop: "20px" }}>
                <Grid item xs={12}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    style={{ flexGrow: 1, textAlign: "center" }}
                  >
                    การรักษา - {treatmentData.Treatment_ID}
                  </Typography>
                </Grid>
                <FormControl fullWidth size="small">
                  <InputLabel id="treatment-type-label" size="small">
                    ประเภทการรักษา
                  </InputLabel>
                  <Select
                    labelId="treatment-type-label"
                    id="treatment-type"
                    value={treatmentType}
                    label="ประเภทการรักษา"
                    onChange={(e) => setTreatmentType(e.target.value)}
                  >
                    <MenuItem value="ทั่วไป">การรักษาทั่วไป</MenuItem>
                    <MenuItem value="ฉีดยาคุม">ฉีดยาคุม</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} style={{ marginTop: "20px" }}>
                {/* แสดงฟอร์มตามประเภทการรักษาที่เลือก */}
                {renderTreatmentForm()}
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
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
                    onClick={() =>
                      navigate(
                        `/doctor_addorder/${patientData.HN}/${treatmentData.Order_ID}`
                      )
                    }
                  >
                    ถัดไป
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ) : (
        <p>ไม่พบข้อมูลผู้ป่วย</p>
      )}
      <Dialog
        open={historyPopupOpen}
        onClose={handleCloseHistoryPopup}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>ประวัติการรักษา</DialogTitle>
        <DialogContent>
          <TreatmentHistory HN={HN} />{" "}
          {/* นำเนื้อหาของ TreatmentHistory มาใช้ */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseHistoryPopup} color="primary">
            ปิด
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DoctorPatientDetail;
