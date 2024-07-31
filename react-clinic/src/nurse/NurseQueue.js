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

const ContainerStyled = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const PaperStyled = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
}));

const NurseQueue = () => {
  const [data, setData] = useState([]);
  const [viewPopup, setViewPopup] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);
  const [selectedHN, setSelectedHN] = useState("");
  const [patient, setPatient] = useState({});
  const [message, setMessage] = useState("");

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
      setData(patientData);
    } catch (error) {
      console.error("Error fetching data:", error);
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
      setMessage("");
    } catch (error) {
      console.error("Error deleting queue:", error);
      setMessage("เกิดข้อผิดพลาดในการลบข้อมูลผู้ป่วยจากคิว");
    }
  };

  const ViewPatient = async (HN) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/patient?HN=${HN}`
      );
      const patient = response.data.data[0];
      if (patient) {
        setPatient(patient);
        setSelectedHN(HN);
        setViewPopup(true);
      }
    } catch (error) {
      console.error("Error viewing patient:", error);
      setMessage("เกิดข้อผิดพลาดในการดูข้อมูลผู้ป่วย");
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
              รายชื่อผู้ป่วยในคิว
            </Typography>
          </Box>
          <div>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ flexGrow: 1, textAlign: "center" }}>
                      คิว
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
                  {data.map((row) => (
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
                        {row.Queue_ID}
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
                          <Button onClick={() => ViewPatient(row.HN)}>
                            ดูรายการ
                          </Button>
                          <Button onClick={() => DeleteQueue(row.HN)}>
                            ลบ
                          </Button>
                        </ButtonGroup>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

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

            {message && <p>{message}</p>}
          </div>
        </PaperStyled>
      </ContainerStyled>
    </Box>
  );
};

export default NurseQueue;
