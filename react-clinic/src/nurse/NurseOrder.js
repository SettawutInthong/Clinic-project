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
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

const ContainerStyled = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(10),
}));

const PaperStyled = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
}));

const NurseOrder = () => {
  const [orderData, setOrderData] = useState([]);
  const [patientName, setPatientName] = useState("");
  const [orderID, setOrderID] = useState("");
  const navigate = useNavigate();

  const FetchOrderData = async () => {
    const params = new URLSearchParams(window.location.search);
    const HN = params.get("HN");

    try {
      const response = await axios.get(
        `http://localhost:5000/api/order_medicine?HN=${HN}`
      );
      const order = response.data.data;
      setOrderID(order.Order_ID);

      const patientResponse = await axios.get(
        `http://localhost:5000/api/patient/${HN}`
      );
      const patient = patientResponse.data.data[0];
      setPatientName(`${patient.First_Name} ${patient.Last_Name}`);

      const medicineResponse = await axios.get(
        `http://localhost:5000/api/medicine_details?Order_ID=${order.Order_ID}`
      );
      setOrderData(medicineResponse.data.data);
    } catch (error) {
      console.error("Error fetching order data:", error);
    }
  };

  useEffect(() => {
    FetchOrderData();
  }, []);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <ContainerStyled maxWidth="lg">
        <PaperStyled>
          <Typography variant="h6" gutterBottom style={{ textAlign: "center" }}>
            รายการยา
          </Typography>
          <Typography
            variant="subtitle1"
            gutterBottom
            style={{ textAlign: "left" }}
          >
            ชื่อ: {patientName}
          </Typography>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell style={{ flexGrow: 1, textAlign: "center" }}>
                    ชื่อยา
                  </TableCell>
                  <TableCell style={{ flexGrow: 1, textAlign: "center" }}>
                    จำนวน
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orderData.map((row) => (
                  <TableRow key={row.Medicine_ID}>
                    <TableCell style={{ flexGrow: 1, textAlign: "center" }}>
                      {row.Medicine_Name || "-"}
                    </TableCell>
                    <TableCell style={{ flexGrow: 1, textAlign: "center" }}>
                      {row.Quantity_Order || "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box display="flex" justifyContent="center" mt={2}>
            <Button
              variant="outlined"
              style={{
                color: "#1976d2",
                borderColor: "#1976d2",
                textTransform: "none",
                marginRight: "10px",
              }}
              onClick={() =>
                navigate(
                  `/nurse_queue?HN=${new URLSearchParams(
                    window.location.search
                  ).get("HN")}`
                )
              }
            >
              ย้อนกลับ
            </Button>
            <Button
              variant="contained"
              onClick={() =>
                navigate(
                  `/nurse_bill?HN=${new URLSearchParams(
                    window.location.search
                  ).get("HN")}`
                )
              }
            >
              ถัดไป
            </Button>
          </Box>
        </PaperStyled>
      </ContainerStyled>
    </Box>
  );
};

export default NurseOrder;
