import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Grid, Paper } from '@mui/material';

const Dashboard = () => {
  const [newPatients, setNewPatients] = useState(0);
  const [oldPatients, setOldPatients] = useState(0);

  useEffect(() => {
    fetchPatientCounts();
  }, []);

  const fetchPatientCounts = async () => {
    try {
      const newResponse = await axios.get('http://localhost:5000/api/new_patients');
      const oldResponse = await axios.get('http://localhost:5000/api/repeat_patients'); // แก้ไขเส้นทางให้ตรงกับ backend

      setNewPatients(newResponse.data.newPatients); // แก้ไขชื่อข้อมูลที่ดึงมา
      setOldPatients(oldResponse.data.repeatPatients); // แก้ไขชื่อข้อมูลที่ดึงมา
    } catch (error) {
      console.error('Error fetching patient counts:', error);
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              backgroundColor: '#4caf50',
              borderRadius: '12px',
              padding: 2,
              color: '#fff',
              textAlign: 'center',
            }}
          >
            <Typography variant="h6">ผู้ป่วยใหม่</Typography>
            <Typography variant="h3">{newPatients}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              backgroundColor: '#2196f3',
              borderRadius: '12px',
              padding: 2,
              color: '#fff',
              textAlign: 'center',
            }}
          >
            <Typography variant="h6">ผู้ป่วยเก่า</Typography>
            <Typography variant="h3">{oldPatients}</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
