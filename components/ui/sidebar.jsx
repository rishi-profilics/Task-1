import React from "react";
import { BsThreeDots } from "react-icons/bs";
import { FaArrowRightLong } from "react-icons/fa6";
import { FiArrowRight } from "react-icons/fi";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const tabs = [
    { name: "HRMS", link: "/hrms" },
    { name: "Dashboard", link: "/dashboard" },
    { name: "Activities", link: "/activities" },
    { name: "Holidays", link: "/holidays" },
    { name: "Events", link: "/events" },
    { name: "Reports", link: "/reports" },
    { name: "Gallery", link: "/gallery" },
    { name: "Todo List", link: "/todo-list" },
    { name: "Notifications", link: "/notifications" },
    { name: "Referral", link: "/referrals" },
    { name: "Ticket", link: "/tickets" },
  ];

  const {pathname} = useLocation()

  return (
    <div
      className={`z-10 top-0 left-0 w-80 sticky h-screen p-6 bg-zinc-100 shadow-xl`}
    >
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-semibold text-lg text-zinc-600 ">
          Profilics System HR
        </h1>
      </div>
      <div className="space-y-4">
        {tabs.map((item, index) => (
          <Link
            to={item.link}
            key={index}
            className="flex items-center gap-3 text-zinc-600"
          >
            {pathname === item.link ? <FaArrowRightLong size={18} /> : <BsThreeDots size={18}/>}
             {item.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
