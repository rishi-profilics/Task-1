import React, { useState } from "react";
import { Route, Routes, useLocation, useParams } from "react-router-dom";
import CreateUser from "../components/pages/create-user";
import ShowUsers from "../components/pages/show-users";
import UpdateUser from "../components/pages/update-user";
import Header from "../components/ui/header";
import Sidebar from "../components/ui/sidebar";
import Dashboard from "../components/pages/dashboard";
import Activities from "../components/pages/activities";
import Holidays from "../components/pages/holidays";
import Events from "../components/pages/events";
import Reports from "../components/pages/reports";
import Gallery from "../components/pages/gallery";
import Todo from "../components/pages/todo";
import Notifications from "../components/pages/notifiactions";
import Referral from "../components/pages/referral";
import Ticket from "../components/pages/ticket";
import HRMS from "../components/pages/hrms";

export default function App() {
  const location = useLocation();

  return (
    <div className="flex">
      <Sidebar />
      <div className="bg-zinc-300 min-h-screen space-y-12 w-full p-6">
        <Header />
        <Routes>
          <Route path="/" element={<CreateUser />} />
          <Route path="/users" element={<ShowUsers />} />
          <Route path="/update/:id" element={<UpdateUser />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/holidays" element={<Holidays />} />
          <Route path="/events" element={<Events />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/todo-list" element={<Todo />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/referrals" element={<Referral />} />
          <Route path="/tickets" element={<Ticket />} />
          <Route path="/hrms" element={<HRMS />} />
        </Routes>
      </div>
    </div>
  );
}
