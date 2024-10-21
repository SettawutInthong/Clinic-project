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
import { useNavigate } from "react-router-dom";

const DoctorPatientDetail = () => {
  const { HN } = useParams(); // รับ HN จาก URL
  const [patientData, setPatientData] = useState(null); // เก็บข้อมูลผู้ป่วย
  const [loading, setLoading] = useState(true); // สถานะโหลดข้อมูล
  const [error, setError] = useState(null); // สถานะข้อผิดพลาด
  const navigate = useNavigate(); // ใช้เพื่อเปลี่ยนหน้า

  useEffect(() => {
    // ฟังก์ชันสำหรับดึงข้อมูลผู้ป่วยจาก backend
    const fetchPatientData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/patient/${HN}`
        );
        setPatientData(response.data.data[0]); // เก็บข้อมูลผู้ป่วย
        setLoading(false); // เปลี่ยนสถานะเป็นโหลดเสร็จสิ้น
      } catch (error) {
        console.error("Error fetching patient data:", error);
        setError("เกิดข้อผิดพลาดในการดึงข้อมูลผู้ป่วย");
        setLoading(false); // เปลี่ยนสถานะเป็นโหลดเสร็จสิ้นพร้อมข้อผิดพลาด
      }
    };

    // ดึงข้อมูลผู้ป่วยทุกครั้งที่หน้าโหลดหรือ HN เปลี่ยนแปลง
    fetchPatientData();
  }, [HN]);

  // ฟังก์ชันสำหรับคำนวณอายุ
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

  if (loading) {
    return (
      <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center", mt: 4 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, padding: 3 }}>
      <Paper sx={{ padding: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <ButtonGroup variant="outlined" color="primary">
            <Button onClick={() => navigate(`/doctor_treatmenthistory/${HN}`)}>ไปยังประวัติการรักษา</Button>
            <Button onClick={() => navigate(`/doctor_addtreatment/${HN}`)}>ไปยังบันทึกการรักษา</Button>
            <Button onClick={() => navigate(`/doctor_addorder/${HN}`)}>ไปยังรายการจ่ายยา</Button>
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
                    value={patientData.Heart_Rate || "-"}
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
                    value={patientData.Pressure || "-"}
                    InputProps={{ readOnly: true }}
                    fullWidth
                    size="small"
                    margin="dense"
                    disabled
                    sx={{ backgroundColor: "#f5f5f5" }}
                  />
                  <TextField
                    label="อุณหภูมิ"
                    value={patientData.Temp || "-"}
                    InputProps={{ readOnly: true }}
                    fullWidth
                    size="small"
                    margin="dense"
                    disabled
                    sx={{ backgroundColor: "#f5f5f5" }}
                  />
                  <TextField
                    label="น้ำหนัก"
                    value={patientData.Weight || "-"}
                    InputProps={{ readOnly: true }}
                    fullWidth
                    size="small"
                    margin="dense"
                    disabled
                    sx={{ backgroundColor: "#f5f5f5" }}
                  />
                  <TextField
                    label="ส่วนสูง"
                    value={patientData.Height || "-"}
                    InputProps={{ readOnly: true }}
                    fullWidth
                    size="small"
                    margin="dense"
                    disabled
                    sx={{ backgroundColor: "#f5f5f5" }}
                  />
                  <TextField
                    label="อาการ"
                    value={patientData.Symptom || "-"}
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
                  color="secondary"
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
