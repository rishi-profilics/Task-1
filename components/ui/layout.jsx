import React from "react";
import Sidebar from "./sidebar";
import Header from "./header/header";
// import Header from "./header";

export default function Layout({children}) {
  return (
    <div className="flex min-h-screen flex-1">
      <Sidebar />
      <div className="bg-zinc-300 relative min-h-screen space-y-12 w-full ">
       <Header />
        {children}
      </div>
    </div>
  );
}
