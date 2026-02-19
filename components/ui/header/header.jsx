import React, { useContext, useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "../../../utils/axios";
import ActivityContext from "../../../src/context/activity-context";
import { IoIosClose } from "react-icons/io";
import TiptapEditor from "../editor";
import PunchTimer from "./punch-timer";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { formatToTimeInput } from "../../../utils/format-to-time-input";

export default function Header() {
  const [dropdown, setDropdown] = useState(false);
  const [logo, setLogo] = useState("");
  const [currentData, setCurrentData] = useState(null);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const { pathname } = useLocation();
  const { punchData, filterDateData, checkPunch } = useContext(ActivityContext);
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const handleDropdown = () => {
    setDropdown((prev) => !prev);
  };

  const routes = [
    { name: "Profiles", link: "/" },
    { name: "Calender", link: "/calender" },
    { name: "Timeline", link: "/timeline" },
    // {name: "", link: '/users'},
  ];

  const handleCloseDropdown = () => {
    setDropdown(false);
  };

  useEffect(() => {
    const getCurrectData = async () => {
      try {
        const res = await axios.get("/activity/today", {
          params: {
            fromDate: new Date(),
            toDate: new Date(),
          },
        });
        const userData = res.data.data;
        setCurrentData(userData);
      } catch (error) {
        console.log(error);
      }
    };
    getCurrectData();
  }, [punchData]);

  useEffect(() => {
    if (pathname === "/") {
      setLogo("Edit Users");
    }

    if (pathname === "/calender") {
      setLogo("Calender");
    }

    if (pathname === "/timeline") {
      setLogo("Timeline");
    }

    if (pathname === "/activities") {
      setLogo("Activities");
    }

    if (pathname === "/holidays") {
      setLogo("Holidays");
    }

    if (pathname === "/events") {
      setLogo("Events");
    }

    if (pathname === "/reports") {
      setLogo("Reports");
    }

    if (pathname === "/gallery") {
      setLogo("Gallery");
    }

    if (pathname === "/todo-list") {
      setLogo("Todo List");
    }

    if (pathname === "/notifications") {
      setLogo("Notifications");
    }

    if (pathname === "/referrals") {
      setLogo("Referrals");
    }

    if (pathname === "/ticket") {
      setLogo("Tickets");
    }

    // if (pathname.includes("/users")) {
    //   setLogo("View Users");
    // }
  }, [pathname]);

  const handleSignout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const punchInActivity = currentData?.find(
    (item) => item.activity_type === "punch_in",
  );
  const punchOutActivity = currentData?.find(
    (item) => item.activity_type === "punch_out",
  );
  const breakInActivity = currentData?.find(
    (item) => item.activity_type === "break_in",
  );
  const breakOutActivity = currentData?.find(
    (item) => item.activity_type === "break_out",
  );

  const handlePunchInOut = async () => {
    try {
      const res = await axios.post("/activity", {
        desciption: "",
        action: "punch",
      });
      checkPunch(filterDateData);

      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const submitReport = async (data) => {
    try {
      const res = await axios.post("/report", data);
      console.log(res);
      reset();
      handlePunchInOut();
      setIsReportOpen(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  const calculateMinutes = (start, end) => {
    if (!start || !end) return 0;

    const startTime = new Date(start);
    const endTime = new Date(end);

    const diffMs = endTime - startTime;

    return Math.floor(diffMs / 1000 / 60);
  };

  const calculateNetWorkHours = (start, end, breakMinutes) => {
    if (!start || !end) return "00:00";

    const startDate = start.includes("T")
      ? new Date(start)
      : new Date(`1970-01-01T${start}:00`);
    const endDate = end.includes("T")
      ? new Date(end)
      : new Date(`1970-01-01T${end}:00`);

    // Check if dates are valid to prevent NaN
    if (isNaN(startDate) || isNaN(endDate)) return "00:00";

    const totalDiffMinutes = Math.floor((endDate - startDate) / 1000 / 60);
    const netMinutes = totalDiffMinutes - (Number(breakMinutes) || 0);

    if (netMinutes <= 0) return "00:00";

    const hours = Math.floor(netMinutes / 60)
      .toString()
      .padStart(2, "0");
    const minutes = (netMinutes % 60).toString().padStart(2, "0");

    return `${hours}:${minutes}`;
  };

  useEffect(() => {
    const start_time = formatToTimeInput(punchInActivity?.createdAt);
    const break_duration_in_minutes = calculateMinutes(
      breakInActivity?.createdAt,
      breakOutActivity?.createdAt,
    );
    const end_time = formatToTimeInput(new Date());
    const working_hours = calculateNetWorkHours(
      start_time,
      end_time,
      break_duration_in_minutes,
    );
    const total_hours = calculateNetWorkHours(start_time, end_time, 0);

    setValue("start_time", start_time);
    setValue("end_time", end_time);
    setValue("break_duration_in_minutes", break_duration_in_minutes);
    setValue("working_hours", working_hours);
    setValue("total_hours", total_hours);
  }, [currentData, isReportOpen]);

  function DailyReport() {
    return (
      <div
        className={`fixed inset-0 z-20 ${
          !isReportOpen && "hidden"
        } bg-black/30 flex items-center justify-center p-3`}
      >
        <div className="w-full max-w-7xl h-full lg:h-[80vh]">
          <form
            onSubmit={handleSubmit(submitReport)}
            className="w-full h-full flex flex-col bg-white rounded-lg"
          >
            {/* Header */}
            <div className="border-b border-zinc-100 flex items-center p-4 justify-between">
              <h1 className="text-xl text-zinc-800 font-medium">
                Daily Report
              </h1>
              <button
                onClick={() => setIsReportOpen(false)}
                type="button"
                className="text-3xl cursor-pointer"
              >
                <IoIosClose />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 flex flex-col overflow-y-auto lg:flex-row gap-4 p-4 overflow-hidden">
              {/* Editor Section */}
              <div className="flex-1 min-h-75 overflow-hidden">
                <Controller
                  name="report"
                  control={control}
                  render={({ field }) => (
                    <div className="h-full">
                      <TiptapEditor
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </div>
                  )}
                />
              </div>

              {/* Inputs Section */}
              <div className="w-full lg:w-1/2 h-fit grid grid-cols-1 md:grid-cols-2  gap-4 ">
                <div>
                  <label className="label">Start Time</label>
                  <input
                    {...register("start_time")}
                    disabled
                    type="time"
                    className="input"
                  />
                </div>

                <div>
                  <label className="label">Break Duration (minute)</label>
                  <input
                    {...register("break_duration_in_minutes")}
                    type="number"
                    disabled
                    className="input"
                  />
                </div>

                <div>
                  <label className="label">End Time</label>
                  <input
                    {...register("end_time")}
                    type="time"
                    disabled
                    className="input"
                  />
                </div>

                <div>
                  <label className="label">Today's working hours</label>
                  <input
                    {...register("working_hours")}
                    type="time"
                    disabled
                    className="input"
                  />
                </div>

                <div>
                  <label className="label">Today's total hours</label>
                  <input
                    {...register("total_hours")}
                    type="time"
                    disabled
                    className="input"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-zinc-100 flex items-center p-4 justify-end">
              <button type="submit" className="button2 flex items-center gap-2">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full pt-6 px-6 flex items-center justify-between">
      <DailyReport />
      <div className="flex items-center gap-4">
        <h1 className="text-xl text-zinc-600 font-semibold">
          {logo || "Dashboard"}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <PunchTimer
          handlePunchInOut={handlePunchInOut}
          currentData={currentData}
          punchInActivity={punchInActivity}
          punchOutActivity={punchOutActivity}
          setIsReportOpen={setIsReportOpen}
        />
        <div className="relative ">
          <button onClick={handleDropdown} className="p-3 cursor-pointer">
            <FaUser />
          </button>

          <div
            className={`${dropdown ? "absolute" : "hidden"}  right-0 z-10 mt-2 w-56 origin-top-right overflow-hidden rounded-md bg-zinc-100 `}
          >
            <div>
              {routes.map((item, index) => (
                <div key={index}>
                  <Link
                    onClick={handleCloseDropdown}
                    to={item.link}
                    className="block px-4 py-2 text-sm text-gray-600  "
                  >
                    {item.name}
                  </Link>
                </div>
              ))}
              <div className=" h-px  bg-zinc-400" />
              <button
                onClick={handleSignout}
                className="block w-full text-start px-4 py-2 cursor-pointer text-sm text-gray-600 hover:bg-red-50 "
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
