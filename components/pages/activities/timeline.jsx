import React from "react";
import Layout from "../../ui/layout";
import Tab from "../../ui/tab";
import TimelineActivities from "./timeline-activities";


export default function Timeline() {

  return (
    <Layout>
      <div className="p-6">
        <Tab />
        <TimelineActivities/>
      </div>
    </Layout>
  );
}
