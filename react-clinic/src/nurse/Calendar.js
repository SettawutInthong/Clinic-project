import React from 'react';
import { Calendar as ReactCalendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const Calendar = ({ appointments }) => {
  return (
    <div>
      <h3>Calendar</h3>
      <ReactCalendar
  tileContent={({ date, view }) => {
    // ตรวจสอบว่า appointments เป็น array ก่อนเรียกใช้ find
    const appointment =
      Array.isArray(appointments) &&
      appointments.find(
        (app) => new Date(app.Queue_Date).toDateString() === date.toDateString()
      );
    return appointment ? <p>{appointment.title}</p> : null;
  }}
/>

    </div>
  );
};

export default Calendar;
