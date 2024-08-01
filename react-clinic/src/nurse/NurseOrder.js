import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
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

const ContainerStyled = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(10),
}));

const PaperStyled = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
}));

const NurseOrder = () => {
  const { search } = useLocation();
  const HN = new URLSearchParams(search).get("HN");
  const [order, setOrder] = useState(null);

  const FetchOrderData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/order_medicine?HN=${HN}`
      );
      setOrder(response.data.data);
    } catch (error) {
      console.error("Error fetching order data:", error);
    }
  };

  useEffect(() => {
    FetchOrderData();
  }, [HN]);

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
              รายการยา
            </Typography>
          </Box>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell style={{ flexGrow: 1, textAlign: "center" }}>
                    Order ID
                  </TableCell>
                  <TableCell style={{ flexGrow: 1, textAlign: "center" }}>
                    Medicine ID
                  </TableCell>
                  <TableCell style={{ flexGrow: 1, textAlign: "center" }}>
                    HN
                  </TableCell>
                  <TableCell style={{ flexGrow: 1, textAlign: "center" }}>
                    Quantity
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {order ? (
                  <TableRow>
                    <TableCell style={{ flexGrow: 1, textAlign: "center" }}>
                      {order.Order_ID || "-"}
                    </TableCell>
                    <TableCell style={{ flexGrow: 1, textAlign: "center" }}>
                      {order.Medicine_ID || "-"}
                    </TableCell>
                    <TableCell style={{ flexGrow: 1, textAlign: "center" }}>
                      {order.HN || "-"}
                    </TableCell>
                    <TableCell style={{ flexGrow: 1, textAlign: "center" }}>
                      {order.Quantity_Order || "-"}
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} style={{ textAlign: "center" }}>
                      Loading...
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </PaperStyled>
      </ContainerStyled>
    </Box>
  );
};

export default NurseOrder;
