import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Grid, ButtonGroup, TextField, Button, Box, Typography, Paper } from '@mui/material';

const AddTreatment = () => {
  const { HN } = useParams();
  const [treatmentDetails, setTreatmentDetails] = useState('');
  const [treatmentCost, setTreatmentCost] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/treatments', {
        HN,
        Treatment_Details: treatmentDetails,
        Treatment_cost: treatmentCost
      });

      console.log('Treatment added:', response.data);
      navigate(`/doctor_treatmenthistory/${HN}`);
    } catch (error) {
      console.error('Error adding treatment:', error);
    }
  };
  
  return (
    <Paper sx={{ padding: 3 }}>
      <Typography variant="h6" gutterBottom>
        เพิ่มข้อมูลวินิจฉัยสำหรับผู้ป่วย HN: {HN}
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="รายละเอียดการรักษา"
          variant="outlined"
          value={treatmentDetails}
          onChange={(e) => setTreatmentDetails(e.target.value)}
          fullWidth
        />
        <TextField
          label="ค่าใช้จ่าย"
          variant="outlined"
          type="number"
          value={treatmentCost}
          onChange={(e) => setTreatmentCost(e.target.value)}
          fullWidth
        />
        <Button variant="contained" color="primary" type="submit">
          บันทึก
        </Button>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <ButtonGroup
              color="primary"
              aria-label="outlined primary button group"
              style={{ display: "flex", justifyContent: "center", marginTop: "16px" }}
            >
              <Button onClick={() => navigate(`/doctor_treatmenthistory/${HN}`)} color="error">
                กลับ
              </Button>
              <Button onClick={() => navigate(`/doctor_addorder/${HN}`)}>
                ถัดไป
              </Button>
            </ButtonGroup>
          </Box>
        </Grid>
      </Box>
    </Paper>
  );
};

export default AddTreatment;
