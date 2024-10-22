import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Alert,
  IconButton,
  ButtonGroup,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useNavigate, useParams } from "react-router-dom";

const AddOrder = () => {
  const { HN } = useParams(); 
  const [orderID, setOrderID] = useState(null);
  const [medicines, setMedicines] = useState([]); 
  const [searchName, setSearchName] = useState("");  
  const [selectedMedicine, setSelectedMedicine] = useState(null); 
  const [quantity, setQuantity] = useState(1); 
  const [orderItems, setOrderItems] = useState([]); 
  const [treatmentCost, setTreatmentCost] = useState(""); 
  const [openSnackbar, setOpenSnackbar] = useState(false); 
  const [openMedicineDialog, setOpenMedicineDialog] = useState(false); 
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false); 
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editQuantity, setEditQuantity] = useState(1);  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLatestOrder = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/order_medicine?HN=${HN}`);
        if (response.data && response.data.data) {
          const latestOrder = response.data.data;
          setOrderID(latestOrder.Order_ID); 
        }
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึง Order ล่าสุด:", error);
      }
    };

    fetchLatestOrder();
  }, [HN]);

  useEffect(() => {
    const savedOrderItems = JSON.parse(localStorage.getItem("orderItems"));
    const savedTreatmentCost = localStorage.getItem("treatmentCost");
    const savedSelectedMedicine = JSON.parse(localStorage.getItem("selectedMedicine"));
    const savedQuantity = localStorage.getItem("quantity");

    if (savedOrderItems) {
      setOrderItems(savedOrderItems);
    }
    if (savedTreatmentCost) {
      setTreatmentCost(savedTreatmentCost);
    }
    if (savedSelectedMedicine) {
      setSelectedMedicine(savedSelectedMedicine);
    }
    if (savedQuantity) {
      setQuantity(parseInt(savedQuantity));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("orderItems", JSON.stringify(orderItems));
    localStorage.setItem("treatmentCost", treatmentCost);
    localStorage.setItem("selectedMedicine", JSON.stringify(selectedMedicine));
    localStorage.setItem("quantity", quantity);
  }, [orderItems, treatmentCost, selectedMedicine, quantity]);

  useEffect(() => {
    if (searchName) {
      const fetchMedicines = async () => {
        try {
          const response = await axios.get(
            "http://localhost:5000/api/medicines",
            {
              params: { medicineName: searchName }, 
            }
          );
          setMedicines(response.data.data);
        } catch (error) {
          console.error("Error fetching medicines:", error);
        }
      };
      fetchMedicines();
    }
  }, [searchName]);

  const handleOpenEditDialog = (index, currentQuantity) => {
    setEditIndex(index); 
    setEditQuantity(currentQuantity); 
    setOpenEditDialog(true); 
  };

  const handleConfirmEdit = () => {
    if (editQuantity > 0) {
      const updatedOrderItems = [...orderItems];
      updatedOrderItems[editIndex].Quantity = editQuantity; 
      setOrderItems(updatedOrderItems); 
      localStorage.setItem("orderItems", JSON.stringify(updatedOrderItems)); 
    }

    setOpenEditDialog(false); 
  };


  const handleAddMedicine = () => {
    if (selectedMedicine && quantity > 0) {
      const existingItemIndex = orderItems.findIndex(
        (item) => item.Medicine_ID === selectedMedicine.Medicine_ID
      );
  
      if (existingItemIndex !== -1) {
        const updatedOrderItems = [...orderItems];
        updatedOrderItems[existingItemIndex].Quantity = 
          parseInt(updatedOrderItems[existingItemIndex].Quantity) + parseInt(quantity);
  
        setOrderItems(updatedOrderItems); 
        localStorage.setItem("orderItems", JSON.stringify(updatedOrderItems)); 
      } else {
        const newItem = {
          Medicine_ID: selectedMedicine.Medicine_ID,
          Medicine_Name: selectedMedicine.Medicine_Name,
          Quantity: parseInt(quantity),
        };
        const updatedOrderItems = [...orderItems, newItem];
        setOrderItems(updatedOrderItems);
        localStorage.setItem("orderItems", JSON.stringify(updatedOrderItems)); 
      }
  
      setSelectedMedicine(null);
      setQuantity(1);
    } else {
      alert("กรุณากรอกจำนวนมากกว่า 0"); 
    }
  };

  const handleRemoveItem = (index) => {
    const updatedItems = orderItems.filter((_, i) => i !== index);
    setOrderItems(updatedItems);
    localStorage.setItem("orderItems", JSON.stringify(updatedItems)); 
  };

  const handleConfirmSubmit = async () => {
    setConfirmDialogOpen(false);
  
    try {
      const orderData = {
        items: orderItems, // ส่งรายการยาตามที่มี ไม่ต้องเช็ค
        treatmentCost, // สามารถเป็นค่าว่างได้ถ้าไม่มี
      };
  
      if (orderID) {
        await axios.post(
          `http://localhost:5000/api/orders/${orderID}/items`,
          orderData
        );
  
        await axios.put(`http://localhost:5000/api/walkinqueue/${HN}`, {
          Status: "รอจ่ายยา",
        });
  
        localStorage.removeItem("orderItems");
        localStorage.removeItem("treatmentCost");
        localStorage.removeItem("selectedMedicine");
        localStorage.removeItem("quantity");
  
        setOpenSnackbar(true);
        setOrderItems([]); 
        navigate("/doctor_queue"); 
      } else {
        console.error("ไม่พบ Order_ID สำหรับการบันทึกออเดอร์");
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการบันทึกออเดอร์:", error.message);
    }
  };
  

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const handleSubmitOrder = () => {
    setConfirmDialogOpen(true);
  };

  return (
    <Box sx={{ flexGrow: 1, padding: 3 }}>
      <Paper sx={{ padding: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <ButtonGroup variant="outlined" color="primary">
            <Button onClick={() => navigate(`/doctor_patientdetail/${HN}`)}><PlayArrowIcon style={{ transform: "rotate(180deg)" }} /> <PlayArrowIcon style={{ transform: "rotate(180deg)" }} /> <PlayArrowIcon style={{ transform: "rotate(180deg)" }} /> ไปยังประวัติผู้ป่วย</Button>
            <Button onClick={() => navigate(`/doctor_treatmenthistory/${HN}`)}><PlayArrowIcon style={{ transform: "rotate(180deg)" }} /> <PlayArrowIcon style={{ transform: "rotate(180deg)" }} /> ไปยังประวัติการรักษา</Button>
            <Button onClick={() => navigate(`/doctor_addtreatment/${HN}`)}><PlayArrowIcon style={{ transform: "rotate(180deg)" }} /> ไปยังบันทึกการรักษา</Button>
          </ButtonGroup>
        </Box>
        <Typography variant="h6" gutterBottom>
          สั่งยาสำหรับผู้ป่วย HN: {HN}
        </Typography>

        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField
            label="ค้นหายา"
            variant="outlined"
            fullWidth
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenMedicineDialog(true)}
          >
            ค้นหา
          </Button>
        </Box>

        <TableContainer component={Paper} sx={{ mb: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ชื่อยา</TableCell>
                <TableCell>จำนวน</TableCell>
                <TableCell>ลบ</TableCell>
                <TableCell>แก้ไข</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orderItems.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.Medicine_Name}</TableCell>
                  <TableCell>{item.Quantity}</TableCell>

                  <TableCell>
                    <IconButton
                      onClick={() => handleRemoveItem(index)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>

                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleOpenEditDialog(index, item.Quantity)}
                    >
                      แก้ไข
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>


          </Table>
        </TableContainer>

        <TextField
          label="ราคาค่ารักษา"  // เพิ่ม input field สำหรับค่ารักษา
          type="number"
          variant="outlined"
          fullWidth
          value={treatmentCost}
          onChange={(e) => setTreatmentCost(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
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
            onClick={handleSubmitOrder}
            disabled={!orderID}  // ถ้าไม่มี orderID ให้ปิดปุ่มบันทึก
          >
            บันทึกออเดอร์
          </Button>
        </Box>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert onClose={handleSnackbarClose} severity="success">
            บันทึกออเดอร์สำเร็จ
          </Alert>
        </Snackbar>

        <Dialog
          open={openMedicineDialog}
          onClose={() => setOpenMedicineDialog(false)}
        >
          <DialogTitle>ค้นหายา</DialogTitle>
          <DialogContent>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>ชื่อยา</TableCell>
                    <TableCell>เลือก</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {medicines.map((medicine) => (
                    <TableRow key={medicine.Medicine_ID}>
                      <TableCell>{medicine.Medicine_ID}</TableCell>
                      <TableCell>{medicine.Medicine_Name}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => {
                            setSelectedMedicine(medicine);
                          }}
                        >
                          เลือก
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {selectedMedicine && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  ยาที่เลือก: {selectedMedicine.Medicine_Name}
                </Typography>
                <TextField
                  label="จำนวน"
                  type="number"
                  variant="outlined"
                  fullWidth
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                  onClick={handleAddMedicine}
                >
                  เพิ่มยาในออเดอร์
                </Button>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setOpenMedicineDialog(false)}
              color="primary"
            >
              ปิด
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
          <DialogTitle>แก้ไขจำนวนยา</DialogTitle>
          <DialogContent>
            <TextField
              label="จำนวน"
              type="number"
              fullWidth
              variant="outlined"
              value={editQuantity}
              onChange={(e) => setEditQuantity(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEditDialog(false)} color="primary">
              ยกเลิก
            </Button>
            <Button onClick={handleConfirmEdit} color="primary">
              ยืนยัน
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={confirmDialogOpen}
          onClose={() => setConfirmDialogOpen(false)}
        >
          <DialogTitle>ยืนยันการบันทึกออเดอร์</DialogTitle>
          <DialogContent>
            <Typography>คุณต้องการบันทึกออเดอร์ใช่หรือไม่?</Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setConfirmDialogOpen(false)}
              color="primary"
            >
              ยกเลิก
            </Button>
            <Button onClick={handleConfirmSubmit} color="secondary">
              ยืนยัน
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Box>
  );
};

export default AddOrder;
