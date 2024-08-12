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

const NurseBill = () => {
  const [billData, setBillData] = useState([]);
  const [patientName, setPatientName] = useState("");
  const [totalCost, setTotalCost] = useState(0);
  const navigate = useNavigate();

  const FetchBillData = async () => {
    const params = new URLSearchParams(window.location.search);
    const HN = params.get("HN");

    try {
      const orderResponse = await axios.get(
        `http://localhost:5000/api/order_medicine?HN=${HN}`
      );
      const order = orderResponse.data.data;
      const orderID = order.Order_ID;

      const patientResponse = await axios.get(
        `http://localhost:5000/api/patient/${HN}`
      );
      const patient = patientResponse.data.data[0];
      setPatientName(`${patient.First_Name} ${patient.Last_Name}`);

      const medicineResponse = await axios.get(
        `http://localhost:5000/api/medicine_details?Order_ID=${orderID}`
      );
      const medicines = medicineResponse.data.data;

      let totalCost = 0;
      const billDetails = medicines.map((item) => {
        const itemTotal = item.Med_Cost * item.Quantity_Order;
        totalCost += itemTotal;
        return {
          Medicine_Name: item.Medicine_Name,
          Quantity_Order: item.Quantity_Order,
          Med_Cost: item.Med_Cost,
          Item_Total: itemTotal,
        };
      });

      setBillData(billDetails);
      setTotalCost(totalCost);
    } catch (error) {
      console.error("Error fetching bill data:", error);
    }
  };

  useEffect(() => {
    FetchBillData();
  }, []);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <ContainerStyled maxWidth="lg">
        <PaperStyled>
          <Typography variant="h6" gutterBottom style={{ textAlign: "center" }}>
            ใบเสร็จ
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
                    รายการ
                  </TableCell>
                  <TableCell style={{ flexGrow: 1, textAlign: "center" }}>
                    จำนวน
                  </TableCell>
                  <TableCell style={{ flexGrow: 1, textAlign: "center" }}>
                    ราคาต่อหน่วย
                  </TableCell>
                  <TableCell style={{ flexGrow: 1, textAlign: "center" }}>
                    ราคา
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {billData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell style={{ flexGrow: 1, textAlign: "center" }}>
                      {row.Medicine_Name || "-"}
                    </TableCell>
                    <TableCell style={{ flexGrow: 1, textAlign: "center" }}>
                      {row.Quantity_Order || "-"}
                    </TableCell>
                    <TableCell style={{ flexGrow: 1, textAlign: "center" }}>
                      {row.Med_Cost || "-"}
                    </TableCell>
                    <TableCell style={{ flexGrow: 1, textAlign: "center" }}>
                      {row.Item_Total || "-"}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={3} style={{ textAlign: "center" }}>
                    ราคารวม
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {totalCost}
                  </TableCell>
                </TableRow>
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
              onClick={() => navigate(-1)}
            >
              ย้อนกลับ
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/nurse_queue")}
            >
              เสร็จสิ้น
            </Button>
          </Box>
        </PaperStyled>
      </ContainerStyled>
    </Box>
  );
};

export default NurseBill;
