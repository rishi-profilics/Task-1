import React, { useEffect, useState } from "react";
import Layout from "../../ui/layout";
import { IoCloseSharp } from "react-icons/io5";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "../../../utils/axios";
import { formattedDate } from "../../../utils/format-date";
import dayjs from "dayjs";
import Pagination from "@mui/material/Pagination";

import { MdDelete, MdEdit } from "react-icons/md";

export default function Holidays() {
  const [handleDialogue, setHandleDialogue] = useState(false);
  const [handleEditDialogue, setHandleEditDialogue] = useState(false);
  const [singleHolidayData, setSingleHolidayData] = useState(null);
  const [page, setPage] = useState(1);
  const rowsPerPage = 2;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const {
    register: updateRegister,
    handleSubmit: updateSubmit,
    formState: { errors: updateErrors },
    reset: updateReset,
    setValue,
  } = useForm();

  const [holidayData, setHolidayData] = useState(null);

  const fetchHoliday = async () => {
    try {
      const res = await axios.get("/events", {
        params: {
          event_type: "holiday",
        },
      });
      setHolidayData(res.data.data);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const onSubmit = async (data) => {
    try {
      await axios.post("/events", { ...data, event_type: "holiday" });
      toast.success("Holiday Added");
      setHandleDialogue(false);
      reset();
      fetchHoliday();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const paginatedData = holidayData?.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage,
  );

  const onUpdate = async (data) => {
    try {
      await axios.put(`/holiday/${singleHolidayData}`, {
        ...data,
        event_type: "holiday",
      });
      toast.success("Holiday Updated");
      setHandleEditDialogue(false);
      updateReset();
      fetchHoliday();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const editHoliday = (data) => {
    setSingleHolidayData(data._id);
    setHandleEditDialogue(true);
    setValue("name", data.name);
    setValue("event_on", dayjs(data.event_on).format("YYYY-MM-DD"));
  };

  const deleteHoliday = async (id) => {
    try {
      await axios.delete(`/holiday/${id}`);
      toast.success("Holiday deleted");
      fetchHoliday();
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (!holidayData) return;

    const totalPages = Math.ceil(holidayData.length / rowsPerPage);

    if (page > totalPages && totalPages > 0) {
      setPage(totalPages);
    }
  }, [holidayData]);

  useEffect(() => {
    fetchHoliday();
  }, []);

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="bg-zinc-100 space-y-15 p-4 w-full rounded-lg">
          <div className="space-y-10 ">
            <div className="flex justify-between items-center">
              <h1 className="font-normal text-lg">Holiday Lists</h1>
              <button
                onClick={() => setHandleDialogue(true)}
                className="button2"
              >
                Add Holiday
              </button>
            </div>
            <div className="overflow-x-auto">
              <div className="min-w-4xl  mb-10 h-80  space-y-8 ">
                <div className="grid grid-cols-5">
                  <h2 className=" text-zinc-700 ml-2 w-full">DATE</h2>
                  <h2 className=" text-zinc-700 w-full">NAME</h2>
                  <h2 className=" text-zinc-700 w-full">CREATED AT</h2>
                  <h2 className=" text-zinc-700 w-full">UPDATED AT</h2>
                  <h2 className=" text-zinc-700 w-full">ACTIONS</h2>
                </div>
                <hr className="text-zinc-300" />
                {holidayData?.length === 0 && (
                  <div className="">No holiday available</div>
                )}
                {paginatedData?.map((item, index) => (
                  <div key={index} className="grid grid-cols-5">
                    <p className="w-full ml-1  text-zinc-500 text-sm ">
                      {formattedDate(item.event_on)}{" "}
                    </p>
                    <p className="w-full ml-1 text-zinc-500 text-sm">
                      {item.name}
                    </p>
                    <p className="w-full ml-1 text-zinc-500 text-sm">
                      {formattedDate(item.createdAt)}
                    </p>
                    <p className="w-full ml-1 text-zinc-500 text-sm">
                      {formattedDate(item.updatedAt)}
                    </p>
                    <div className="flex gap-4 items-center">
                      <button
                        onClick={() => deleteHoliday(item._id)}
                        className="w-fit ml-1 cursor-pointer text-zinc-500 text-xl"
                      >
                        <MdDelete />
                      </button>
                      <>
                        <button
                          onClick={() => editHoliday(item)}
                          className="w-fit cursor-pointer text-zinc-500 text-xl"
                        >
                          <MdEdit />
                        </button>
                      </>
                    </div>
                  </div>
                ))}
              </div>
              {holidayData?.length > rowsPerPage && (
                <div className="flex justify-end mt-6">
                  <Pagination
                    count={Math.ceil(holidayData.length / rowsPerPage)}
                    page={page}
                    shape="rounded"
                    onChange={(event, value) => setPage(value)}
                  />
                </div>
              )}
            </div>
          </div>

          <div
            className={`fixed inset-0 z-20 ${
              !handleDialogue && "hidden"
            } bg-black/30 flex items-center mb-0 justify-center p-3`}
          >
            <div className="bg-zinc-100 space-y-4 p-4 rounded-lg w-xl">
              <div className="flex justify-between">
                <h2 className="text-lg font-normal">Add Holiday</h2>
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
                    {...register("name", {
                      required: "Event Name is Required",
                    })}
                    type="text"
                    placeholder="Event name"
                    className="input"
                  />
                  {errors.name && (
                    <p className="text-red-600 mt-1 text-xs">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div className="">
                  <label className="label">Event On:</label>
                  <input
                    {...register("event_on", {
                      required: "Event Date is Required",
                    })}
                    type="date"
                    min={dayjs().format("YYYY-MM-DD")}
                    className="input"
                  />
                  {errors.event_on && (
                    <p className="text-red-600 mt-1 text-xs">
                      {errors.event_on.message}
                    </p>
                  )}
                </div>
                <div className="flex justify-end mt-8">
                  <button className="button2" type="submit">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div
            className={`fixed inset-0 z-20 ${
              !handleEditDialogue && "hidden"
            } bg-black/30 flex items-center mb-0 justify-center p-3`}
          >
            <div className="bg-zinc-100 space-y-4 p-4 rounded-lg w-xl">
              <div className="flex justify-between">
                <h2 className="text-lg font-normal">Edit Holiday</h2>
                <button
                  onClick={() => setHandleEditDialogue(false)}
                  className="p-2 cursor-pointer"
                >
                  <IoCloseSharp size={20} />
                </button>
              </div>
              <form onSubmit={updateSubmit(onUpdate)} className="space-y-4">
                <div className="">
                  <label className="label">Event Name:</label>
                  <input
                    {...updateRegister("name", {
                      required: "Event Name is Required",
                    })}
                    type="text"
                    placeholder="Event name"
                    className="input"
                  />
                  {updateErrors.name && (
                    <p className="text-red-600 mt-1 text-xs">
                      {updateErrors.name.message}
                    </p>
                  )}
                </div>
                <div className="">
                  <label className="label">Event On:</label>
                  <input
                    {...updateRegister("event_on", {
                      required: "Event Date is Required",
                    })}
                    type="date"
                    min={dayjs().format("YYYY-MM-DD")}
                    className="input"
                  />
                  {updateErrors.event_on && (
                    <p className="text-red-600 mt-1 text-xs">
                      {updateErrors.event_on.message}
                    </p>
                  )}
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
      </div>
    </Layout>
  );
}
