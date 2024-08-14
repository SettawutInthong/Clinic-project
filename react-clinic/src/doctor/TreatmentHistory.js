import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {Box,ButtonGroup,Grid,Typography,Paper,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Button,
  Dialog,DialogTitle,DialogContent,List,ListItem,ListItemText,} from "@mui/material";

const TreatmentHistory = () => {
  const { HN } = useParams();
  const [treatments, setTreatments] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState([]);
  const [dialogState, setDialogState] = useState({
    open: false,
    selectedOrder: [],
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTreatments = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/treatments/${HN}`
        );
        setTreatments(response.data.data || []);
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
    <Paper>
      <Typography variant="h6" style={{ margin: "20px" }}>
        ประวัติการรักษาของผู้ป่วย HN: {HN}
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>วันที่รักษา</TableCell>
              <TableCell>รายละเอียดการรักษา</TableCell>
              <TableCell>ค่าใช้จ่าย</TableCell>
              <TableCell>ราคารวม</TableCell>
              <TableCell>ดูออเดอร์</TableCell>
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
                  <TableCell>
                    <Button
                      variant="outlined"
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
      <Dialog open={dialogState.open} onClose={handleClose}>
        <DialogTitle>รายการยาในออเดอร์</DialogTitle>
        <DialogContent>
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
            onClick={() => navigate(`/doctor_addtreatment/${HN}`)}
          >
            ถัดไป
          </Button>
        </Box>
      </Grid>
    </Paper>
  );
};

export default TreatmentHistory;
