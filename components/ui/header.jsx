import React, { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { BsThreeDots } from "react-icons/bs";

export default function Header() {
  const [dropdown, setDropdown] = useState(false);
  const [logo, setLogo] = useState("");
  const { pathname } = useLocation();
  const [sidebar, setSidebar] = useState(false)

  const handleDropdown = () => {
    setDropdown((prev) => !prev);
  };

  const routes = [
    { name: "View Profiles", link: "/users" },
    { name: "Create Profile", link: "/" },
    // {name: "", link: '/users'},
  ];

  const handleCloseDropdown = () => {
    setDropdown(false);
  };

  useEffect(() => {
    if (pathname === "/") {
      setLogo("Create Profile");
    }

    if (pathname.includes("/users")) {
      setLogo("View Users");
    }
  }, [pathname]);



  return (
    <div className="w-full flex items-center justify-between">

      <div className="flex items-center gap-4">
        <h1 className="text-xl text-zinc-600 font-semibold">{logo || "Dashboard"}</h1>
      </div>

      <div className="relative inline-block">
        <button
          onClick={handleDropdown}
          className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-zinc-400 px-3 py-2 text-sm font-semibold text-white hover:bg-zinc-400/70"
        >
          <FaUser />
        </button>

        <div
          className={`${dropdown ? "absolute" : "hidden"}  right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-zinc-100 `}
        >
          {routes.map((item, index) => (
            <div key={index} className="py-1">
              <div>
                <Link
                  onClick={handleCloseDropdown}
                  to={item.link}
                  className="block px-4 py-2 text-sm text-gray-600 data-focus:bg-white/5 data-focus:text-white data-focus:outline-hidden"
                >
                  {item.name}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
