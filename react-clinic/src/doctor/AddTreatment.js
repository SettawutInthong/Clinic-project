import React, { useState, useEffect } from "react";
import DialogContent from "@mui/material/DialogContent";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Grid,
  Paper,
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
import {
  DateTimePicker,
  LocalizationProvider,
  DatePicker,
} from "@mui/x-date-pickers";
import { setHours, setMinutes } from "date-fns";

const AddTreatment = () => {
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

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    navigate(`/doctor_addorder/${HN}/${orderID}`);
  };

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
          <Grid item xs={12}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                1. การรักษา
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
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              2. บันทึกเพิ่มเติม
            </Typography>
          </Grid>
          <TextField
            label="บันทึกเพิ่มเติม"
            fullWidth
            margin="dense"
            size="small"
            multiline
            rows={5}
          />
        </>
      );
    } else if (treatmentType === "ฉีดยาคุม") {
      return (
        <>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleOpenHistoryPopup} // เมื่อกดปุ่มนี้จะเปิด popup
          >
            ดูประวัติการรักษา
          </Button>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  1. ประวัติการคุมกำเนิด
                </Typography>
                <Switch
                  checked={isContraceptionVisible}
                  onChange={() =>
                    setContraceptionVisible(!isContraceptionVisible)
                  }
                />
              </Grid>
              {isContraceptionVisible && (
                <>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth margin="dense" size="small">
                      <InputLabel>ประเภทของการคุมกำเนิด</InputLabel>
                      <Select defaultValue="" label="ประเภทของการคุมกำเนิด">
                        <MenuItem value="ยาคุมกำเนิด">ยาคุมกำเนิด</MenuItem>
                        <MenuItem value="ฉีดยาคุม">ฉีดยาคุม</MenuItem>
                        <MenuItem value="ใส่ห่วงอนามัย">ใส่ห่วงอนามัย</MenuItem>
                      </Select>
                    </FormControl>

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
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="ระยะเวลาที่ผ่านมาหลังจากการฉีดครั้งสุดท้าย"
                      fullWidth
                      margin="dense"
                      size="small"
                      type="number" // ใช้สำหรับระยะเวลาที่ผ่านมาหลังจากการฉีด
                    />

                    <FormControl fullWidth margin="dense" size="small">
                      <InputLabel>ความถี่ในการฉีดยาคุมกำเนิด</InputLabel>
                      <Select
                        defaultValue=""
                        label="ความถี่ในการฉีดยาคุมกำเนิด"
                      >
                        <MenuItem value="1 เดือนครั้ง">1 เดือนครั้ง</MenuItem>
                        <MenuItem value="3 เดือนครั้ง">3 เดือนครั้ง</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      label="ปัญหาหรืออาการข้างเคียงจากการใช้ยาคุม"
                      fullWidth
                      margin="dense"
                      size="small"
                      multiline
                      rows={3}
                    />
                  </Grid>
                </>
              )}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  2. ประวัติการตั้งครรภ์และการมีบุตร
                </Typography>
                <Switch
                  checked={isPregnancyVisible}
                  onChange={() => setPregnancyVisible(!isPregnancyVisible)}
                />
              </Grid>
              {isPregnancyVisible && (
                <>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="จำนวนการตั้งครรภ์ที่เคยมี"
                      fullWidth
                      margin="dense"
                      size="small"
                      type="number" // ใช้ประเภท number สำหรับตัวเลข
                    />

                    <TextField
                      label="จำนวนการคลอดบุตร"
                      fullWidth
                      margin="dense"
                      size="small"
                      type="number"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <DatePicker
                      label="การตั้งครรภ์ล่าสุด (ถ้ามี)"
                      inputFormat="dd/MM/yyyy"
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          margin: "dense",
                          size: "small",
                        },
                      }}
                    />

                    <TextField
                      label="การแท้งบุตรหรือการตั้งครรภ์นอกมดลูก (ถ้ามี)"
                      fullWidth
                      margin="dense"
                      size="small"
                    />
                  </Grid>
                </>
              )}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  3. รายละเอียดการรักษา
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="ชนิดของยาคุมกำเนิดที่ฉีด"
                  fullWidth
                  margin="dense"
                  size="small"
                />

                <Button variant="outlined" onClick={handleOpenAppointmentPopup}>
                  นัดหมายผู้ป่วย
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="จำนวนยา"
                  fullWidth
                  margin="dense"
                  size="small"
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  4. บันทึกเพิ่มเติม
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="บันทึกเพิ่มเติม"
                  fullWidth
                  margin="dense"
                  size="small"
                  multiline
                  rows={5}
                />
              </Grid>
            </Grid>
          </LocalizationProvider>
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
      <Paper sx={{ padding: 3 }}>
        {patientData ? (
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
                    <MenuItem value="ฉีดยาคุม">การคุมกำเนิด</MenuItem>
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
                    color="secondary"
                    onClick={() =>
                      navigate(
                        `/doctor_addorder/${patientData.HN}/${treatmentData.Order_ID}`
                      )
                    }
                  >
                    บันทึกการรักษา
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        ) : (
          <p>ไม่พบข้อมูลผู้ป่วย</p>
        )}

        <Dialog
          open={appointmentPopup}
          onClose={handleCloseAppointmentPopup}
          aria-labelledby="appointment-dialog-title"
          maxWidth="sm"
          fullWidth
          sx={{ "& .MuiDialog-paper": { minHeight: "80vh" } }} // เพิ่มบรรทัดนี้
        >
          <DialogTitle
            id="appointment-dialog-title"
            style={{ flexGrow: 1, textAlign: "center" }}
          >
            นัดหมายผู้ป่วย
          </DialogTitle>
          <DialogContent sx={{ minHeight: "70vh" }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="เลือกวันที่และเวลา"
                value={appointmentDate}
                onChange={(date) => setAppointmentDate(date)}
                ampm={false} // ใช้รูปแบบ 24 ชั่วโมง
                minTime={setHours(setMinutes(new Date(), 0), 8)} // จำกัดเวลาเริ่มต้นเป็น 08:00
                maxTime={setHours(setMinutes(new Date(), 0), 20)} // จำกัดเวลาสิ้นสุดเป็น 20:00
                slotProps={{
                  textField: {
                    fullWidth: true,
                    margin: "dense",
                    size: "small",
                  },
                }}
              />
            </LocalizationProvider>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAppointmentPopup} color="primary">
              ยกเลิก
            </Button>
            <Button onClick={ConfirmAppointment} color="primary">
              บันทึก
            </Button>
          </DialogActions>
        </Dialog>

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
      </Paper>
    </Box>
  );
};
export default AddTreatment;