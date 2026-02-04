import React, { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { BsThreeDots } from "react-icons/bs";

export default function Header() {
  const [dropdown, setDropdown] = useState(false);
  const [logo, setLogo] = useState("");
  const { pathname } = useLocation();
  const [sidebar, setSidebar] = useState(false);

  const navigate = useNavigate();

  const handleDropdown = () => {
    setDropdown((prev) => !prev);
  };

  const routes = [
    { name: "Profiles", link: "/" },
    { name: "Calender", link: "/" },
    { name: "Timeline", link: "/" },
    // {name: "", link: '/users'},
  ];

  const handleCloseDropdown = () => {
    setDropdown(false);
  };

  useEffect(() => {
    if (pathname === "/") {
      setLogo("view Users");
    }

    // if (pathname.includes("/users")) {
    //   setLogo("View Users");
    // }
  }, [pathname]);

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

      <div className="relative inline-block">
        <button onClick={handleDropdown} className="p-3">
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
  );
}
