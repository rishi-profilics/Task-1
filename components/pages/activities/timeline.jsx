import React from "react";
import Layout from "../../ui/layout";
import Tab from "../../ui/tab";
import TimelineActivities from "./timeline-activities";
import UserDetailCard from "../../ui/user-detail-card";


export default function Timeline() {

  return (
    <Layout>
      <div className="p-6">
        <UserDetailCard/>
        <Tab />
        <TimelineActivities/>
      </div>
    </Layout>
  );
}
