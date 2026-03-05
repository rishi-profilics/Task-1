import React, { useEffect } from "react";
import { useStopwatch } from "react-timer-hook";

export default function HRMS() {
    const stopwatchOffset = new Date();
     stopwatchOffset.setSeconds(stopwatchOffset.getSeconds() + 300);
    const { seconds, minutes, hours, reset } = useStopwatch({
      autoStart: true,
      offsetTimestamp: stopwatchOffset 
    });
    console.log(stopwatchOffset)



  return (
    <div style={{ fontSize: "30px" }}>
 <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-2 w-2 text-gray-300"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 4.5l15 15m0 0V8.25m0 11.25H8.25"
              />
            </svg>
    </div>
  );
}
