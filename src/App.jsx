import React, { useState } from "react";
import { Route, Routes, useLocation, useParams } from "react-router-dom";
// import CreateUser from "../components/pages/create-user";
// import ShowUsers from "../components/pages/show-users";
import UpdateUser from "../components/pages/user/update-user";
// import Header from "../components/ui/header";
// import Sidebar from "../components/ui/sidebar";
import Dashboard from "../components/pages/dashboard/dashboard";
import Activities from "../components/pages/activities/activities";
import Holidays from "../components/pages/holidays/holidays";
import Events from "../components/pages/events/events";
import Reports from "../components/pages/reports/reports";
import Gallery from "../components/pages/gallery/gallery";
import Todo from "../components/pages/todo/todo";
import Notifications from "../components/pages/notifications/notifiactions";
import Referral from "../components/pages/referral/referral";
import Ticket from "../components/pages/ticket/ticket";
import HRMS from "../components/pages/hrms/hrms";
import ProtectedRoute from "./protected-route";
import NotFound from "../components/pages/not-found/not-found";
import Login from "../components/pages/auth/login";
import Register from "../components/pages/auth/register";
import EditPage from "../components/pages/user/edit-page";
import { ToastContainer } from "react-toastify";
import Timeline from "../components/pages/activities/timeline";
import CalenderPage from "../components/pages/calender/calender-page";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          {/* <Route path="/" element={<CreateUser />} /> */}
          {/* <Route path="/" element={<ShowUsers />} /> */}
          <Route path="/" element={<EditPage />} />
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
          <Route path="/calender" element={<CalenderPage />} />
          <Route path="/timeline" element={<Timeline />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light" 
      />
    </>
  );
}
