import React from "react";
import Calender from "./calender";
import Layout from "../../ui/layout";
import Tab from "../../ui/tab";

export default function CalenderPage() {
  return (
    <div>
      <Layout>
        <div className="p-6">
          <Tab />
          <Calender/>
        </div>
      </Layout>
    </div>
  );
}
