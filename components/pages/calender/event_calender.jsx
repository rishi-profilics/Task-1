import React, { useMemo, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import dayjs from "dayjs";

export default function EventCalender({
  selectedYear,
  setSelectedYear,
  eventData,
}) {
  // Track which month is currently being viewed so that
  // navigating prev/next keeps moving month-by-month correctly.
  const [viewMonth, setViewMonth] = useState(
    () => new Date().getMonth() + 1 // 1-based month
  );

  const eventMap = useMemo(() => {
    const map = {};

    eventData?.forEach((item) => {
      const date = dayjs(item.event_on).year(selectedYear).format("YYYY-MM-DD");

      map[date] = {
        original: item.name,
      };
    });

    return map;
  }, [eventData, selectedYear]);

  return (
    <div className="bg-zinc-100 p-5 overflow-hidden rounded-xl">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        key={`${selectedYear}-${viewMonth}`}
        initialDate={`${selectedYear}-${String(viewMonth).padStart(2, "0")}-01`}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,dayGridWeek,dayGridDay",
        }}
        datesSet={(arg) => {
          // Use a date in the middle of the visible range so we stay
          // within the main month instead of the leading/trailing days
          const middleOfView = dayjs(arg.start).add(15, "day");
          const newYear = middleOfView.year();
          const newMonth = middleOfView.month() + 1; // 1-based

          if (newYear !== selectedYear) {
            setSelectedYear(newYear);
          }

          if (newMonth !== viewMonth) {
            setViewMonth(newMonth);
          }
          // This keeps both the external year filter and our local
          // month state in sync with what FullCalendar is showing.
        }}
        dayCellClassNames={(arg) => {
          const dateStr = dayjs(arg.date).format("YYYY-MM-DD");
          const day = arg.date.getDay();
          const record = eventMap[dateStr];
          const isWeekend = day === 0 || day === 6;

          if (record) {
            return ["bg-blue-500"];
          }

          if (isWeekend) {
            return ["bg-orange-50"];
          }
          return [];
        }}
        dayCellContent={(arg) => {
          const dateStr = dayjs(arg.date).format("YYYY-MM-DD");
          const record = eventMap[dateStr];

          return (
            <div className="flex flex-col items-center justify-center h-full w-full">
              <div className="text-sm text-zinc-600 font-semibold">
                {arg.dayNumberText}
              </div>

              {record && (
                <span className=" absolute top-6 right-4 text-md font-medium">
                  {record.original.length > 5
                    ? record.original.slice(0, 5) + "..."
                    : record.original}
                </span>
              )}
            </div>
          );
        }}
      />
    </div>
  );
}
