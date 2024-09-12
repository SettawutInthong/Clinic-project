import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { ButtonGroup } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import DeleteIcon from "@mui/icons-material/Delete";
import AddToQueueIcon from "@mui/icons-material/AddToQueue";

const ContainerStyled = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(10),
}));

const PaperStyled = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
}));

const DoctorQueue = () => {
  const [data, setData] = useState([]);
  const [viewPopup, setViewPopup] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);
  const [selectedHN, setSelectedHN] = useState("");
  const [patient, setPatient] = useState({});
  const [addQueuePopup, setAddQueuePopup] = useState(false);
  const [queueHN, setQueueHN] = useState("");
  const [message, setMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarType, setSnackbarType] = useState("success");
  const [selectedOrder, setSelectedOrder] = useState({});
  const [currentPage, setCurrentPage] = useState(1); // หน้าปัจจุบันเริ่มที่ 1
  const patientsPerPage = 10; // จำนวนผู้ป่วยต่อหน้า
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = data.slice(indexOfFirstPatient, indexOfLastPatient);
  const navigate = useNavigate();

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
    try {
      const response = await axios.get("http://localhost:5000/api/walkinqueue");
      const queueData = response.data.data;

      const patientDataPromises = queueData.map(async (queue) => {
        const patientResponse = await axios.get(
          `http://localhost:5000/api/patient?HN=${queue.HN}`
        );
        const patient = patientResponse.data.data[0];
        return { ...queue, ...patient };
      });

      const patientData = await Promise.all(patientDataPromises);
      const sortedData = patientData.sort((a, b) => a.Queue_ID - b.Queue_ID);
      setData(sortedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const AddQueue = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/patient?HN=${queueHN}`
      );
      const patient = response.data.data[0];
      if (patient) {
        await axios.post("http://localhost:5000/api/walkinqueue", {
          HN: queueHN,
        });
        FetchData();
        setAddQueuePopup(false);
        setQueueHN("");
        showMessage("จองคิวสำเร็จ", "success");
      } else {
        showMessage("ไม่พบ HN ที่ระบุ", "error");
      }
    } catch (error) {
      console.error("Error booking queue:", error);
      showMessage("เกิดข้อผิดพลาดในการจองคิว", "error");
    }
  };

  const DeleteQueue = (HN) => {
    setSelectedHN(HN);
    setDeletePopup(true);
  };

  const ConfirmDeleteQueue = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/walkinqueue/${selectedHN}`);
      FetchData();
      setDeletePopup(false);
      showMessage("ลบข้อมูลผู้ป่วยจากคิวสำเร็จ");
    } catch (error) {
      console.error("Error deleting queue:", error);
      showMessage("เกิดข้อผิดพลาดในการลบข้อมูลผู้ป่วยจากคิว");
    }
  };

  useEffect(() => {
    FetchData();
  }, []);

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
              คิว
            </Typography>
          </Box>
          <div>
            <Box display="flex" justifyContent="flex-end" mb={2}>
              <Button
                variant="contained"
                style={{ height: "40px", width: "150px" }}
                color="success"
                onClick={() => setAddQueuePopup(true)}
              >
                <AddToQueueIcon />
              </Button>
            </Box>

            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ flexGrow: 1, textAlign: "center" }}>
                      ลำดับคิว
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
                      key={row.Queue_ID}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell
                        style={{ flexGrow: 1, textAlign: "center" }}
                        component="th"
                        scope="row"
                      >
                        {row.Queue_ID || "-"}
                      </TableCell>
                      <TableCell style={{ flexGrow: 1, textAlign: "center" }}>
                        {row.Title || "-"}
                      </TableCell>
                      <TableCell style={{ flexGrow: 1, textAlign: "center" }}>
                        {row.First_Name || "-"}
                      </TableCell>
                      <TableCell style={{ flexGrow: 1, textAlign: "center" }}>
                        {row.Last_Name || "-"}
                      </TableCell>
                      <TableCell style={{ flexGrow: 1, textAlign: "center" }}>
                        {row.Gender || "-"}
                      </TableCell>
                      <TableCell style={{ flexGrow: 1, textAlign: "center" }}>
                        <ButtonGroup
                          color="primary"
                          aria-label="outlined primary button group"
                        >
                          <Button
                            onClick={() =>
                              navigate(`/doctor_patientdetail/${row.HN}`)
                            }
                          >
                            <VaccinesIcon />
                          </Button>
                          <Button
                            onClick={() => DeleteQueue(row.HN)}
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

            <Dialog
              open={addQueuePopup}
              onClose={() => setAddQueuePopup(false)}
              aria-labelledby="add-queue-dialog-title"
            >
              <DialogTitle
                id="add-queue-dialog-title"
                style={{ flexGrow: 1, textAlign: "center" }}
              >
                จองคิว
              </DialogTitle>
              <DialogContent>
                <TextField
                  autoFocus
                  margin="dense"
                  label="กรอก HN"
                  type="text"
                  fullWidth
                  value={queueHN}
                  onChange={(e) => setQueueHN(e.target.value)}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setAddQueuePopup(false)} color="primary">
                  ยกเลิก
                </Button>
                <Button onClick={AddQueue} color="primary">
                  จองคิว
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
                ดูข้อมูลผู้ป่วย
              </DialogTitle>
              <DialogContent>
                <Typography>HN: {patient.HN}</Typography>
                <Typography>คำนำหน้า: {patient.Title}</Typography>
                <Typography>ชื่อ: {patient.First_Name}</Typography>
                <Typography>นามสกุล: {patient.Last_Name}</Typography>
                <Typography>เพศ: {patient.Gender}</Typography>
                <Typography>วันเกิด: {patient.Birthdate}</Typography>
                <Typography>หมายเลขโทรศัพท์: {patient.Phone}</Typography>
                <Typography>โรคประจำตัว: {patient.Disease_ID}</Typography>
                <Typography>การแพ้ยา: {patient.Allergy_ID}</Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setViewPopup(false)} color="primary">
                  ปิด
                </Button>
              </DialogActions>
            </Dialog>

            <Dialog
              open={deletePopup}
              onClose={() => setDeletePopup(false)}
              aria-labelledby="delete-dialog-title"
            >
              <DialogTitle id="delete-dialog-title">ยืนยันการลบ</DialogTitle>
              <DialogContent>
                <Typography>
                  คุณแน่ใจหรือว่าต้องการลบข้อมูลผู้ป่วยรายนี้จากคิว
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setDeletePopup(false)} color="primary">
                  ยกเลิก
                </Button>
                <Button onClick={ConfirmDeleteQueue} color="primary">
                  ลบ
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

export default DoctorQueue;
