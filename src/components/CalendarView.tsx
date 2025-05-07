import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Box, Typography } from "@mui/material";


import "@fullcalendar/common/main.css";

interface Customer {
  firstname: string;
  lastname: string;
}

interface Training {
  id: number;
  date: string;
  duration: number;
  activity: string;
  customer: Customer;
}

const CalendarView: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    fetch("https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/gettrainings")
      .then((res) => res.json())
      .then((data: Training[]) => {
        const mapped = data.map((training) => {
          const start = new Date(training.date);
          const end = new Date(start.getTime() + training.duration * 60000);
          const title = `${training.activity} / ${training.customer?.firstname} ${training.customer?.lastname}`;
          return {
            title,
            start,
            end,
          };
        });
        setEvents(mapped);
      })
      .catch((err) => console.error("Error loading trainings:", err));
  }, []);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Training Calendar
      </Typography>
      <Box sx={{ height: "80vh" }}>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={events}
          height="100%"
        />
      </Box>
    </Box>
  );
};

export default CalendarView;
