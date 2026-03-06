import { useContext, useEffect, useState } from "react";
import Layout from "../../ui/layout";
import Checkbox from "@mui/material/Checkbox";
import { IoCloseSharp } from "react-icons/io5";
import axios from "../../../utils/axios";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import ActivityContext from "../../../src/context/activity-context";
import { Controller, useForm } from "react-hook-form";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import { MdDelete, MdEdit } from "react-icons/md";

export default function Todo() {
  const [completeTodoDialogue, setCompleteTodoDialogue] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [todoTaskData, settodoTaskData] = useState(null);
  const [selectedTodo, setselectedTodo] = useState(null);
  const [userData, setUserData] = useState(null);
  const [handleAddTodoDialogue, setHandleAddTodoDialogue] = useState(false);

  const { fetchProfile, profileData } = useContext(ActivityContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm();

  const getTodoTask = async () => {
    try {
      const data = await axios.get("/api/todo");
      settodoTaskData(data.data.data);
      console.log(data.data.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getAllUsersData = async () => {
    try {
      const users = await axios("/api/user");
      setUserData(users?.data.data);
      console.log(users.data.data);
    } catch (error) {
      toast.error(error.response.data.error);
    }
  };

  const handleCompleteTodoDialogue = (id) => {
    setselectedTodo(id);
    setCompleteTodoDialogue(true);
    setIsChecked(true);
  };

  const confirmCompleteTodo = async () => {
    try {
      await axios.put(`/api/todo/${selectedTodo}`);
      setCompleteTodoDialogue(false);
      setselectedTodo(null);
      getTodoTask();
      toast.success("Task has been completed");
    } catch (error) {
      console.log(error.message);
    }
  };

  const cancelCompleteTodo = () => {
    setCompleteTodoDialogue(false);
    setIsChecked(false);
    setselectedTodo(null);
  };

  const onSubmit = async (data) => {
    try {
      await axios.post("/api/todo", data);
      toast.success("Task added successfully");
      getTodoTask();
      reset();
      setHandleAddTodoDialogue(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getAllUsersData();
    fetchProfile();
    getTodoTask();
  }, []);

  return (
    <Layout>
      <div className="p-6 space-y-4">
        <div
          className={`fixed inset-0 z-20 ${
            !handleAddTodoDialogue && "hidden"
          } bg-black/30 flex items-center mb-0 justify-center p-3`}
        >
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-zinc-100 p-4 rounded-lg w-xl"
          >
            <div className="flex  justify-between">
              <h2 className="text-lg font-normal">Add Task</h2>
              <button
                type="button"
                onClick={() => setHandleAddTodoDialogue(false)}
                className="p-2 cursor-pointer"
              >
                <IoCloseSharp size={20} />
              </button>
            </div>
            <div className="space-y-4 pt-8">
              <div className="">
                <label className="label">Task Name:</label>
                <input
                  {...register("task", {
                    required: "Task Name is Required",
                    minLength: {
                      value: 5,
                      message: "Username must be at least 5 characters long",
                    },
                  })}
                  type="text"
                  placeholder="Task Name"
                  className="input"
                />
                {errors.task && (
                  <p className="text-red-600 mt-1 text-xs">
                    {errors.task.message}
                  </p>
                )}
              </div>
              <div className="">
                <label className="label">Due Date:</label>
                <input
                  {...register("due", {
                    required: "Due date is required",
                  })}
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  className="input"
                />
                {errors.due && (
                  <p className="text-red-600 mt-1 text-xs">
                    {errors.due.message}
                  </p>
                )}
              </div>
              <div className="">
                <label className="label">Task Priority:</label>
                <select
                  {...register("priority")}
                  type="text"
                  className="input relative"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="label">Assign To:</label>

                <Controller
                  name="assignedto"
                  control={control}
                  rules={{ required: "This field is required" }}
                  render={({ field: { onChange, value = [] } }) => (
                    <Select
                      multiple
                      value={value}
                      onChange={onChange}
                      renderValue={(selected) => {
                        if (selected.length === 0) {
                          return (
                            <span style={{ color: "#9ca3af" }}>Assign to</span>
                          );
                        }
                        return selected
                          .map(
                            (id) =>
                              userData?.find((user) => user.id === id)?.name,
                          )
                          .filter(Boolean)
                          .join(", ");
                      }}
                      sx={{
                        width: "100%",
                        marginTop: "8px",

                        "& .MuiOutlinedInput-input": {
                          padding: "6px 12px",
                          minHeight: "fit-content",
                          borderRadius: "4px",
                          backgroundColor: "white",
                          background: "#f4f4f5",
                        },

                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "#a1a1aa",
                            borderWidth: "1px",
                          },
                          "&:hover fieldset": {
                            borderColor: "#71717a",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#000000 !important",
                          },
                        },
                      }}
                    >
                      {userData?.map((name) => (
                        <MenuItem key={name.id} value={name.id}>
                          <Checkbox checked={value.indexOf(name.id) > -1} />
                          <ListItemText primary={name.name} />
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />

                {errors.assignedto && (
                  <p className="text-red-600 mt-1 text-xs">
                    {errors.assignedto.message}
                  </p>
                )}
              </div>
            </div>
            <div className="flex justify-end mt-8">
              <button className="button2" type="submit">
                Submit
              </button>
            </div>
          </form>
        </div>
        {profileData?.role === "admin" && (
          <div className="bg-zinc-100  p-4 w-full flex justify-end rounded-lg">
            <button
              onClick={() => setHandleAddTodoDialogue(true)}
              className="button2"
            >
              Add Task
            </button>
          </div>
        )}
        <div className="bg-zinc-100 space-y-6 p-4 w-full rounded-lg">
          <div className="grid grid-cols-5">
            <h2 className=" text-zinc-700  w-full">TASK</h2>
            <h2 className=" text-zinc-700 w-full">DUE</h2>
            <h2 className=" text-zinc-700 w-full">PRIORITY</h2>
            <h2 className=" text-zinc-700 w-full">STATUS</h2>
            <h2 className=" text-zinc-700 w-full">ACTIONS</h2>
          </div>
          <hr className="text-zinc-300" />
          {todoTaskData?.length === 0 && <p>No task available</p>}

          <div className="space-y-8">
            {todoTaskData?.map((item) => (
              <div key={item._id} className="grid grid-cols-5 items-center">
                <p className="w-full pl-4 text-zinc-500 text-sm flex items-center ">
                  {item.status === "completed" ? (
                    <Checkbox checked={true} disabled />
                  ) : (
                    <Checkbox
                      onClick={(e) => {
                        handleCompleteTodoDialogue(item._id);
                      }}
                      checked={selectedTodo === item._id && isChecked}
                    />
                  )}

                  {item.task}
                </p>
                <p className="w-full  text-zinc-500 text-sm ">
                  {dayjs(item.due).format("MMM DD YYYY")}
                </p>
                <p
                  className={`px-4 rounded-sm text-white py-1 ml-1 
                  ${item.priority === "high" && "bg-red-500"} 
                  ${item.priority === "medium" && "bg-orange-400"} 
                  ${item.priority === "low" && "bg-blue-400"} 
                  w-fit text-sm `}
                >
                  {item.priority}
                </p>
                <p
                  className={`px-4 rounded-sm text-white py-1 ml-1 
                  ${item.status === "pending" && "bg-yellow-500"} 
                  ${item.status === "completed" && "bg-green-400"} 
                  w-fit text-sm `}
                >
                  {item.status}
                </p>
                {profileData?.role === "admin" && (
                  <div className="flex gap-4 items-center">
                    <button
                      // onClick={() => openDeleteDialogue(item._id)}
                      className="w-fit pl-1 cursor-pointer text-zinc-500 text-xl"
                    >
                      <MdDelete />
                    </button>
                    <>
                      <button
                        // onClick={() /=> editProject(item)}
                        className="w-fit cursor-pointer text-zinc-500 text-xl"
                      >
                        <MdEdit />
                      </button>
                    </>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div
          className={`fixed inset-0 z-20 ${
            !completeTodoDialogue && "hidden"
          } bg-black/30 flex items-center mb-0 justify-center p-3`}
        >
          <div className="bg-zinc-100  rounded-lg w-xl">
            <div className="flex px-6 py-4 border-b border-zinc-300 justify-between">
              <h2 className="text-lg">
                Do you want to mark this task as completed?
              </h2>
            </div>
            <div className="flex items-center gap-3 p-4 justify-end">
              <button
                onClick={cancelCompleteTodo}
                className="button cursor-pointer"
              >
                Cancel
              </button>
              <button onClick={confirmCompleteTodo} className="button2">
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

// todo fetch all teh users from teh backend and display it in the select field and send that data to add task
