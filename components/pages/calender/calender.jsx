import React, { useEffect, useMemo, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "../../../utils/axios";
import dayjs from "dayjs";

export default function Calender({ selectedYear }) {
  const [reports, setReports] = useState([]);

  const fetchReports = async () => {
    try {
      const res = await axios.get("/allreport");
      setReports(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const convertToMinutes = (timeStr) => {
    if (!timeStr) return 0;
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  };

  // Ensure we always have a valid year for the calendar
  const today = new Date();
  const safeYear =
    typeof selectedYear === "number" && !Number.isNaN(selectedYear)
      ? selectedYear
      : today.getFullYear();
  const currentMonth = today.getMonth() + 1;

  const reportMap = useMemo(() => {
    const map = {};

    reports.forEach((item) => {
      const date = dayjs(item.createdAt).format("YYYY-MM-DD");

      map[date] = {
        original: item.working_hours,
        minutes: convertToMinutes(item.working_hours),
      };
    });
    console.log(map);
    return map;
  }, [reports]);

    useEffect(() => {
    fetchReports();
  }, []);


  return (
    <div className="bg-zinc-100 p-5 overflow-hidden rounded-xl">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        key={safeYear}
        initialDate={`${safeYear}-${String(currentMonth).padStart(2, "0")}-01`}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,dayGridWeek,dayGridDay",
        }}
        dayCellClassNames={(arg) => {
          const dateStr = dayjs(arg.date).format("YYYY-MM-DD");
          const record = reportMap[dateStr];

          const today = dayjs().startOf("day");
          const cellDate = dayjs(arg.date).startOf("day");

          const day = arg.date.getDay();
          const isWeekend = day === 0 || day === 6;

          if (record) {
            return record.minutes >= 480 ? ["bg-green-400"] : ["bg-blue-300"];
          }

          if (isWeekend) {
            return ["bg-orange-50"];
          }

          if (cellDate.isBefore(today) && !record) {
            return ["bg-red-500"];
          }

          return [];
        }}
        dayCellContent={(arg) => {
          const dateStr = dayjs(arg.date).format("YYYY-MM-DD");
          const record = reportMap[dateStr];

          return (
            <div className="flex flex-col items-center justify-center h-full w-full">
              <div className="text-sm text-zinc-600 font-semibold">
                {arg.dayNumberText}
              </div>

              {record && (
                <span className=" absolute top-12 right-14 text-md font-medium">
                  {record.original}
                </span>
              )}
            </div>
          );
        }}
      />
    </div>
  );
}
