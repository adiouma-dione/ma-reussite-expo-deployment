import { useEffect } from "react";
import { jsonrpcRequest } from "../api/apiClient";
import config from "../api/config";
import { formatOdooEvents } from "../utils/MarkedDatesFormatage";
import CalendarLocalConfig from "../utils/CalendarLocalConfig";

const manageEvents = (
  connectedUser,
  setEvents,
  events,
  setMarkedDate,
  markedDate,
  setToday,
  setTodaysEvents
) => {
  const { sessionId, password, partnerid } = connectedUser;
  //   useEffect(async () => {
  //   const fetchEvents =
  async () => {
    try {
      const eventsData = await jsonrpcRequest(
        sessionId,
        password,
        config.model.craftSession,
        [[["partner_ids", "=", partnerid[0]]]],
        [
          "classroom_id",
          "recurrency",
          "rrule",
          "start",
          "stop",
          "subject_id",
          "teacher_id",
          "description",
        ]
      );
      // console.log("eventsData[0]...", eventsData[0]);
      setEvents(eventsData);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };
  // if (sessionId && password) {
  //   fetchEvents();
  // }
  //   }, [sessionId, password, partnerid]);

  //   useEffect(() => {
  //   if (events) {
  const formatedOdooEvents = formatOdooEvents(events);
  setMarkedDate(formatedOdooEvents);
  //   }
  //   }, [events]);

  //   useEffect(() => {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const day = today.getDate().toString().padStart(2, "0");
  const dayOfWeek = CalendarLocalConfig?.dayNamesShort[today.getDay()];

  const currentDay = `${year}-${month}-${day}`;
  setToday(`${dayOfWeek} ${day}`);
  setTodaysEvents(markedDate[currentDay]?.dots);
  //   }, [markedDate]);
};
export default manageEvents;
