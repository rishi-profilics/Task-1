import React, { useEffect, useState } from "react";
import Layout from "../../ui/layout";
import axios from "../../../utils/axios";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { IoEyeOutline } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import { IoIosClose } from "react-icons/io";
import TiptapEditor from "../../ui/editor";
import { formattedDate } from "../../../utils/format-date";
import { formattedTime } from "../../../utils/formatted-time";
import { formatToTimeInput } from "../../../utils/format-to-time-input";

export default function Reports() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm();

  const {
    register: dateRegister,
    handleSubmit: handleDateSubmit,
    control: handleControl,
    formState: { errors: dateErrors },
    setValue: setDateValue,
  } = useForm();

  const [reportData, setReportData] = useState(null);
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [singleReportData, setSingleReportData] = useState(null);
  const [handleDialogue, setHandleDialogue] = useState(false);
  const [handleUpdateReportDialogue, setHandleUpdateReportDialogue] =
    useState(false);

  const getReport = async (fromDate, toDate) => {
    try {
      const res = await axios.get("/report", {
        params: {
          fromDate: fromDate,
          toDate: toDate,
        },
      });
      setReportData(res.data.data);
    } catch (error) {
      toast(error.response.data.message);
    }
  };

  const getReportById = async (id) => {
    try {
      const res = await axios.get(`/report/${id}`);
      setSingleReportData(res.data.data);
      console.log(res.data.data);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  const handleReportDialogue = (id) => {
    getReportById(id);
    setHandleDialogue(true);
  };

  const handleOpenReportDialogue = async (id) => {
    setHandleUpdateReportDialogue(true);
    getReportById(id);
    setSelectedReportId(id);
  };

  const updateReport = async (data, id) => {
    try {
      const res = await axios.put(`/report/${id}`, data);
      setHandleUpdateReportDialogue(false);
      toast.success("Report updated successfully");
    } catch (error) {
      error(error.response.data.message);
    }
  };

  const handleDate = (data) => {
    getReport(data.fromDate, data.toDate);
  };

  const formatDate = (date) => new Date(date).toISOString().split("T")[0];

  useEffect(() => {
    const fromDate = new Date();
    const toDate = new Date();
    fromDate.setDate(fromDate.getDate() - 1);
    setDateValue("fromDate", formatDate(fromDate));
    setDateValue("toDate", formatDate(toDate));
    getReport(fromDate, toDate);
  }, []);

  useEffect(() => {
    if (!singleReportData) return;

    const start_time = formatToTimeInput(singleReportData.createdAt);
    const {
      break_duration_in_minutes,
      end_time,
      working_hours,
      total_hours,
      report,
    } = singleReportData;

    console.log(report);
    setValue("start_time", start_time);
    setValue("end_time", end_time);
    setValue("break_duration_in_minutes", break_duration_in_minutes);
    setValue("working_hours", working_hours);
    setValue("total_hours", total_hours);
    setValue("report", report);
  }, [singleReportData]);

  function DailyReport({ id }) {
    return (
      <div
        className={`fixed inset-0 z-20 ${
          !handleUpdateReportDialogue && "hidden"
        } bg-black/30 flex items-center mb-0 justify-center p-3`}
      >
        <div className="w-full max-w-7xl h-full lg:h-[80vh]">
          <form
            onSubmit={handleSubmit((data) => updateReport(data, id))}
            className="w-full h-full flex flex-col bg-white rounded-lg"
          >
            {/* Header */}
            <div className="border-b border-zinc-100 flex items-center p-4 justify-between">
              <h1 className="text-xl text-zinc-800 font-medium">
                Daily Report
              </h1>
              <button
                onClick={() => setHandleUpdateReportDialogue(false)}
                type="button"
                className="text-3xl cursor-pointer"
              >
                <IoIosClose />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 flex flex-col md:flex-row gap-4 overflow-y-auto p-4 overflow-hidden">
              {/* Editor Section */}
              <div className="flex-1 min-h-75 overflow-hidden">
                <Controller
                  name="report"
                  control={control}
                  render={({ field }) => (
                    <div className="h-full">
                      <TiptapEditor
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </div>
                  )}
                />
              </div>

              {/* Inputs Section */}
              <div className="w-full md:w-1/2 grid grid-cols-1 h-fit sm:grid-cols-1 md:grid-cols-2 gap-4 ">
                <div>
                  <label className="label">Start Time</label>
                  <input
                    {...register("start_time")}
                    disabled
                    type="time"
                    className="input"
                  />
                </div>

                <div>
                  <label className="label">Break Duration (minute)</label>
                  <input
                    {...register("break_duration_in_minutes")}
                    type="number"
                    disabled
                    className="input"
                  />
                </div>

                <div>
                  <label className="label">End Time</label>
                  <input
                    {...register("end_time")}
                    type="time"
                    disabled
                    className="input"
                  />
                </div>

                <div>
                  <label className="label">Today's working hours</label>
                  <input
                    {...register("working_hours")}
                    type="time"
                    disabled
                    className="input"
                  />
                </div>

                <div>
                  <label className="label">Today's total hours</label>
                  <input
                    {...register("total_hours")}
                    type="time"
                    disabled
                    className="input"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-zinc-100 flex items-center p-4 justify-end">
              <button type="submit" className="button2 flex items-center gap-2">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <DailyReport id={selectedReportId} />
      <div className="p-6 space-y-6">
        <div className="bg-zinc-100 space-y-15 p-4 w-full rounded-lg">
          <form
            onSubmit={handleDateSubmit(handleDate)}
            className="flex max-md:flex-col gap-4 md:items-end"
          >
            <div className="">
              <label className="font-semibold text-gray-700">From Date</label>
              <input
                {...dateRegister("fromDate", {
                  required: "From date is required",
                  validate: (value) => {
                    return (
                      new Date(value) < new Date() || "Select a Correct date"
                    );
                  },
                })}
                className="input"
                type="date"
              />
              {dateErrors.fromDate && (
                <p className="text-red-600 text-xs">
                  {dateErrors.fromDate.message}
                </p>
              )}
            </div>
            <div className="">
              <label className="font-semibold text-gray-700">To Date</label>
              <input
                {...dateRegister("toDate", {
                  required: "To date is required",
                  validate: (value) => {
                    return (
                      new Date(value) < new Date() || "Select a Correct date"
                    );
                  },
                })}
                className="input"
                type="date"
              />
              {dateErrors.toDate && (
                <p className="text-red-600 text-xs">
                  {dateErrors.toDate.message}
                </p>
              )}
            </div>

            <button type="submit" className="button2">
              Apply
            </button>
          </form>

          <div className="space-y-8 ">
            <div className="overflow-x-auto">
              <div className="min-w-4xl  space-y-8 ">
                <div className="grid grid-cols-7">
                  <h2 className=" text-zinc-700 ml-2 w-full">DATE</h2>
                  <h2 className=" text-zinc-700 w-full">START TIME</h2>
                  <h2 className=" text-zinc-700 w-full">BREAK DURATION</h2>
                  <h2 className=" text-zinc-700 w-full">END TIME</h2>
                  <h2 className=" text-zinc-700 w-full">WORKING HOURS</h2>
                  <h2 className=" text-zinc-700 w-full">TOTAL HOURS</h2>
                  <h2 className=" text-zinc-700 w-full">ACTIONS</h2>
                </div>
                <hr className="text-zinc-300" />
                {reportData?.length === 0 && (
                  <div className="">No Data for current Timeline</div>
                )}
                {reportData?.map((item, index) => (
                  <div key={index} className="grid grid-cols-7">
                    <p className="w-full ml-1  text-zinc-500 text-sm ">
                      {formattedDate(item.createdAt)}{" "}
                    </p>
                    <p className="w-full ml-1 text-zinc-500 text-sm">
                      {formattedTime(item.start_time)}
                    </p>
                    <p className="w-full ml-1 text-zinc-500 text-sm">{`${item.break_duration_in_minutes} min`}</p>
                    <p className="w-full ml-1 text-zinc-500 text-sm">
                      {formattedTime(item.end_time)}
                    </p>
                    <p className="w-full ml-1 text-zinc-500 text-sm">
                      {item.working_hours}
                    </p>
                    <p className="w-full ml-1 text-zinc-500 text-sm">
                      {item.total_hours}
                    </p>
                    <div className="flex gap-2 items-center">
                      <button
                        onClick={() => handleReportDialogue(item._id)}
                        className="w-fit ml-1 cursor-pointer text-zinc-500 text-xl"
                      >
                        <IoEyeOutline />
                      </button>
                      {new Date().toDateString() ===
                        new Date(item?.createdAt).toDateString() && (
                        <>
                          <button
                            onClick={() => handleOpenReportDialogue(item._id)}
                            className="w-fit ml-1 cursor-pointer text-zinc-500 text-xl"
                          >
                            <MdEdit />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div
            className={`fixed ${!handleDialogue && "hidden"} h-screen w-screen bg-black/30 top-0 right-0 z-20`}
          >
            <div className="h-full w-full px-4 flex items-center justify-center">
              <div className="w-lg  flex items-center justify-between flex-col bg-white rounded-lg">
                <div className="flex-1 flex flex-col gap-6 p-4 w-full">
                  <div
                    className="[&_ul]:list-disc [&_ul]:ml-4 [&_ol]:list-decimal [&_ol]:ml-4 [&_li]:mb-1"
                    dangerouslySetInnerHTML={{
                      __html: singleReportData?.report,
                    }}
                  />

                  <div className="">
                    <span className="font-semibold">Start Time:</span>{" "}
                    {singleReportData?.start_time} <br />
                    <span className="font-semibold">End Time:</span>{" "}
                    {singleReportData?.end_time} <br />
                    <span className="font-semibold">Break Duration:</span>{" "}
                    {singleReportData?.break_duration_in_minutes} Mins <br />
                    <span className="font-semibold">Working Hours:</span>{" "}
                    {singleReportData?.working_hours} <br />
                    <span className="font-semibold">Total Hours:</span>{" "}
                    {singleReportData?.total_hours} <br />
                  </div>
                </div>

                <div className="border-t-2 w-full border-zinc-100 flex items-center p-4 justify-end">
                  <button
                    onClick={() => setHandleDialogue(false)}
                    type="button"
                    className="button2 flex items-center gap-2"
                  >
                    close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

// ! mistakes rendering dialogue box inside the map function causing the dialogue to render multiple times increasing memory usage
//? solution Crate a usestate variable store id in it and render the dialogue outside the map function
