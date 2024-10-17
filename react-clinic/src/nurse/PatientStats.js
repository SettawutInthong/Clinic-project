import React from "react";
import { Box, Typography } from "@mui/material";

const PatientStats = ({ newPatients, repeatPatients }) => {
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Box textAlign="center" p={2} bgcolor="lightgreen" borderRadius={8}>
          <Typography variant="h5">{newPatients}</Typography>
          <Typography variant="subtitle1">ผู้ป่วยใหม่</Typography>
        </Box>
        <Box textAlign="center" p={2} bgcolor="lightblue" borderRadius={8}>
          <Typography variant="h5">{repeatPatients}</Typography>
          <Typography variant="subtitle1">ผู้ป่วยเก่า</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default PatientStats;
