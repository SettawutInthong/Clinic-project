import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import { useNavigate } from "react-router-dom"; // import useNavigate

const TreatmentHistory = ({ HN }) => {
  const [treatments, setTreatments] = useState([]); // เก็บข้อมูลประวัติการรักษา
  const [dialogState, setDialogState] = useState({
    open: false,
    selectedOrder: [],
  });
  const navigate = useNavigate(); // initialize navigate hook

  useEffect(() => {
    const fetchTreatments = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/treatments/${HN}`
        );
        setTreatments(response.data.data || []); // เก็บข้อมูลการรักษา
      } catch (error) {
        console.error("Error fetching treatment data:", error);
      }
    };
    fetchTreatments();
  }, [HN]);

  const handleOpen = async (orderID) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/medicine_details?Order_ID=${orderID}`
      );
      setDialogState({ open: true, selectedOrder: response.data.data || [] });
    } catch (error) {
      console.error("Error fetching order details:", error);
      setDialogState({ open: true, selectedOrder: [] });
    }
  };

  const handleClose = () => {
    setDialogState({ open: false, selectedOrder: [] });
  };

  return (
    <Paper sx={{ padding: 3, margin: 2 }}>
      <Typography variant="h6" gutterBottom>
        ประวัติการรักษา
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>วันที่รักษา</TableCell>
              <TableCell>รายละเอียดการรักษา</TableCell>
              <TableCell>ค่าใช้จ่าย</TableCell>
              <TableCell>ราคารวม</TableCell>
              <TableCell align="center">ดูออเดอร์</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {treatments.length > 0 ? (
              treatments.map((treatment) => (
                <TableRow key={treatment.Treatment_ID}>
                  <TableCell>
                    {new Date(treatment.Treatment_Date).toLocaleDateString(
                      "th-TH"
                    )}
                  </TableCell>
                  <TableCell>{treatment.Treatment_Details}</TableCell>
                  <TableCell>{treatment.Treatment_cost}</TableCell>
                  <TableCell>
                    {treatment.Total_Cost != null
                      ? parseFloat(treatment.Total_Cost).toFixed(2)
                      : "-"}
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleOpen(treatment.Order_ID)}
                    >
                      ดูออเดอร์
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} style={{ textAlign: "center" }}>
                  ไม่มีข้อมูลการรักษา
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Popup แสดงรายละเอียดออเดอร์ */}
      <Dialog open={dialogState.open} onClose={handleClose} maxWidth="sm" fullWidth>
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

      {/* เพิ่มปุ่มกลับและปุ่มต่อไป */}
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
            color="secondary"
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
