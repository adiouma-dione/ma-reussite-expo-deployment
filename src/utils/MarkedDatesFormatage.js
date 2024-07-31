import { RRule } from "rrule";
import MA_REUSSITE_CUSTOM_COLORS from "../themes/variables";

const generateRecurrenceDates = (event) => {
  const rule = RRule.fromString(event.rrule);
  const dates = rule.all();

  return dates.map((date) => {
    const startDate = new Date(date);
    const endDate = new Date(date);

    const [startHour, startMinute, startSecond] = event.start
      .split(" ")[1]
      .split(":");
    const [endHour, endMinute, endSecond] = event.stop.split(" ")[1].split(":");

    startDate.setHours(startHour, startMinute, startSecond);
    endDate.setHours(endHour, endMinute, endSecond);

    return {
      start: startDate,
      stop: endDate,
      subject: event.subject_id[1],
      classroom: event.classroom_id[1],
      teacher: event.teacher_id[1],
    };
  });
};

const formatOdooEvents = (events) => {
  const markedDates = {};

  events?.forEach((event) => {
    let eventDates = [];

    if (event.recurrency) {
      eventDates = generateRecurrenceDates(event);
    } else {
      const startDate = new Date(event.start);
      const endDate = new Date(event.stop);
      eventDates.push({
        start: startDate,
        stop: endDate,
        classroom: event.classroom_id[1],
        subject: event.subject_id[1],
        teacher: event.teacher_id[1],
      });
    }

    eventDates.forEach((eventDetail) => {
      const startDate = new Date(eventDetail.start);
      const endDate = new Date(eventDetail.stop);

      const dateKey = startDate.toISOString().split("T")[0];

      const startTime = startDate.toTimeString().split(" ")[0].substring(0, 5);
      const endTime = endDate.toTimeString().split(" ")[0].substring(0, 5);
      const time = `${startTime}-${endTime}`;

      const color = MA_REUSSITE_CUSTOM_COLORS.Primary;
      const tag = "cours";

      const eventDetails = {
        color: color,
        tag: tag,
        time: time,
        subject: eventDetail.subject,
        teacher: eventDetail.teacher,
        classroom: eventDetail.classroom,
      };

      if (!markedDates[dateKey]) {
        markedDates[dateKey] = { dots: [] };
      }

      markedDates[dateKey].dots.push(eventDetails);
    });
  });

  return markedDates;
};

export { formatOdooEvents };
