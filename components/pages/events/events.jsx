import React, { useEffect, useState } from "react";
import Layout from "../../ui/layout";
import Calender from "../calender/calender";
import axios from "../../../utils/axios";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { IoCloseSharp } from "react-icons/io5";
import EventCalender from "../calender/event_calender";
import dayjs from "dayjs";

export default function Events() {
  const currentYear = new Date().getFullYear();

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [eventData, seteventData] = useState(null);
  const [handleDialogue, setHandleDialogue] = useState(false);
  const [calenderFilter, setCalenderFilter] = useState("event");

  const years = Array.from({ length: 9 }, (_, index) => currentYear + index);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      event_type: "",
    },
  });

  const fetchEvents = async () => {
    try {
      const res = await axios.get("/events",{
        params:{
          event_type: "event"
        }
      });
      seteventData(res.data.data);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const onSubmit = async (data) => {
    try {
      await axios.post("/events", {...data, event_type:"event"});
      toast.success("Event Added");
      setHandleDialogue(false);
      reset();
      fetchEvents();
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <Layout>
      <div className="p-6">
        <div className="px-4 py-2 rounded-lg mb-3 bg-zinc-100 w-full">
          <div className="flex items-center gap-2">
            <label>Year: </label>
            <select
              className="outline-none input w-20! mt-0!"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-1 space-y-4 p-4 rounded-lg bg-zinc-100">
            <div className=" flex border-b border-zinc-300  pb-4 items-center justify-between">
              <h1 className=" font-normal">EVENTS LISTS</h1>
              <button
                onClick={() => setHandleDialogue(true)}
                className="button2"
              >
                Add Event
              </button>
              <div
                className={`fixed inset-0 z-20 ${
                  !handleDialogue && "hidden"
                } bg-black/30 flex items-center mb-0 justify-center p-3`}
              >
                <div className="bg-zinc-100 space-y-4 p-4 rounded-lg w-xl">
                  <div className="flex justify-end">
                    <button
                      onClick={() => setHandleDialogue(false)}
                      className="p-2 cursor-pointer"
                    >
                      <IoCloseSharp size={20} />
                    </button>
                  </div>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="">
                      <label className="label">Event Name:</label>
                      <input
                        {...register("name")}
                        type="text"
                        placeholder="Event name"
                        className="input"
                      />
                    </div>
                    <div className="">
                      <label className="label">Event On:</label>
                      <input
                        {...register("event_on")}
                        type="date"
                        className="input"
                      />
                    </div>
                    <div className="flex justify-end mt-8">
                      <button className="button2" type="submit">
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="space-y-2 overflow-y-auto h-152">
              {eventData?.length === 0 && (
                <p className="label">Event not created yet</p>
              )}
              {eventData?.map((item, index) => (
                <div
                  key={index}
                  className="border-l-6 px-6 py-2 border-blue-700 rounded-sm"
                >
                  <h2 className="text-blue-700 font-semibold">{item.name}</h2>
                  <p className="text-sm text-blue-700">
                    {dayjs(item.event_on)
                      .year(selectedYear)
                      .format("MMM D YYYY")}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="col-span-2 rounded-lg  bg-zinc-100">
            <div className="p-4 border-b flex justify-between items-center border-zinc-300">
              <h2 className="font-normal">EVENT CALENDAR</h2>
              <select
                onClick={(e) => setCalenderFilter(e.target.value)}
                className="outline-none input w-28!"
              >
                <option value="event">Event</option>
                <option value="report">Report</option>
              </select>
            </div>
            {calenderFilter === "event" && (
              <EventCalender selectedYear={selectedYear} eventData={eventData}  setSelectedYear={setSelectedYear}/>
            )}
            {calenderFilter === "report" && (
              <Calender selectedYear={selectedYear} />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
