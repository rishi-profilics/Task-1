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
      {String(hours).padStart(2, "0")}:
      {String(minutes).padStart(2, "0")}:
      {String(seconds).padStart(2, "0")}
    </div>
  );
}
