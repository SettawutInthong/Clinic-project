import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  Typography,
  Paper,
  Box,
  Grid,
  ButtonGroup,
} from "@mui/material";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useNavigate } from "react-router-dom";

const TreatmentHistory = () => {
  const { HN } = useParams();
  const [treatments, setTreatments] = useState([]);
  const [selectedGeneralTreatment, setSelectedGeneralTreatment] = useState(null);
  const [selectedPregnancyTreatment, setSelectedPregnancyTreatment] = useState(null);
  const [dialogState, setDialogState] = useState({
    open: false,
    selectedOrder: [],
  });
  const [patientTitle, setPatientTitle] = useState(""); // เก็บคำนำหน้าชื่อผู้ป่วย
  const navigate = useNavigate();

  // ดึงข้อมูลการรักษาจาก backend
  useEffect(() => {
    const fetchTreatments = async () => {
      try {
        // ดึงข้อมูลผู้ป่วยเพื่อตรวจสอบคำนำหน้าชื่อ
        const patientResponse = await axios.get(`http://localhost:5000/api/patient/${HN}`);
        setPatientTitle(patientResponse.data.data.Title); // เก็บคำนำหน้าผู้ป่วย

        // ดึงข้อมูลประวัติการรักษา
        const response = await axios.get(`http://localhost:5000/api/treatments/${HN}`);
        console.log(response.data.data);
        setTreatments(response.data.data || []);
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลการรักษา:", error);
      }
    };
    fetchTreatments();
  }, [HN]);

  const getTreatmentType = (treatment) => {
    const hasGeneralTreatment = treatment.GeneralTreatmentID ? "รักษาทั่วไป" : "";
    const hasPregnancyTreatment = treatment.PregnancyTreatmentID ? "รักษาการตั้งครรภ์" : "";
    const hasMedicineOrder = treatment.Order_ID ? "จ่ายยา" : "";

    // รวมประเภทการรักษาที่มี
    const treatmentTypes = [hasGeneralTreatment, hasPregnancyTreatment, hasMedicineOrder]
      .filter(Boolean)
      .join(", ");

    return treatmentTypes || "ไม่มีข้อมูลการรักษา";
  };

  const handleOpenGeneralTreatment = async (generalTreatmentID) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/general_treatment/${generalTreatmentID}`);
      setSelectedGeneralTreatment(response.data.data);
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการดึงข้อมูลการรักษาทั่วไป:", error);
    }
  };

  const handleCloseGeneralTreatment = () => {
    setSelectedGeneralTreatment(null);
  };

  const handleOpenPregnancyTreatment = async (pregnancyTreatmentID) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/pregnancy_treatment/${pregnancyTreatmentID}`);
      setSelectedPregnancyTreatment(response.data.data);
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการดึงข้อมูลการรักษาการตั้งครรภ์:", error);
    }
  };

  const handleClosePregnancyTreatment = () => {
    setSelectedPregnancyTreatment(null);
  };

  const handleOpenOrderDetails = async (orderID) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/medicine_details?Order_ID=${orderID}`);
      setDialogState({ open: true, selectedOrder: response.data.data || [] });
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการดึงข้อมูลออเดอร์:", error);
      setDialogState({ open: true, selectedOrder: [] });
    }
  };

  const handleCloseOrderDetails = () => {
    setDialogState({ open: false, selectedOrder: [] });
  };

  const isFemaleTitle = () => {
    // ตรวจสอบคำนำหน้าผู้ป่วยว่าตรงกับเพศหญิงหรือไม่
    return ["นาง", "นางสาว"].includes(patientTitle);
  };

  return (
    <Paper sx={{ padding: 3, margin: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <ButtonGroup variant="outlined" color="primary">
          <Button onClick={() => navigate(`/doctor_patientdetail/${HN}`)}><PlayArrowIcon style={{ transform: "rotate(180deg)" }} /> ไปยังประวัติผู้ป่วย</Button>
          <Button onClick={() => navigate(`/doctor_addtreatment/${HN}`)}>ไปยังบันทึกการรักษา<PlayArrowIcon /></Button>
          <Button onClick={() => navigate(`/doctor_addorder/${HN}`)}>ไปยังรายการจ่ายยา<PlayArrowIcon /><PlayArrowIcon /></Button>
        </ButtonGroup>
      </Box>
      <Typography variant="h6" gutterBottom>
        ประวัติการรักษา
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>วันที่รักษา</TableCell>
              <TableCell align="center">ประเภทการรักษา</TableCell>
              <TableCell align="center">รายการจ่ายยา</TableCell>
              <TableCell align="center">การรักษาทั่วไป</TableCell>
              {isFemaleTitle() && (
                <TableCell align="center">การรักษาผดุงครรภ์</TableCell> // แสดงคอลัมน์เฉพาะผู้ป่วยหญิง
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {treatments.length > 0 ? (
              treatments.map((treatment) => (
                <TableRow key={treatment.Treatment_ID}>
                  <TableCell>
                    {new Date(treatment.Treatment_Date).toLocaleDateString("th-TH")}
                  </TableCell>
                  <TableCell align="center">
                    {getTreatmentType(treatment)}
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleOpenOrderDetails(treatment.Order_ID)}
                    >
                      ดูรายการจ่ายยา
                    </Button>
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="outlined"
                      color="primary"
                      disabled={!treatment.GeneralTreatmentID}
                      onClick={() => handleOpenGeneralTreatment(treatment.GeneralTreatmentID)}
                    >
                      {treatment.GeneralTreatmentID ? "ดูการรักษาทั่วไป" : "ไม่มีการรักษาทั่วไป"}
                    </Button>
                  </TableCell>
                  {isFemaleTitle() && ( // แสดงปุ่มเฉพาะผู้ป่วยหญิง
                    <TableCell align="center">
                      <Button
                        variant="outlined"
                        color="primary"
                        disabled={!treatment.PregnancyTreatmentID}
                        onClick={() => handleOpenPregnancyTreatment(treatment.PregnancyTreatmentID)}
                      >
                        {treatment.PregnancyTreatmentID ? "ดูการรักษาการผดุงครรภ์" : "ไม่มีการรักษาการผดุงครรภ์"}
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} style={{ textAlign: "center" }}>
                  ไม่มีข้อมูลการรักษา
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Popup แสดงรายละเอียดออเดอร์ */}
      <Dialog
        open={dialogState.open}
        onClose={handleCloseOrderDetails}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>รายการยาในออเดอร์</DialogTitle>
        <DialogContent dividers>
          {dialogState.selectedOrder.length > 0 ? (
            <List>
              {dialogState.selectedOrder.map((item) => (
                <ListItem key={item.Item_ID}>
                  <ListItemText
                    primary={`${item.Medicine_Name} - จำนวน: ${item.Quantity_Order}`}
                    secondary={`ราคา: ${item.Med_Cost} บาท`}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography>ไม่มีรายการยา</Typography>
          )}
        </DialogContent>
      </Dialog>

      {/* Popup แสดงรายละเอียดการรักษาทั่วไป */}
      <Dialog
        open={!!selectedGeneralTreatment}
        onClose={handleCloseGeneralTreatment}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>รายละเอียดการรักษาทั่วไป</DialogTitle>
        <DialogContent>
          {selectedGeneralTreatment ? (
            <Box>
              <Typography>การวินิจฉัยเบื้องต้น: {selectedGeneralTreatment.General_Details}</Typography>
              <Typography>รายละเอียดการรักษา: {selectedGeneralTreatment.Treatment_Detail}</Typography>
              <Typography>บันทึกเพิ่มเติม: {selectedGeneralTreatment.Treatment_Others}</Typography>
            </Box>
          ) : (
            <Typography>ไม่มีข้อมูลการรักษาทั่วไป</Typography>
          )}
        </DialogContent>
      </Dialog>

      {/* Popup แสดงรายละเอียดการรักษาการตั้งครรภ์ */}
      <Dialog
        open={!!selectedPregnancyTreatment}
        onClose={handleClosePregnancyTreatment}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>รายละเอียดการรักษาการตั้งครรภ์</DialogTitle>
        <DialogContent>
          {selectedPregnancyTreatment ? (
            <Box>
              <Typography>ประเภทการควบคุมการตั้งครรภ์: {selectedPregnancyTreatment.Pregnancy_Control_Type}</Typography>
              <Typography>ปัญหาการตั้งครรภ์: {selectedPregnancyTreatment.Pregnancy_Problems}</Typography>
              <Typography>จำนวนการตั้งครรภ์: {selectedPregnancyTreatment.Total_Pregnancies}</Typography>
              <Typography>จำนวนบุตรทั้งหมด: {selectedPregnancyTreatment.Total_Children}</Typography>
              <Typography>วันที่การตั้งครรภ์ล่าสุด: {selectedPregnancyTreatment.Last_Pregnancy_Date}</Typography>
              <Typography>ประวัติการแท้ง: {selectedPregnancyTreatment.Abortion_History}</Typography>
              <Typography>รายละเอียดการรักษาอื่น ๆ: {selectedPregnancyTreatment.Pregmed_Detail}</Typography>
              <Typography>การรักษาอื่น ๆ: {selectedPregnancyTreatment.Preg_Others}</Typography>
            </Box>
          ) : (
            <Typography>ไม่มีข้อมูลการรักษาการตั้งครรภ์</Typography>
          )}
        </DialogContent>
      </Dialog>

      {/* ปุ่มกลับและปุ่มต่อไป */}
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
            onClick={() => navigate(`/doctor_patientdetail/${HN}`)}
          >
            กลับ
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(`/doctor_addtreatment/${HN}`)}
          >
            ต่อไป
          </Button>
        </Box>
      </Grid>
    </Paper>
  );
};

export default TreatmentHistory;
