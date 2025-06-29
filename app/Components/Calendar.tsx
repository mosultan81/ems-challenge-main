import { useState, useEffect } from "react";
import { useCalendarApp, ScheduleXCalendar } from "@schedule-x/react";
import {
  createViewDay,
  createViewWeek,
  createViewMonthGrid,
  createViewMonthAgenda,
} from "@schedule-x/calendar";
import { createEventsServicePlugin } from "@schedule-x/events-service";
import "@schedule-x/theme-default/dist/index.css";

interface Event {
  id: string;
  title: string;
  start: string;
  end: string;
}

interface CalendarAppProps {
  events: Event[];
}

export default function CalendarApp({ events }: CalendarAppProps) {
  const [eventsService] = useState(() => createEventsServicePlugin());

  const calendar = useCalendarApp({
    views: [
      createViewDay(),
      createViewWeek(),
      createViewMonthGrid(),
      createViewMonthAgenda(),
    ],
    events,
    plugins: [eventsService],
  });

  useEffect(() => {
    eventsService.getAll();
  }, [eventsService]);

  return (
    <div style={{ height: "600px" }}>
      <ScheduleXCalendar calendarApp={calendar} />
    </div>
  );
}
