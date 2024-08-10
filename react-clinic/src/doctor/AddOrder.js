import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Button, TextField, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, Alert, IconButton,
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate, useParams } from "react-router-dom";

const AddOrder = () => {
    const { HN } = useParams();
    const [medicines, setMedicines] = useState([]);
    const [searchName, setSearchName] = useState("");
    const [selectedMedicine, setSelectedMedicine] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [orderItems, setOrderItems] = useState([]);
    const [doctorFee, setDoctorFee] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [openMedicineDialog, setOpenMedicineDialog] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (searchName) {
            const fetchMedicines = async () => {
                try {
                    const response = await axios.get("http://localhost:5000/api/medicines", {
                        params: { medicineName: searchName },
                    });
                    setMedicines(response.data.data);
                } catch (error) {
                    console.error("Error fetching medicines:", error);
                }
            };
            fetchMedicines();
        }
    }, [searchName]);

    const handleAddMedicine = () => {
        if (selectedMedicine && quantity > 0) {
            const newItem = {
                Medicine_ID: selectedMedicine.Medicine_ID,
                Medicine_Name: selectedMedicine.Medicine_Name,
                Quantity: quantity,
                Med_Cost: selectedMedicine.Med_Cost,
            };
            setOrderItems([...orderItems, newItem]);
            setSelectedMedicine(null);
            setQuantity(1);
        }
    };

    const handleRemoveItem = (index) => {
        const updatedItems = orderItems.filter((_, i) => i !== index);
        setOrderItems(updatedItems);
    };

    const handleSubmitOrder = async () => {
        try {
            const orderData = {
                HN,
                items: orderItems,
                doctorFee,
            };

            await axios.post("http://localhost:5000/api/orders", orderData);
            setOpenSnackbar(true);
            setOrderItems([]);
            setDoctorFee("");
        } catch (error) {
            console.error("Error submitting order:", error);
        }
    };

    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
    };

    return (
        <Paper sx={{ padding: 3 }}>
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
                <Button variant="contained" color="primary" onClick={() => setOpenMedicineDialog(true)}>
                    ค้นหา
                </Button>
            </Box>

            <TableContainer component={Paper} sx={{ mb: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ชื่อยา</TableCell>
                            <TableCell>จำนวน</TableCell>
                            <TableCell>ราคา</TableCell>
                            <TableCell>ลบ</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orderItems.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>{item.Medicine_Name}</TableCell>
                                <TableCell>{item.Quantity}</TableCell>
                                <TableCell>{item.Med_Cost * item.Quantity}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleRemoveItem(index)} color="error">
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <TextField
                label="ค่ารักษา"
                variant="outlined"
                fullWidth
                value={doctorFee}
                onChange={(e) => setDoctorFee(e.target.value)}
                sx={{ mb: 2 }}
            />

            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                <Button variant="contained" color="secondary" onClick={() => navigate(`/doctor_addtreatment/${HN}`)}>
                    กลับ
                </Button>
                <Button variant="contained" color="primary" onClick={handleSubmitOrder} disabled={orderItems.length === 0 || !doctorFee}>
                    บันทึกออเดอร์
                </Button>
            </Box>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity="success">
                    บันทึกออเดอร์สำเร็จ
                </Alert>
            </Snackbar>

            <Dialog open={openMedicineDialog} onClose={() => setOpenMedicineDialog(false)}>
                <DialogTitle>ค้นหายา</DialogTitle>
                <DialogContent>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>ชื่อยา</TableCell>
                                    <TableCell>ราคา</TableCell>
                                    <TableCell>เลือก</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {medicines.map((medicine) => (
                                    <TableRow key={medicine.Medicine_ID}>
                                        <TableCell>{medicine.Medicine_ID}</TableCell>
                                        <TableCell>{medicine.Medicine_Name}</TableCell>
                                        <TableCell>{medicine.Med_Cost}</TableCell>
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
                            <TextField
                                label="จำนวน"
                                type="number"
                                variant="outlined"
                                fullWidth
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                            />
                            <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleAddMedicine}>
                                เพิ่มยาในออเดอร์
                            </Button>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenMedicineDialog(false)} color="primary">
                        ปิด
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
};

export default AddOrder;
