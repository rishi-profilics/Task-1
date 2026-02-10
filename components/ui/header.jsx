import React, { useContext, useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";

import axios from "../../utils/axios";
import { toast } from "react-toastify";
import ActivityContext from "../../src/context/activity-context";
import { useStopwatch } from "react-timer-hook";

export default function Header() {
  const [dropdown, setDropdown] = useState(false);
  const [logo, setLogo] = useState("");
  const { pathname } = useLocation();
  const { filterDateData ,punchData, checkPunch } = useContext(ActivityContext);
   const {seconds, hours, minutes, start, pause, reset} = useStopwatch({autoStart:false})
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

  const handlePunchInOut = async () => {
    try {
      const res = await axios.post("/activity", {
        desciption: "",
        action: "punch",
      });
      checkPunch(filterDateData);
      
      console.log(res.data.data.activity_type)
      
      if(res.data.data.activity_type === "punch_in"){
        start()
      }
      if(res.data.data.activity_type === "punch_out"){
        pause()
        localStorage.setItem("time",JSON.stringify(`${hours}:${minutes}:${seconds}`))
      }

      toast.success(res.data.message);
      console.log(res);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  // useEffect(() => {
  //   checkPunch();
  // }, []);

  const latestActivity = punchData?.[0] || null;

  const isPunchIn = latestActivity?.activity_type === "punch_in";
  const isPunchOut = latestActivity?.activity_type === "punch_out";

  const getPunchBtn = () => {
    if (!latestActivity) {
      return "Punch In";
    }

    if (isPunchIn) {
      return `Punch Out ${hours}:${minutes}:${seconds}` ;
    }

    if (isPunchOut) {
      return "Punched out";
    }

    return `Punch Out ${hours}:${minutes}:${seconds}` ;
  };

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

    // if (pathname.includes("/users")) {
    //   setLogo("View Users");
    // }
  }, [pathname]);

  const punchBtn = getPunchBtn();

  const handleSignout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="w-full pt-6 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h1 className="text-xl text-zinc-600 font-semibold">
          {logo || "Dashboard"}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {pathname === "/activities" && (
          <div>
            <button onClick={handlePunchInOut} className="button2">
              {punchBtn}
            </button>
          </div>
        )}
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
