import React, { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import ActivityContext from '../../../src/context/activity-context';
import axios from '../../../utils/axios';
import { toast } from 'react-toastify';
import { IoIosClose, IoIosSave } from 'react-icons/io';
import { formatTime } from '../../../utils/time-format';
import { useLocation } from 'react-router-dom';

export default function TimelineActivities() {
      const {
    register: breakRegister,
    handleSubmit: breakHandleSubmit,
    reset: breakReset,
    formState: { errors: breakError },
  } = useForm();

  const {
    register: dateRegister,
    handleSubmit: dateHandleSubmit,
    reset: dateReset,
    setValue: dateValue,
    formState: { errors: dateError },
  } = useForm();

  const [userData, setUserData] = useState([]);
  const [isDialogueOpen, setIsDialogueOpen] = useState(false);

  const { filterDateData, punchData, checkPunch } = useContext(ActivityContext);

    const {pathname} = useLocation()

  const fetchProfile = async () => {
    const user = await axios.get("/profile");
    const userData = user.data.data;
    // console.log(userData);

    setUserData(userData);
  };

  const handleBreak = (data) => {
    const addBreak = async () => {
      try {
        const res = await axios.post("/activity", {
          description: data.description,
          action: "break",
        });
        checkPunch(filterDateData);
        toast.success(res.data.message);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };
    addBreak();
    setIsDialogueOpen(false);
    breakReset();
  };

  const handleBreakOut = async () => {
    try {
      const res = await axios.post("/activity", {
        desciption: "",
        action: "break",
      });
      checkPunch(filterDateData);
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const activeBreak = punchData?.find(
    (item) => item.activity_type === "break_in" && item.status === "break",
  );

  const handleDate = (data) => {
    checkPunch(data);
    // dateReset()
  };


  function BreakDialogueBox() {
    return (
      <>
        {!activeBreak && (
          <div onClick={() => setIsDialogueOpen(true)} className="">
            <button className="button2 max-md:w-full">Break In</button>
          </div>
        )}

        {activeBreak && (
          <button onClick={handleBreakOut} className="button2 max-md:w-full">
            Break Out
          </button>
        )}

        <div
          className={`fixed ${!isDialogueOpen && "hidden"} h-screen px-4 w-screen bg-black/30 top-0 right-0 z-20`}
        >
          <div className="h-full w-full flex items-center justify-center">
            <form
              onSubmit={breakHandleSubmit(handleBreak)}
              className="max-w-xl w-full h-2/3 flex items-center justify-between flex-col bg-white rounded-lg"
            >
              <div className="border-b-2 w-full border-zinc-100 flex items-center p-4 justify-between">
                <h1 className="text-xl text-zinc-800 font-medium">
                  Break Reason
                </h1>
                <button
                  onClick={() => setIsDialogueOpen(false)}
                  type="button"
                  className="text-3xl cursor-pointer"
                >
                  <IoIosClose />
                </button>
              </div>

              <div className="flex-1 flex flex-col gap-2 p-4 w-full">
                <textarea
                  {...breakRegister("description", {
                    required: "Please add your break reason",
                  })}
                  className="flex-1 w-full ring rounded-sm ring-zinc-300 px-2 py-1"
                  placeholder="Please provide a reason for break"
                ></textarea>
                {breakError.description && (
                  <p className="text-red-600 text-xs">
                    {breakError.description.message}
                  </p>
                )}
              </div>

              <div className="border-t-2 w-full border-zinc-100 flex items-center p-4 justify-end">
                <button
                  type="submit"
                  className="button2 flex items-center gap-2"
                >
                  <IoIosSave />
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      </>
    );
  }

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    checkPunch({ fromDate: today, toDate: today });
    dateValue("fromDate", today);
    dateValue("toDate", today);
  }, []);

  useEffect(() => {
    fetchProfile();
  }, []);
  return (
      <div className=" space-y-6">
        <div className="bg-zinc-100 p-4 w-full gap-4 flex max-md:flex-col md:items-end justify-between rounded-lg">
          <form
            onSubmit={dateHandleSubmit(handleDate)}
            className="flex gap-4 max-md:flex-col md:items-end"
          >
            <div className="flex items-center max-sm:flex-col gap-2">
              <div className=" max-md:w-full">
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
                {dateError.fromDate && (
                  <p className="text-red-600 text-xs">
                    {dateError.fromDate.message}
                  </p>
                )}
              </div>
              <div className=" max-md:w-full">
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
                {dateError.toDate && (
                  <p className="text-red-600 text-xs">
                    {dateError.toDate.message}
                  </p>
                )}
              </div>
            </div>

            <button type="submit" className="button2 ">
              Apply
            </button>
          </form>

          {/* break button */}
          {pathname === "/activities" && <BreakDialogueBox /> }
          
        </div>

        {/* timeline activity */}

        <div className="bg-zinc-100 px-4 py-10  w-full space-y-6 rounded-lg">
          <h2>TIMELINE ACTIVITY</h2>
          <div className="h-px  w-full bg-zinc-300" />

          {punchData?.length === 0 && (
            <div className="">No Data for current Timeline</div>
          )}

          {punchData?.map((item, index) => (
            <div
              key={index}
              className="md:px-5 py-4 flex items-center justify-between"
            >
              <div className=" flex items-center gap-2 md:gap-4">
                <div>
                  <div className="h-9 z-10  w-9">
                    <img
                      className="h-full w-full object-cover  ring ring-zinc-300   rounded-full"
                      src="https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
                      alt=""
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <h3 className="text-zinc-500 font-semibold ">
                    {userData.firstName + " " + userData.lastName}
                  </h3>
                  {item.activity_type === "break_in" && (
                    <h4 className="text-zinc-400 text-sm">
                      {item.description}
                    </h4>
                  )}
                </div>
                <div className="w-0.5 h-6 bg-zinc-300" />
                <h4 className="text-zinc-400">
                  {item.activity_type === "punch_in" && "Punch In"}
                  {item.activity_type === "punch_out" && "Punch Out"}
                  {item.activity_type === "break_in" && "Break In"}
                  {item.activity_type === "break_out" && "Break Out"}
                </h4>
              </div>
              <div className=" mr-6">
                <h4 className="text-sm text-zinc-500">
                  {formatTime(item.out_time ? item.out_time : item.in_time)}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </div>
  )
}
