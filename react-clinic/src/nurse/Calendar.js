import React from 'react';
import { Calendar as ReactCalendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const Calendar = ({ appointments }) => {
  return (
    <div>
      <h3>Calendar</h3>
      <ReactCalendar
        tileContent={({ date, view }) => {
          const appointment = appointments.find(
            (app) => new Date(app.date).toDateString() === date.toDateString()
          );
          return appointment ? <p>{appointment.title}</p> : null;
        }}
      />
    </div>
  );
};

export default Calendar;
