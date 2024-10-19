import React, { useState  ,useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {Paper,TextField,Button,Typography,Snackbar,Alert,Box,Grid,ButtonGroup,} from "@mui/material";

const AddTreatment = () => {
  const { HN } = useParams();
  const [treatmentDetails, setTreatmentDetails] = useState(
    localStorage.getItem("treatmentDetails") || ""
  );
  const [treatmentCost, setTreatmentCost] = useState(
    localStorage.getItem("treatmentCost") || ""
  );
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [orderID, setOrderID] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Update localStorage when the inputs change
    localStorage.setItem("treatmentDetails", treatmentDetails);
    localStorage.setItem("treatmentCost", treatmentCost);
  }, [treatmentDetails, treatmentCost]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/treatments",
        {
          HN,
          treatmentDetails,
          treatmentCost,
        }
      );

      setOrderID(response.data.Order_ID);
      setSnackbarMessage("บันทึกข้อมูลสำเร็จ");
      setSnackbarOpen(true);

      // Clear localStorage after successful submission
      // localStorage.removeItem("treatmentDetails");
      // localStorage.removeItem("treatmentCost");
    } catch (error) {
      console.error("Error adding treatment:", error);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    navigate(`/doctor_addorder/${HN}/${orderID}`);
  };

  return (
    <Paper sx={{ padding: 3 }}>
      <Typography variant="h6">ข้อมูลการรักษา</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="รายละเอียดการรักษา"
          fullWidth
          value={treatmentDetails}
          onChange={(e) => setTreatmentDetails(e.target.value)}
          multiline
          rows={4}
          sx={{ mb: 2 }}
        />
        <TextField
          label="ค่าใช้จ่าย"
          fullWidth
          value={treatmentCost}
          onChange={(e) => setTreatmentCost(e.target.value)}
          type="number"
          sx={{ mb: 2 }}
        />

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
              onClick={() => navigate(`/doctor_treatmenthistory/${HN}`)}
              color="error"
            >
              กลับ
            </Button>
            <Button variant="contained" color="secondary" type="submit">
              บันทึกและสั่งยา
            </Button>
          </Box>
        </Grid>
      </form>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default AddTreatment;