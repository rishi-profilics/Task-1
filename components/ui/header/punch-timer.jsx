import React, { useContext, useEffect } from "react";
import { useStopwatch } from "react-timer-hook";
import ActivityContext from "../../../src/context/activity-context";
import { toast } from "react-toastify";

export default function PunchTimer({ currentData, setIsReportOpen, punchInActivity, punchOutActivity, handlePunchInOut }) {
  // const {  } = useContext(ActivityContext);

  const { seconds, hours, minutes, start, pause, reset } = useStopwatch({
    autoStart: false,
  });

  useEffect(() => {
    if (!punchInActivity) return;

    const punchInTime = new Date(punchInActivity.createdAt);
    const now = new Date();

    const diffInMilliseconds = now - punchInTime;

    const offset = new Date();
    offset.setMilliseconds(offset.getMilliseconds() + diffInMilliseconds);

    if (!punchOutActivity) {
      reset(offset, true); 
    } else {
      pause();
    }
  }, [punchInActivity, punchOutActivity, reset, pause]);



  const formattedTime = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const latestActivity = currentData?.[0] || null;

  const isPunchIn = latestActivity?.activity_type === "punch_in";
  const isPunchOut = latestActivity?.activity_type === "punch_out";

  const getPunchBtn = () => {
    if (!latestActivity) {
      return (
        <button onClick={handlePunchInOut} className="button2">
          Punch In
        </button>
      );
    }

    if (isPunchIn) {
      return (
        <button
          onClick={() => setIsReportOpen(true)}
          className="button2"
        >{`Punch Out ${formattedTime}`}</button>
      );
    }

    if (isPunchOut) {
      return (
        <button onClick={handlePunchInOut} className="button2">
          Punched out
        </button>
      );
    }

    return (
      <button
        onClick={() => setIsReportOpen(true)}
        className="button2"
      >{`Punch Out ${formattedTime}`}</button>
    );
  };

  const punchBtn = getPunchBtn();

  return <div>{punchBtn}</div>;
}
