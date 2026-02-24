import React from "react";
import Calender from "./calender";
import Layout from "../../ui/layout";
import Tab from "../../ui/tab";
import UserDetailCard from "../../ui/user-detail-card";

export default function CalenderPage() {
  return (
    <div>
      <Layout>
        <div className="p-6">
          <UserDetailCard/>
          <Tab />
          <Calender/>
        </div>
      </Layout>
    </div>
  );
}
