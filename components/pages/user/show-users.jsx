import React, { useEffect, useState } from "react";
import Card from "../../ui/card";
import { Link } from "react-router-dom";
import axios from "axios";
import Header from "../../ui/header";
import Tab from "../../ui/tab";
import Layout from "../../ui/layout";

export default function ShowUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const storeUser = JSON.parse(localStorage.getItem("Data")) || [];
  //   setUsers(storeUser);
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:3000/users");
        setUsers(res.data.data);
        console.log(res.data.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Layout>
      <div >
        <Tab/>
        <p className="text-xl text-zinc-500 mt-6 ml-5 font-semibold">Loading...</p>
      </div>
      </Layout>
    )
  }

  return (
    <Layout>
    <div>
      <div className="space-y-10 p-6  h-full">
        <Tab />
        {users.length == 0 ? (
          <div className=" h-screen bg-zinc-300 w-full flex items-center flex-col gap-6 justify-center ">
            <h1 className="text-3xl font-mono text-zinc-600">No user Found</h1>
            <Link to="/">
              <button className="px-3 cursor-pointer py-1.5 text-white bg-slate-500 rounded-sm">
                Create Users
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid h-full grid-cols-3 gap-6">
            {users.map((item, index) => (
              <Card key={index} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
    </Layout>

  );
}
