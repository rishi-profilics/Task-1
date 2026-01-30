import React, { useEffect, useState } from "react";
import Card from "../ui/card";
import { Link } from "react-router-dom";
import axios from "axios";

export default function ShowUsers() {
  const [users, setUsers] = useState([]);

  // useEffect(() => {
  //   const storeUser = JSON.parse(localStorage.getItem("Data")) || [];
  //   setUsers(storeUser);
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:3000/users')
        setUsers(res.data.data)
        console.log(res.data.data)
        
      } catch (error) {
        console.log(error)
      }
    }

    fetchData()
  },[])

  return (
    <div className="bg-zinc-300 space-y-12 w-full p-6">
      {users.length === 0 ? (
        <div className=" h-screen w-full flex items-center flex-col gap-6 justify-center ">
          <h1 className="text-3xl font-mono text-zinc-600">No user Found</h1>
          <Link to="/">
            <button className="px-3 py-1.5 text-white bg-slate-500 rounded-sm">
              Create Users
            </button>
          </Link>
        </div>
      ) : (
        <div className="space-y-10 h-full">
          <div className="w-full flex justify-end">
            <Link to="/">
              <button className="px-3 py-1.5 text-white bg-slate-500 rounded-sm">
                Create Users
              </button>
            </Link>
          </div>
          <div className="grid h-full grid-cols-4 gap-6">
            {users.map((item, index) => (
              <Card key={index} item={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
