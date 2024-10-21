import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import { ButtonGroup,List,ListItem,ListItemText } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import ReactSelect from "react-select";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import AddToQueueIcon from "@mui/icons-material/AddToQueue";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SearchIcon from "@mui/icons-material/Search";
import HistoryIcon from "@mui/icons-material/History";
import Grid from "@mui/material/Grid";

const ContainerStyled = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(10),
}));

const PaperStyled = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
}));

const DoctorPatient = () => {
  const [data, setData] = useState([]);
  const [searchHN, setSearchHN] = useState("");
  const [searchTitle, setSearchTitle] = useState("");
  const [searchFirstName, setSearchFirstName] = useState("");
  const [searchLastName, setSearchLastName] = useState("");
  const [searchGender, setSearchGender] = useState("");
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newGender, setNewGender] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newBirthdate, setNewBirthdate] = useState(null);
  const [newPhone, setNewPhone] = useState("");
  const [newAllergy, setNewAllergy] = useState("");
  const [newDisease, setNewDisease] = useState("");
  const [allergy, setAllergy] = useState([]);
  const [diseases, setDiseases] = useState([]);
  const [selectedHN, setSelectedHN] = useState("");
  const [addPopup, setAddPopup] = useState(false);
  const [viewPopup, setViewPopup] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);
  const [edit, setEdit] = useState(false);
  const [queueData, setQueueData] = useState([]);
  const [message, setMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarType, setSnackbarType] = useState("success");
  const [showTable, setShowTable] = useState(false);
  const [treatmentHistory, setTreatmentHistory] = useState([]);
  const [medicineDetails, setMedicineDetails] = useState([]);
  const [historyPopup, setHistoryPopup] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // หน้าปัจจุบันเริ่มที่ 1
  const patientsPerPage = 10; // จำนวนผู้ป่วยต่อหน้า
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = data.slice(indexOfFirstPatient, indexOfLastPatient);
  const [selectedGeneralTreatment, setSelectedGeneralTreatment] = useState(null); // สำหรับแสดงรายละเอียดการรักษาทั่วไป
  const [selectedPregnancyTreatment, setSelectedPregnancyTreatment] = useState(null); // สำหรับแสดงรายละเอียดการรักษาการตั้งครรภ์
  const [dialogState, setDialogState] = useState({
    open: false,
    selectedOrder: [],
  });

  const navigate = useNavigate();
  const [treatmentData, setTreatmentData] = useState({
    Heart_Rate: "",
    Pressure: "",
    Temp: "",
    Weight: "",
    Height: "",
    Symptom: "",
  });
  const [isGenderLocked, setIsGenderLocked] = useState(false); // สำหรับล็อกเพศตามคำนำหน้า
  const [newID, setNewID] = useState(""); // สำหรับจัดการเลขบัตรประชาชน
  const [errors, setErrors] = useState({}); // สำหรับจัดการข้อผิดพลาดในฟอร์ม
  const [appointmentDate, setAppointmentDate] = useState(null);
  const [addQueuePopup, setAddQueuePopup] = useState(false);
  const [queueHN, setQueueHN] = useState("");

  const nextPage = () => {
    if (currentPage < Math.ceil(data.length / patientsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const showMessage = (message, type) => {
    setMessage(message);
    setSnackbarType(type);
    setSnackbarOpen(true);
  };

  const FetchData = async () => {
    const params = {};
    if (searchHN) params.HN = searchHN;
    if (searchTitle) params.Title = searchTitle;
    if (searchFirstName) params.First_Name = searchFirstName;
    if (searchLastName) params.Last_Name = searchLastName;
    if (searchGender) params.Gender = searchGender;

    try {
      const response = await axios.get("http://localhost:5000/api/patient", {
        params,
      });
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const SearchHNChange = (event) => {
    setSearchHN(event.target.value);
  };

  const SearchTitleChange = (event) => {
    setSearchTitle(event.target.value);
  };

  const SearchFirstNameChange = (event) => {
    setSearchFirstName(event.target.value);
  };

  const SearchLastNameChange = (event) => {
    setSearchLastName(event.target.value);
  };

  const SearchGenderChange = (event) => {
    setSearchGender(event.target.value);
  };

  const SearchSubmit = async (event) => {
    event.preventDefault();
    FetchData(); // ดึงข้อมูลที่ถูกค้นหามาแสดง
  };

  // ฟังก์ชันตรวจสอบประเภทการรักษา
  const getTreatmentType = (treatment) => {
    const hasGeneralTreatment = treatment.GeneralTreatmentID ? "รักษาทั่วไป" : "";
    const hasPregnancyTreatment = treatment.PregnancyTreatmentID ? "รักษาการตั้งครรภ์" : "";
    const hasMedicineOrder = treatment.Order_ID ? "จ่ายยา" : "";

    // รวมข้อมูลการรักษาที่มี
    const treatmentTypes = [hasGeneralTreatment, hasPregnancyTreatment, hasMedicineOrder]
      .filter(Boolean) // กรองค่าที่เป็นว่างออก
      .join(", "); // รวมข้อมูลการรักษาในรูปแบบข้อความ

    return treatmentTypes || "ไม่มีข้อมูลการรักษา";
  };
  
  const ViewHistory = async (HN) => {
    try {
      const treatmentResponse = await axios.get(
        `http://localhost:5000/api/treatments/${HN}`
      );
      setTreatmentHistory(treatmentResponse.data.data);
      setHistoryPopup(true);
    } catch (error) {
      console.error("Error fetching history:", error);
      showMessage("เกิดข้อผิดพลาดในการดูประวัติการรักษา", "error");
    }
  };

  const handleOpenOrderDetails = async (orderID) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/medicine_details?Order_ID=${orderID}`
      );
      setDialogState({ open: true, selectedOrder: response.data.data || [] });
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการดึงข้อมูลออเดอร์:", error);
      setDialogState({ open: true, selectedOrder: [] });
    }
  };

  const handleCloseOrderDetails = () => {
    setDialogState({ open: false, selectedOrder: [] });
  };

  const handleOpenGeneralTreatment = async (generalTreatmentID) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/general_treatment/${generalTreatmentID}`
      );
      setSelectedGeneralTreatment(response.data.data); // เก็บข้อมูลการรักษาทั่วไป
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการดึงข้อมูลการรักษาทั่วไป:", error);
    }
  };

  const handleCloseGeneralTreatment = () => {
    setSelectedGeneralTreatment(null);
  };

  const handleOpenPregnancyTreatment = async (pregnancyTreatmentID) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/pregnancy_treatment/${pregnancyTreatmentID}`
      );
      setSelectedPregnancyTreatment(response.data.data); // เก็บข้อมูลการรักษาการตั้งครรภ์
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการดึงข้อมูลการรักษาการตั้งครรภ์:", error);
    }
  };

  const handleClosePregnancyTreatment = () => {
    setSelectedPregnancyTreatment(null);
  };

  useEffect(() => {
    FetchData(); // ดึงข้อมูลผู้ป่วยเมื่อเริ่มโหลดหน้า
  }, []);

  const ResetForm = () => {
    setNewTitle("");
    setNewFirstName("");
    setNewLastName("");
    setNewID("");
    setNewBirthdate(null);
    setNewGender("");
    setNewPhone("");
    setNewDisease("");
    setNewAllergy("");
    setTreatmentData({
      Heart_Rate: "",
      Pressure: "",
      Temp: "",
      Weight: "",
      Height: "",
      Symptom: "",
    });
    setSelectedHN("");
    setAppointmentDate(null);
  };

  // ฟังก์ชันสำหรับตรวจสอบข้อมูลในฟอร์ม
  const validateForm = () => {
    const newErrors = {};

    // ตรวจสอบว่าถ้ามีการกรอก ID ต้องเป็นตัวเลขเท่านั้น
    if (newID && isNaN(newID)) {
      newErrors.ID = "เลขบัตรประชาชนต้องเป็นตัวเลข";
    }

    // ตรวจสอบข้อมูลอื่น ๆ ตามที่ต้องการ
    // เช่น Weight, Height ควรเป็นตัวเลข
    if (treatmentData.Weight && isNaN(treatmentData.Weight)) {
      newErrors.Weight = "น้ำหนักต้องเป็นตัวเลข";
    }
    if (treatmentData.Height && isNaN(treatmentData.Height)) {
      newErrors.Height = "ส่วนสูงต้องเป็นตัวเลข";
    }

    setErrors(newErrors);

    // ถ้าไม่มีข้อผิดพลาด (จำนวนข้อผิดพลาดเป็น 0) ให้คืนค่า true
    return Object.keys(newErrors).length === 0;
  };

  const AddPatient = async () => {
    // ตรวจสอบฟอร์มก่อน
    if (!validateForm()) {
      showMessage("ข้อมูลไม่ถูกต้อง", "error");
      return;
    }
    try {
      const newPatientDetails = {
        Title: newTitle,
        First_Name: newFirstName,
        Last_Name: newLastName,
        ID: newID,
        Gender: newGender,
        Birthdate: newBirthdate,
        Phone: newPhone,
        Disease: newDisease,
        Allergy: newAllergy,
        Heart_Rate: treatmentData.Heart_Rate,
        Pressure: treatmentData.Pressure,
        Temp: treatmentData.Temp,
        Weight: treatmentData.Weight,
        Height: treatmentData.Height,
        Symptom: treatmentData.Symptom,
      };

      const response = await axios.post(
        "http://localhost:5000/api/addPatientWithDetails",
        newPatientDetails
      );

      if (response.status === 201) {
        FetchData();
        setAddPopup(false);
        showMessage("เพิ่มข้อมูลผู้ป่วยสำเร็จ", "success");
        ResetForm();
      }
    } catch (error) {
      console.error("Error adding patient:", error);
      showMessage("เกิดข้อผิดพลาดในการเพิ่มข้อมูลผู้ป่วย", "error");
    }
  };

  const DeletePatient = (HN) => {
    setSelectedHN(HN);
    setDeletePopup(true);
  };

  const ConfirmDeletePatient = async () => {
    try {
      // ลบข้อมูลทั้งหมดที่เกี่ยวข้องกับ HN โดยใช้ API เดียว
      await axios.delete(`http://localhost:5000/api/patient/${selectedHN}`);

      FetchData(); // โหลดข้อมูลใหม่อีกครั้งหลังจากลบสำเร็จ
      setDeletePopup(false); // ปิด popup การยืนยันการลบ
      showMessage("ลบข้อมูลผู้ป่วยสำเร็จ", "success");
    } catch (error) {
      console.error("Error deleting patient:", error);
      showMessage("เกิดข้อผิดพลาดในการลบข้อมูลผู้ป่วย", "error");
    }
  };

  const ViewPatient = async (HN) => {
    try {
      ResetForm();
      const response = await axios.get(
        `http://localhost:5000/api/patient?HN=${HN}`
      );
      const patient = response.data.data[0];
      if (patient) {
        setNewTitle(patient.Title);
        setNewFirstName(patient.First_Name);
        setNewLastName(patient.Last_Name);
        setNewID(patient.ID);
        setNewBirthdate(new Date(patient.Birthdate));
        setNewGender(patient.Gender);
        setNewPhone(patient.Phone);
        setNewAllergy(patient.Allergy);
        setNewDisease(patient.Disease);

        setSelectedHN(HN);
        setEdit(false);
        setViewPopup(true);
      }
    } catch (error) {
      console.error("Error viewing patient:", error);
      showMessage("เกิดข้อผิดพลาดในการดูข้อมูลผู้ป่วย");
    }
  };

  const EditPatient = async () => {
    try {
      const editPatient = {
        Title: newTitle,
        First_Name: newFirstName,
        Last_Name: newLastName,
        Gender: newGender,
        Birthdate: newBirthdate
          ? newBirthdate.toISOString().split("T")[0]
          : null,
        Phone: newPhone,
        Disease: newDisease,
        Allergy: newAllergy,
      };

      await axios.put(
        `http://localhost:5000/api/patient/${selectedHN}`,
        editPatient
      );
      FetchData();
      setViewPopup(false);
      showMessage("บันทึกข้อมูลผู้ป่วยสำเร็จ");
    } catch (error) {
      console.error("Error saving patient data:", error);
      showMessage("เกิดข้อผิดพลาดในการบันทึกข้อมูลผู้ป่วย");
    }
  };

  const AddQueue = (HN) => {
    setQueueHN(HN);
    setAddQueuePopup(true);
  };

  const ConfirmAddQueue = async () => {
    try {
      await axios.post("http://localhost:5000/api/addWalkInQueue", {
        HN: queueHN,
        Heart_Rate: treatmentData.Heart_Rate || null,
        Pressure: treatmentData.Pressure || null,
        Temp: treatmentData.Temp || null,
        Weight: treatmentData.Weight || null,
        Height: treatmentData.Height || null,
        Symptom: treatmentData.Symptom || null,
        Treatment_Details: null,
        Treatment_cost: null,
        Total_Cost: null,
      });

      showMessage("จองคิวสำเร็จ", "success");

      // อัพเดต queueData ทันทีหลังจากจองคิวเสร็จ
      setQueueData((prevQueueData) => [...prevQueueData, { HN: queueHN }]);

      // รีเซ็ตฟอร์มและปิด Popup
      setAddQueuePopup(false);
      ResetForm();
    } catch (error) {
      console.error("Error booking queue:", error);
      showMessage("เกิดข้อผิดพลาดในการจองคิว", "error");
    }
  };

  const isInQueue = (HN) => {
    return queueData.some((queue) => queue.HN === HN);
  };

  useEffect(() => {
    const fetchQueueData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/walkinqueue");
        setQueueData(response.data.data);
      } catch (error) {
        console.error("Error fetching queue data:", error);
      }
    };

    // ให้แสดงตารางทันทีเมื่อ component ถูกสร้าง
    setShowTable(true);
    FetchData();
    fetchQueueData();
  }, []);

  useEffect(() => {
    if (newTitle === "นาย" || newTitle === "ด.ช.") {
      setNewGender("ชาย");
      setIsGenderLocked(true); // ล็อกฟิลด์เพศ
    } else if (
      newTitle === "นาง" ||
      newTitle === "นางสาว" ||
      newTitle === "ด.ญ."
    ) {
      setNewGender("หญิง");
      setIsGenderLocked(true); // ล็อกฟิลด์เพศ
    } else {
      setNewGender(""); // หรือให้เป็นค่าว่างถ้าไม่ตรงกับเงื่อนไขใด
      setIsGenderLocked(false); // ปลดล็อกฟิลด์เพศ
    }
  }, [newTitle]);


  return (
    <Box sx={{ flexGrow: 1 }}>
      <ContainerStyled maxWidth="lg">
        <PaperStyled>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={2}
          >
            <Typography
              variant="h6"
              gutterBottom
              style={{ flexGrow: 1, textAlign: "center" }}
            >
              รายชื่อผู้ป่วย
            </Typography>
          </Box>
          <div>
            <Box display="flex" justifyContent="space-between" mb={2}>
              <form
                onSubmit={SearchSubmit}
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "20px",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <TextField
                  label="กรอก HN"
                  variant="outlined"
                  size="small"
                  onChange={(e) => setSearchHN(e.target.value)}
                  inputProps={{ maxLength: 5 }}
                  style={{ width: "100px" }}
                />
                <FormControl
                  variant="outlined"
                  size="small"
                  style={{ width: "140px" }}
                >
                  <InputLabel>เลือกคำนำหน้า</InputLabel>
                  <Select
                    value={searchTitle}
                    onChange={SearchTitleChange}
                    label="เลือกคำนำหน้า"
                  >
                    <MenuItem value="- Unknown -">- Unknown -</MenuItem>
                    <MenuItem value="ด.ช.">ด.ช.</MenuItem>
                    <MenuItem value="ด.ญ.">ด.ญ.</MenuItem>
                    <MenuItem value="นาย">นาย</MenuItem>
                    <MenuItem value="นาง">นาง</MenuItem>
                    <MenuItem value="นางสาว">นางสาว</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  label="กรอกชื่อ"
                  variant="outlined"
                  size="small"
                  onChange={(e) => setSearchFirstName(e.target.value)}
                />
                <TextField
                  label="กรอกนามสกุล"
                  variant="outlined"
                  size="small"
                  onChange={(e) => setSearchLastName(e.target.value)}
                />
                <FormControl
                  variant="outlined"
                  size="small"
                  style={{ width: "110px" }}
                >
                  <InputLabel>เลือกเพศ</InputLabel>
                  <Select
                    value={searchGender}
                    onChange={SearchGenderChange}
                    variant="outlined"
                    size="small"
                    label="เลือกเพศ"
                  >
                    <MenuItem value="- Unknown -">- Unknown -</MenuItem>
                    <MenuItem value="ชาย">ชาย</MenuItem>
                    <MenuItem value="หญิง">หญิง</MenuItem>
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  type="submit"
                  style={{ height: "40px" }}
                  color="info"
                >
                  <SearchIcon />
                </Button>
              </form>
              <Button
                variant="contained"
                style={{ height: "40px", width: "150px" }}
                color="success"
                onClick={() => {
                  ResetForm();
                  setAddPopup(true);
                }}
              >
                <PersonAddIcon />
              </Button>
            </Box>

            {showTable && (
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ flexGrow: 1, textAlign: "center" }}>
                        HN
                      </TableCell>
                      <TableCell style={{ flexGrow: 1, textAlign: "center" }}>
                        คำนำหน้า
                      </TableCell>
                      <TableCell style={{ flexGrow: 1, textAlign: "center" }}>
                        ชื่อ
                      </TableCell>
                      <TableCell style={{ flexGrow: 1, textAlign: "center" }}>
                        นามสกุล
                      </TableCell>
                      <TableCell style={{ flexGrow: 1, textAlign: "center" }}>
                        เพศ
                      </TableCell>
                      <TableCell style={{ flexGrow: 1, textAlign: "center" }}>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentPatients.map((row) => (
                      <TableRow
                        key={row.HN}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell
                          style={{ flexGrow: 1, textAlign: "center" }}
                          component="th"
                          scope="row"
                        >
                          {row.HN}
                        </TableCell>
                        <TableCell style={{ flexGrow: 1, textAlign: "center" }}>
                          {row.Title}
                        </TableCell>
                        <TableCell style={{ flexGrow: 1, textAlign: "center" }}>
                          {row.First_Name}
                        </TableCell>
                        <TableCell style={{ flexGrow: 1, textAlign: "center" }}>
                          {row.Last_Name}
                        </TableCell>
                        <TableCell style={{ flexGrow: 1, textAlign: "center" }}>
                          {row.Gender}
                        </TableCell>
                        <TableCell style={{ flexGrow: 1, textAlign: "center" }}>
                          <ButtonGroup
                            color="primary"
                            aria-label="outlined primary button group"
                          >
                            <Button
                              onClick={() => AddQueue(row.HN)}
                              disabled={isInQueue(row.HN)}
                              color="success"
                              style={{
                                backgroundColor: isInQueue(row.HN)
                                  ? "gray"
                                  : "default",
                              }}
                            >
                              <AddToQueueIcon />
                            </Button>
                            <Button onClick={() => ViewPatient(row.HN)}>
                              <VisibilityIcon />
                            </Button>
                            <Button
                              onClick={() => ViewHistory(row.HN)}
                              color="secondary"
                            >
                              <HistoryIcon />
                            </Button>
                            <Button
                              onClick={() => DeletePatient(row.HN)}
                              color="error"
                            >
                              <DeleteIcon />
                            </Button>
                          </ButtonGroup>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Box display="flex" justifyContent="center" mt={2}>
                  <Button onClick={prevPage} disabled={currentPage === 1}>
                    ก่อนหน้า
                  </Button>
                  <Typography variant="body1" style={{ margin: "0 15px" }}>
                    {currentPage}
                  </Typography>
                  <Button
                    onClick={nextPage}
                    disabled={
                      currentPage === Math.ceil(data.length / patientsPerPage)
                    }
                  >
                    ถัดไป
                  </Button>
                </Box>
              </TableContainer>
            )}

            <Dialog
              open={addPopup}
              onClose={() => {
                setAddPopup(false);
              }}
              aria-labelledby="form-dialog-title"
              maxWidth="lg"
              fullWidth
            >
              <DialogTitle
                id="form-dialog-title"
                style={{ flexGrow: 1, textAlign: "center" }}
              >
                เพิ่มผู้ป่วยใหม่
              </DialogTitle>
              <DialogContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box display="flex" flexDirection="row" gap={2}>
                      <FormControl
                        fullWidth
                        margin="dense"
                        variant="outlined"
                        style={{ width: "275px" }}
                        size="small"
                      >
                        <InputLabel>เลือกคำนำหน้า</InputLabel>
                        <Select
                          label="เลือกคำนำหน้า"
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                        >
                          <MenuItem value="- Unknown -">- Unknown -</MenuItem>
                          <MenuItem value="ด.ช.">ด.ช.</MenuItem>
                          <MenuItem value="ด.ญ.">ด.ญ.</MenuItem>
                          <MenuItem value="นาย">นาย</MenuItem>
                          <MenuItem value="นาง">นาง</MenuItem>
                          <MenuItem value="นางสาว">นางสาว</MenuItem>
                        </Select>
                      </FormControl>
                      <FormControl
                        fullWidth
                        margin="dense"
                        variant="outlined"
                        style={{ width: "275px" }}
                        size="small"
                      >
                        <InputLabel>เลือกเพศ</InputLabel>
                        <Select
                          label="เลือกเพศ"
                          value={newGender}
                          onChange={(e) => setNewGender(e.target.value)}
                          disabled={isGenderLocked} // ล็อกฟิลด์ถ้า isGenderLocked เป็น true
                        >
                          <MenuItem value="">- เลือกเพศ -</MenuItem>
                          <MenuItem value="ชาย">ชาย</MenuItem>
                          <MenuItem value="หญิง">หญิง</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                    <TextField
                      autoFocus
                      margin="dense"
                      label="กรอกชื่อ"
                      type="text"
                      fullWidth
                      value={newFirstName}
                      onChange={(e) => setNewFirstName(e.target.value)}
                      size="small"
                    />
                    <TextField
                      margin="dense"
                      label="กรอกนามสกุล"
                      type="text"
                      fullWidth
                      value={newLastName}
                      onChange={(e) => setNewLastName(e.target.value)}
                      size="small"
                    />
                    <TextField
                      margin="dense"
                      label="กรอกเลขบัตรประชาชน"
                      type="text"
                      fullWidth
                      value={newID}
                      onChange={(e) => setNewID(e.target.value)}
                      size="small"
                      error={Boolean(errors.ID)}
                      helperText={errors.ID}
                    />
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="เลือกวันเกิด"
                        value={newBirthdate}
                        onChange={(date) => setNewBirthdate(date)}
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
                      margin="dense"
                      label="กรอกหมายเลขโทรศัพท์"
                      type="text"
                      fullWidth
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      size="small"
                    />
                    <TextField
                      margin="dense"
                      label="โรคประจำตัว"
                      type="text"
                      fullWidth
                      value={newDisease}
                      onChange={(e) => setNewDisease(e.target.value)}
                      size="small"
                    />
                    <TextField
                      margin="dense"
                      label="แพ้ยา"
                      type="text"
                      fullWidth
                      value={newAllergy}
                      onChange={(e) => setNewAllergy(e.target.value)}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      margin="dense"
                      label="อัตราการเต้นหัวใจ"
                      name="อัตราการเต้นหัวใจ"
                      value={treatmentData.Heart_Rate}
                      onChange={(e) =>
                        setTreatmentData({
                          ...treatmentData,
                          Heart_Rate: e.target.value,
                        })
                      }
                      fullWidth
                      size="small"
                    />
                    <TextField
                      margin="dense"
                      label="ความดัน"
                      name="ความดัน"
                      value={treatmentData.Pressure}
                      onChange={(e) =>
                        setTreatmentData({
                          ...treatmentData,
                          Pressure: e.target.value,
                        })
                      }
                      fullWidth
                      size="small"
                    />
                    <TextField
                      margin="dense"
                      label="อุณหภูมิ"
                      name="อุณหภูมิ"
                      value={treatmentData.Temp}
                      onChange={(e) =>
                        setTreatmentData({
                          ...treatmentData,
                          Temp: e.target.value,
                        })
                      }
                      fullWidth
                      size="small"
                    />
                    <TextField
                      margin="dense"
                      label="น้ำหนัก"
                      name="น้ำหนัก"
                      value={treatmentData.Weight}
                      onChange={(e) =>
                        setTreatmentData({
                          ...treatmentData,
                          Weight: e.target.value,
                        })
                      }
                      fullWidth
                      size="small"
                    />
                    <TextField
                      margin="dense"
                      label="ส่วนสูง"
                      name="ส่วนสูง"
                      value={treatmentData.Height}
                      onChange={(e) =>
                        setTreatmentData({
                          ...treatmentData,
                          Height: e.target.value,
                        })
                      }
                      fullWidth
                      size="small"
                    />
                    <TextField
                      margin="dense"
                      label="อาการ"
                      name="อาการ"
                      value={treatmentData.Symptom}
                      onChange={(e) =>
                        setTreatmentData({
                          ...treatmentData,
                          Symptom: e.target.value,
                        })
                      }
                      fullWidth
                      multiline
                      rows={5}
                    />
                  </Grid>
                </Grid>
              </DialogContent>

              <DialogActions>
                <Button
                  onClick={() => {
                    setAddPopup(false);
                    ResetForm();
                  }}
                  color="primary"
                >
                  ยกเลิก
                </Button>
                <Button
                  onClick={() => {
                    AddPatient();
                    ResetForm();
                  }}
                  color="primary" variant="contained"
                >
                  บันทึก
                </Button>
              </DialogActions>
            </Dialog>

            <Dialog
              open={viewPopup}
              onClose={() => setViewPopup(false)}
              aria-labelledby="view-dialog-title"
            >
              <DialogTitle
                id="view-dialog-title"
                style={{ flexGrow: 1, textAlign: "center" }}
              >
                ข้อมูลผู้ป่วย
              </DialogTitle>
              <DialogContent>
                <Box display="flex" justifyContent="space-between" gap={2}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <FormControl
                        fullWidth
                        variant="outlined"
                        sx={{
                          backgroundColor: edit
                            ? "white"
                            : "rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        <InputLabel id="title-label">คำนำหน้า</InputLabel>
                        <Select
                          labelId="title-label"
                          label="คำนำหน้า"
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          disabled={!edit}
                          sx={{
                            backgroundColor: edit
                              ? "white"
                              : "rgba(0, 0, 0, 0.1)",
                            color: edit
                              ? "inherit"
                              : "rgba(255, 255, 255, 0.7)",
                          }}
                        >
                          <MenuItem value="- Unknown -">- Unknown -</MenuItem>
                          <MenuItem value="ด.ช.">ด.ช.</MenuItem>
                          <MenuItem value="ด.ญ.">ด.ญ.</MenuItem>
                          <MenuItem value="นาย">นาย</MenuItem>
                          <MenuItem value="นาง">นาง</MenuItem>
                          <MenuItem value="นางสาว">นางสาว</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl
                        fullWidth
                        variant="outlined"
                        sx={{
                          backgroundColor: edit
                            ? "white"
                            : "rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        <InputLabel id="gender-label">เลือกเพศ</InputLabel>
                        <Select
                          labelId="gender-label"
                          label="เลือกเพศ"
                          value={newGender}
                          onChange={(e) => setNewGender(e.target.value)}
                          disabled={!edit}
                          sx={{
                            backgroundColor: edit
                              ? "white"
                              : "rgba(0, 0, 0, 0.1)",
                            color: edit
                              ? "inherit"
                              : "rgba(255, 255, 255, 0.7)",
                          }}
                        >
                          <MenuItem value="">- เลือกเพศ -</MenuItem>
                          <MenuItem value="ชาย">ชาย</MenuItem>
                          <MenuItem value="หญิง">หญิง</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Box>
                <TextField
                  autoFocus
                  margin="dense"
                  label="ชื่อ"
                  type="text"
                  fullWidth
                  value={newFirstName}
                  onChange={(e) => setNewFirstName(e.target.value)}
                  disabled={!edit}
                  sx={{
                    backgroundColor: edit ? "white" : "rgba(0, 0, 0, 0.1)", // เปลี่ยนสีพื้นหลัง
                    color: edit ? "inherit" : "rgba(255, 255, 255, 0.7)", // เปลี่ยนสีข้อความ
                  }}
                />

                <TextField
                  margin="dense"
                  label="นามสกุล"
                  type="text"
                  fullWidth
                  value={newLastName}
                  onChange={(e) => setNewLastName(e.target.value)}
                  disabled={!edit}
                  sx={{
                    backgroundColor: edit ? "white" : "rgba(0, 0, 0, 0.1)", // เปลี่ยนสีพื้นหลัง
                    color: edit ? "inherit" : "rgba(255, 255, 255, 0.7)", // เปลี่ยนสีข้อความ
                  }}
                />
                <TextField
                  margin="dense"
                  label="เลขบัตรประชาชน"
                  type="text"
                  fullWidth
                  value={newID}
                  onChange={(e) => setNewID(e.target.value)}
                  disabled={!edit}
                  sx={{
                    backgroundColor: edit ? "white" : "rgba(0, 0, 0, 0.1)", // เปลี่ยนสีพื้นหลัง
                    color: edit ? "inherit" : "rgba(255, 255, 255, 0.7)", // เปลี่ยนสีข้อความ
                  }}
                />
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    disabled={!edit}
                    label="วันเกิด"
                    value={newBirthdate}
                    onChange={(date) => setNewBirthdate(date)}
                    inputFormat="dd/MM/yyyy"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        margin: "dense",
                        disabled: !edit,
                        sx: {
                          backgroundColor: edit
                            ? "white"
                            : "rgba(0, 0, 0, 0.1)", // เปลี่ยนสีพื้นหลัง
                          color: edit ? "inherit" : "rgba(255, 255, 255, 0.7)", // เปลี่ยนสีข้อความ
                        },
                      },
                    }}
                  />
                </LocalizationProvider>
                <TextField
                  margin="dense"
                  label="หมายเลขโทรศัพท์"
                  type="text"
                  fullWidth
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  disabled={!edit}
                  sx={{
                    backgroundColor: edit ? "white" : "rgba(0, 0, 0, 0.1)", // เปลี่ยนสีพื้นหลัง
                    color: edit ? "inherit" : "rgba(255, 255, 255, 0.7)", // เปลี่ยนสีข้อความ
                  }}
                />
                <TextField
                  margin="dense"
                  label="โรคประจำตัว"
                  type="text"
                  fullWidth
                  value={newDisease}
                  onChange={(e) => setNewDisease(e.target.value)}
                  disabled={!edit}
                  sx={{
                    backgroundColor: edit ? "white" : "rgba(0, 0, 0, 0.1)", // เปลี่ยนสีพื้นหลัง
                    color: edit ? "inherit" : "rgba(255, 255, 255, 0.7)", // เปลี่ยนสีข้อความ
                  }}
                />
                <TextField
                  margin="dense"
                  label="การแพ้ยา"
                  type="text"
                  fullWidth
                  value={newAllergy}
                  onChange={(e) => setNewAllergy(e.target.value)}
                  disabled={!edit}
                  sx={{
                    backgroundColor: edit ? "white" : "rgba(0, 0, 0, 0.1)", // เปลี่ยนสีพื้นหลัง
                    color: edit ? "inherit" : "rgba(255, 255, 255, 0.7)", // เปลี่ยนสีข้อความ
                  }}
                />
              </DialogContent>

              <DialogActions>
                {edit ? (
                  <>
                    <Button onClick={() => setEdit(false)} color="primary">
                      ยกเลิก
                    </Button>
                    <Button onClick={EditPatient} color="primary" variant="contained"> 
                      บันทึก
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setEdit(true)} color="primary">
                    แก้ไข
                  </Button>
                )}
                <Button onClick={() => setViewPopup(false)} color="primary">
                  ปิด
                </Button>
              </DialogActions>
            </Dialog>

            <Dialog
              open={historyPopup}
              onClose={() => setHistoryPopup(false)}
              maxWidth="lg"
              fullWidth
            >
              <DialogTitle>ประวัติการรักษา</DialogTitle>
              <DialogContent>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>วันที่รักษา</TableCell>
                        <TableCell align="center">ประเภทการรักษา</TableCell>
                        <TableCell align="center">รายการจ่ายยา</TableCell>
                        <TableCell align="center">การรักษาทั่วไป</TableCell>
                        <TableCell align="center">การรักษาผดุงครรภ์</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {treatmentHistory.length > 0 ? (
                        treatmentHistory.map((treatment) => (
                          <TableRow key={treatment.Treatment_ID}>
                            <TableCell>
                              {new Date(treatment.Treatment_Date).toLocaleDateString()}
                            </TableCell>
                            <TableCell align="center">
                              {getTreatmentType(treatment)}
                            </TableCell>
                            <TableCell align="center">
                              <Button
                                variant="outlined"
                                onClick={() =>
                                  handleOpenOrderDetails(treatment.Order_ID)
                                }
                              >
                                ดูรายการจ่ายยา
                              </Button>
                            </TableCell>
                            <TableCell align="center">
                              <Button
                                variant="outlined"
                                onClick={() =>
                                  handleOpenGeneralTreatment(
                                    treatment.GeneralTreatmentID
                                  )
                                }
                                disabled={!treatment.GeneralTreatmentID}
                              >
                                {treatment.GeneralTreatmentID
                                  ? "ดูการรักษาทั่วไป"
                                  : "ไม่มีการรักษาทั่วไป"}
                              </Button>
                            </TableCell>
                            <TableCell align="center">
                              <Button
                                variant="outlined"
                                onClick={() =>
                                  handleOpenPregnancyTreatment(
                                    treatment.PregnancyTreatmentID
                                  )
                                }
                                disabled={!treatment.PregnancyTreatmentID}
                              >
                                {treatment.PregnancyTreatmentID
                                  ? "ดูการรักษาการตั้งครรภ์"
                                  : "ไม่มีการรักษาการตั้งครรภ์"}
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} align="center">
                            ไม่มีข้อมูลการรักษา
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </DialogContent>
            </Dialog>

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

            <Snackbar
              open={snackbarOpen}
              autoHideDuration={1500}
              onClose={handleSnackbarClose}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
              <Alert
                onClose={handleSnackbarClose}
                severity={snackbarType}
                sx={{ width: "100%" }}
              >
                {message}
              </Alert>
            </Snackbar>
            <Dialog
              open={deletePopup}
              onClose={() => setDeletePopup(false)}
              aria-labelledby="delete-dialog-title"
            >
              <DialogTitle id="delete-dialog-title">ยืนยันการลบ</DialogTitle>
              <DialogContent>
                <Typography>
                  คุณแน่ใจหรือว่าต้องการลบข้อมูลผู้ป่วยรายนี้
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setDeletePopup(false)} color="primary">
                  ยกเลิก
                </Button>
                <Button onClick={ConfirmDeletePatient} color="primary">
                  ลบ
                </Button>
              </DialogActions>
            </Dialog>

            <Dialog
              open={addQueuePopup}
              onClose={() => {
                setAddQueuePopup(false);
                ResetForm();
              }}
              aria-labelledby="add-queue-dialog-title"
            >
              <DialogTitle
                id="add-queue-dialog-title"
                style={{ textAlign: "center" }}
              >
                จองคิว
              </DialogTitle>
              <DialogContent>
                <TextField
                  margin="dense"
                  label="อัตราการเต้นหัวใจ"
                  name="อัตราการเต้นหัวใจ"
                  value={treatmentData.Heart_Rate}
                  onChange={(e) =>
                    setTreatmentData({
                      ...treatmentData,
                      Heart_Rate: e.target.value,
                    })
                  }
                  fullWidth
                />
                <TextField
                  margin="dense"
                  label="ความดัน"
                  name="ความดัน"
                  value={treatmentData.Pressure}
                  onChange={(e) =>
                    setTreatmentData({
                      ...treatmentData,
                      Pressure: e.target.value,
                    })
                  }
                  fullWidth
                />
                <TextField
                  margin="dense"
                  label="อุณหภูมิ"
                  name="อุณหภูมิ"
                  value={treatmentData.Temp}
                  onChange={(e) =>
                    setTreatmentData({ ...treatmentData, Temp: e.target.value })
                  }
                  fullWidth
                />
                <TextField
                  margin="dense"
                  label="น้ำหนัก"
                  name="น้ำหนัก"
                  value={treatmentData.Weight}
                  onChange={(e) =>
                    setTreatmentData({
                      ...treatmentData,
                      Weight: e.target.value,
                    })
                  }
                  fullWidth
                />
                <TextField
                  margin="dense"
                  label="ส่วนสูง"
                  name="ส่วนสูง"
                  value={treatmentData.Height}
                  onChange={(e) =>
                    setTreatmentData({
                      ...treatmentData,
                      Height: e.target.value,
                    })
                  }
                  fullWidth
                />
                <TextField
                  margin="dense"
                  label="อาการ"
                  name="อาการ"
                  value={treatmentData.Symptom}
                  onChange={(e) =>
                    setTreatmentData({
                      ...treatmentData,
                      Symptom: e.target.value,
                    })
                  }
                  fullWidth
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setAddQueuePopup(false)} color="primary">
                  ยกเลิก
                </Button>
                <Button onClick={ConfirmAddQueue} color="primary" variant="contained">
                  จองคิว
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        </PaperStyled>
      </ContainerStyled>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={1500}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarType}
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DoctorPatient;
