import React from 'react';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';

const AppointmentUpdates = ({ updates }) => {
  return (
    <Box mt={4}>
      <Typography variant="h6">Appointment Updates</Typography>
      <List>
        {updates.slice(0, 5).map((update, index) => (
          <ListItem key={index}>
            <ListItemText primary={`${update.title} - ${new Date(update.date).toLocaleDateString()}`} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default AppointmentUpdates;
