import React, { useContext, useEffect, useState } from "react";
import Layout from "../../ui/layout";
import axios from "../../../utils/axios";
import { toast } from "react-toastify";
import { MdDelete, MdEdit } from "react-icons/md";
import { IoCloseSharp } from "react-icons/io5";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { Controller, useForm } from "react-hook-form";
import Pagination from "@mui/material/Pagination";
import dayjs from "dayjs";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import ActivityContext from "../../../src/context/activity-context";

export default function Dashboard() {
  const [projectData, setProjectData] = useState(null);
  const [handleDialogue, setHandleDialogue] = useState(false);
  const [handleShowMoreDialogue, setHandleShowMoreDialogue] = useState(false);
  const [userData, setUserData] = useState(null);
  const [updateID, setUpdateID] = useState(null);
  const [handleUpdateDialogue, setHandleUpdateDialogue] = useState(false);
  const [openDeleteConfermationDialogue, setopenDeleteConfermationDialogue] = useState(false)
  const [deleteProjectId, setDeleteProjectId] = useState(null)
  const [showMoreData, setShowMoreData] = useState({
    title: "",
    items: [],
  });
  const [selectedFilteredDate, setselectedFilteredDate] = useState({
    fromDate: "",
    toDate: "",
  });
  const [page, setPage] = useState(1);
  const rowsPerPage = 4;

  const { fetchProfile, profileData } = useContext(ActivityContext);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm();

  const {
    register: updateRegister,
    handleSubmit: updateHandleSubmit,
    control: updateControl,
    reset: updateReset,
    setValue,
    formState: { errors: updateErrors },
  } = useForm();

  const {
    register: dateRegister,
    handleSubmit: dateHandleSubmit,
    setValue: dateValue,
    formState: { errors: dateError },
  } = useForm();

  const teamMember = userData;

  const paginatedData = projectData?.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage,
  );

  const today = dayjs().format("YYYY-MM-DD");

  const getAllUsersData = async () => {
    try {
      const users = await axios("/api/user");
      setUserData(users?.data.data);
      console.log(users.data.data);
    } catch (error) {
      toast.error(error.response.data.error);
    }
  };

  const getProjectData = async ({ fromDate, toDate }) => {
    try {
      const res = await axios.get("/api/project", {
        params: {
          fromDate,
          toDate,
        },
      });
      console.log(res.data.data);
      setProjectData(res.data.data);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const openDeleteDialogue = (id) => {
    setDeleteProjectId(id)
    setopenDeleteConfermationDialogue(true)
  }

  const deleteProjectById = async () => {
    try {
      await axios.delete(`/api/project/${deleteProjectId}`);
      toast.success("Project deleted successfully");
      getProjectData({
        fromDate: selectedFilteredDate.fromDate,
        toDate: selectedFilteredDate.toDate,
      });
      setopenDeleteConfermationDialogue(false)
      setDeleteProjectId(null)
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const editProject = (item) => {
    console.log(item);
    setHandleUpdateDialogue(true);
    setUpdateID(item._id);
    setValue("clientname", item.clientname);
    setValue("projectname", item.projectname);
    setValue("technology", item.technology);
    setValue(
      "teammembers",
      item.teammembers.map((item) => item._id),
    );
  };

  const onSubmit = async (data) => {
    try {
      await axios.post("/api/project", {
        clientname: data.clientname.trim(),
        projectname: data.projectname.trim(),
        teammembers: data.teammembers,
        technology: data.technology,
      });
      toast.success("Project has been Created successfully");
      reset();
      setHandleDialogue(false);
      getProjectData({ fromDate: today, toDate: today });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const dateSubmit = async (data) => {
    try {
      getProjectData({ fromDate: data.fromDate, toDate: data.toDate });
      setselectedFilteredDate({ fromDate: data.fromDate, toDate: data.toDate });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const updateSubmit = async (data) => {
    try {
      await axios.put(`/api/project/${updateID}`, data);
      toast.success("Project has been update successfully");
      updateReset();
      setHandleUpdateDialogue(false);
      getProjectData({
        fromDate: selectedFilteredDate.fromDate,
        toDate: selectedFilteredDate.toDate,
      });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const showMoreDialogue = (title, items) => {
    console.log(items);
    setShowMoreData({
      title,
      items: items,
    });
    console.log(items);
    setHandleShowMoreDialogue(true);
  };

  function DeleteProject() {
    return (
      <div
          className={`fixed inset-0 z-20 ${
            !openDeleteConfermationDialogue && "hidden"
          } bg-black/30 flex items-center mb-0 justify-center p-3`}
        >
          <div className="bg-zinc-100  rounded-lg w-xl">
            <div className="flex px-6 py-4 border-b border-zinc-300 justify-between">
              <h2 className="text-lg">
                Do you want to delete this Project?
              </h2>
            </div>
            <div className="flex items-center gap-3 p-4 justify-end">
              <button
                onClick={() => setopenDeleteConfermationDialogue(false)}
                className="button cursor-pointer"
              >
                Cancel
              </button>
              <button onClick={() => deleteProjectById()}  className="button2">
                Confirm
              </button>
            </div>
          </div>
        </div>
    )
  }

  function ShowMore() {
    return (
      <div
        className={`fixed inset-0 z-20 ${
          !handleShowMoreDialogue && "hidden"
        } bg-black/30 flex items-center mb-0 justify-center p-3`}
      >
        <div className="bg-zinc-100 space-y-4 p-4 rounded-lg w-xl">
          <div className="flex justify-between">
            <h2 className="text-lg font-normal">{showMoreData.title}</h2>
            <button
              onClick={() => setHandleShowMoreDialogue(false)}
              className="p-2 cursor-pointer"
            >
              <IoCloseSharp size={20} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {showMoreData.items.map((item, index) => (
              <span
                key={index}
                className="rounded-full bg-zinc-200 px-2 py-1 text-xs text-zinc-700"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }
  console.log(profileData);

  useEffect(() => {
    if (!projectData) return;

    const totalPages = Math.ceil(projectData.length / rowsPerPage);

    if (page > totalPages && totalPages > 0) {
      setPage(totalPages);
    }
  }, [projectData]);

  useEffect(() => {
    getAllUsersData();
    fetchProfile();
    getProjectData({ fromDate: today, toDate: today });
    dateValue("fromDate", today);
    dateValue("toDate", today);
  }, []);

  return (
    <Layout>
      <div className="p-6 space-y-4">
        {profileData?.role === "admin" && (
          <div className="bg-zinc-100 p-4 w-full gap-4 flex max-md:flex-col md:items-end justify-between rounded-lg">
            <form
              onSubmit={dateHandleSubmit(dateSubmit)}
              className="flex gap-4 max-md:flex-col md:items-end"
            >
              <div className="flex items-center max-sm:flex-col gap-2">
                <div className=" max-md:w-full">
                  <label className="font-semibold text-gray-700">
                    From Date
                  </label>
                  <input
                    {...dateRegister("fromDate", {
                      required: "From date is required",
                      validate: (value) => {
                        return (
                          new Date(value) < new Date() ||
                          "Select a Correct date"
                        );
                      },
                    })}
                    max={new Date().toISOString().split("T")[0]}
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
                          new Date(value) < new Date() ||
                          "Select a Correct date"
                        );
                      },
                    })}
                    max={new Date().toISOString().split("T")[0]}
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
            <button onClick={() => setHandleDialogue(true)} className="button2">
              Add Project
            </button>
          </div>
        )}
        <div className="bg-zinc-100 space-y-15 p-4 w-full rounded-lg">
          <ShowMore />
          <div className="space-y-10 mb-0 ">
            <div className="flex justify-between items-center">
              <h1 className="font-normal text-lg">Project Lists</h1>
            </div>
            <div className=" max-w-280 overflow-x-auto">
              <div className="min-w-280 min-h-80 space-y-6">
                <div
                  className={`grid ${profileData?.role === "admin" ? "grid-cols-5" : "grid-cols-4"}  gap-x-8`}
                >
                  <h2 className=" text-zinc-700 ml-2 w-full">PROJECT NAME</h2>
                  <h2 className=" text-zinc-700 w-full">CLIENT NAME</h2>
                  <h2 className=" text-zinc-700 w-full">TECHNOLOGY</h2>
                  <h2 className=" text-zinc-700 w-full">TEAM MEMBERS</h2>
                  {profileData?.role === "admin" && (
                    <h2 className=" text-zinc-700 w-full">ACTIONS</h2>
                  )}
                </div>
                <hr className="text-zinc-300" />
                {projectData?.length === 0 && (
                  <div className="text-center text-lg text-zinc-600">
                    Project not available
                  </div>
                )}
                <div className="space-y-8">
                  <DeleteProject/>
                  {paginatedData?.map((item, index) => (
                    <div
                      key={index}
                      className={`grid ${profileData?.role === "admin" ? "grid-cols-5" : "grid-cols-4"} gap-x-8 items-start`}
                    >
                      <p className="w-full pl-1  text-zinc-500 text-sm ">
                        {item.projectname}
                      </p>
                      <p className="w-full pl-1 text-zinc-500 text-sm">
                        {item.clientname}
                      </p>
                      <p className="w-full pl-1 flex flex-wrap gap-x-3   text-zinc-500 text-sm">
                        {item.technology.slice(0, 1).map((tech) => (
                          <span key={tech}>{tech}</span>
                        ))}

                        {item.technology.length > 1 && (
                          <span
                            onClick={() =>
                              showMoreDialogue("Technology", item.technology)
                            }
                            className="text-sky-700 cursor-pointer"
                          >
                            +{item.technology.length - 1} more
                          </span>
                        )}
                      </p>
                      <p className="w-full pl-1 text-zinc-500 flex flex-wrap gap-x-3 text-sm">
                        {item.teammembers.slice(0, 1).map((per) => (
                          <span key={per._id}>
                            {per.firstName} {per.lastName}
                          </span>
                        ))}

                        {item.teammembers?.length > 1 && (
                          <span
                            onClick={() =>
                              showMoreDialogue(
                                "Team Members",
                                item.teammembers.map(
                                  (member) =>
                                    `${member.firstName} ${member.lastName}`,
                                ),
                              )
                            }
                            className="text-sky-700 cursor-pointer"
                          >
                            +{item.teammembers.length - 1} more
                          </span>
                        )}
                      </p>
                      {profileData?.role === "admin" && (
                        <div className="flex gap-4 items-center">
                          <button
                            onClick={() => openDeleteDialogue(item._id)}
                            className="w-fit pl-1 cursor-pointer text-zinc-500 text-xl"
                          >
                            <MdDelete />
                          </button>
                          <>
                            <button
                              onClick={() => editProject(item)}
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
            </div>
            {projectData?.length > rowsPerPage && (
              <div className="flex justify-end mt-6">
                <Pagination
                  count={Math.ceil(projectData.length / rowsPerPage)}
                  page={page}
                  shape="rounded"
                  onChange={(event, value) => setPage(value)}
                />
              </div>
            )}
          </div>

          <div
            className={`fixed inset-0 z-20 ${
              !handleDialogue && "hidden"
            } bg-black/30 flex items-center mb-0 justify-center p-3`}
          >
            <div className="bg-zinc-100 space-y-4 p-4 rounded-lg w-xl">
              <div className="flex justify-between">
                <h2 className="text-lg font-normal">Add project</h2>
                <button
                  onClick={() => setHandleDialogue(false)}
                  className="p-2 cursor-pointer"
                >
                  <IoCloseSharp size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="">
                  <label className="label">Project Name:</label>
                  <input
                    {...register("projectname", {
                      required: "Project Name is Required",
                      minLength: {
                        value: 3,
                        message: "Must be at least 3 characters long",
                      },
                      validate: (value) => {
                        if (!value.trim()) return "Spaces are not allowed";
                        if (/^\d+$/.test(value.trim()))
                          return "Numbers are not allowed";
                        return true;
                      },
                    })}
                    type="text"
                    placeholder="Enter Project Name"
                    className="input"
                  />
                  {errors.projectname && (
                    <p className="text-red-600 mt-1 text-xs">
                      {errors.projectname.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="label">Client Name:</label>
                  <input
                    {...register("clientname", {
                      required: "Client Name is Required",
                      minLength: {
                        value: 3,
                        message: "Must be at least 3 characters long",
                      },
                      validate: (value) => {
                        if (!value.trim()) return "Spaces are not allowed";
                        if (/^\d+$/.test(value.trim()))
                          return "Numbers are not allowed";
                        return true;
                      },
                    })}
                    type="text"
                    placeholder="Enter Client Name"
                    className="input"
                  />
                  {errors.clientname && (
                    <p className="text-red-600 mt-1 text-xs">
                      {errors.clientname.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="label">Technology:</label>

                  <Controller
                    name="technology"
                    control={control}
                    rules={{
                      required: "Technology is required",
                    }}
                    render={({ field: { onChange, value } }) => (
                      <Autocomplete
                        multiple
                        options={technology}
                        value={value || []}
                        onChange={(event, newValue) => onChange(newValue)}
                        slotProps={{
                          chip: {
                            className:
                              "!bg-zinc-200 !text-zinc-800 !rounded-full !h-6",
                          },
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Select Technology"
                            sx={{
                              width: "100%",
                              marginTop: "8px",
                              "& .MuiOutlinedInput-root": {
                                padding: "0px 6px ",
                                minHeight: "fit-content",
                                borderRadius: "4px",
                                backgroundColor: "white",
                                background: "#f4f4f5",
                                "& fieldset": {
                                  borderColor: "#a1a1aa",
                                  borderWidth: "1px",
                                },
                                "&:hover fieldset": {
                                  borderColor: "#71717a",
                                },
                                "&.Mui-focused fieldset": {
                                  borderColor: "#18181b",
                                },
                              },
                            }}
                          />
                        )}
                      />
                    )}
                  />
                  {errors.technology && (
                    <p className="text-red-600 mt-1 text-xs">
                      {errors.technology.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="label">Team Members:</label>

                  <Controller
                    name="teammembers"
                    control={control}
                    rules={{ required: "Team Members is required" }}
                    render={({ field: { onChange, value = [] } }) => (
                      <Select
                        multiple
                        displayEmpty
                        value={value}
                        onChange={onChange}
                        MenuProps={{
                          anchorOrigin: {
                            vertical: "bottom", // attach to top of select
                            horizontal: "left",
                          },
                          transformOrigin: {
                            vertical: "top", // grow from bottom
                            horizontal: "left",
                          },
                          PaperProps: {
                            sx: {
                              mb: 1,
                              maxHeight: 190,
                            },
                          },
                        }}
                        renderValue={(selected) => {
                          if (selected.length === 0) {
                            return (
                              <span style={{ color: "#9ca3af" }}>
                                Select team members
                              </span>
                            );
                          }
                          return selected
                            .map(
                              (id) =>
                                teamMember.find((user) => user.id === id)?.name,
                            )
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
                        {teamMember?.map((name) => (
                          <MenuItem key={name.id} value={name.id}>
                            <Checkbox checked={value.indexOf(name.id) > -1} />
                            <ListItemText primary={name.name} />
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.teammembers && (
                    <p className="text-red-600 mt-1 text-xs">
                      {errors.teammembers.message}
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
              !handleUpdateDialogue && "hidden"
            } bg-black/30 flex items-center mb-0 justify-center p-3`}
          >
            <div className="bg-zinc-100 space-y-4 p-4 rounded-lg w-xl">
              <div className="flex justify-between">
                <h2 className="text-lg font-normal">Update Project</h2>
                <button
                  onClick={() => setHandleUpdateDialogue(false)}
                  className="p-2 cursor-pointer"
                >
                  <IoCloseSharp size={20} />
                </button>
              </div>
              <form
                onSubmit={updateHandleSubmit(updateSubmit)}
                className="space-y-4"
              >
                <div className="">
                  <label className="label">Project Name:</label>
                  <input
                    {...updateRegister("projectname", {
                      required: "Project Name is Required",
                      minLength: {
                        value: 3,
                        message: "Must be at least 3 characters long",
                      },
                      validate: (value) => {
                        if (!value.trim()) return "Spaces are not allowed";
                        if (/^\d+$/.test(value.trim()))
                          return "Numbers are not allowed";
                        return true;
                      },
                    })}
                    type="text"
                    placeholder="Enter Project Name"
                    className="input"
                  />
                  {updateErrors.projectname && (
                    <p className="text-red-600 mt-1 text-xs">
                      {updateErrors.projectname.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="label">Client Name:</label>
                  <input
                    {...updateRegister("clientname", {
                      required: "Client Name is Required",
                      minLength: {
                        value: 3,
                        message: "Must be at least 3 characters long",
                      },
                      validate: (value) => {
                        if (!value.trim()) return "Spaces are not allowed";
                        if (/^\d+$/.test(value.trim()))
                          return "Numbers are not allowed";
                        return true;
                      },
                    })}
                    type="text"
                    placeholder="Enter Client Name"
                    className="input"
                  />
                  {updateErrors.clientname && (
                    <p className="text-red-600 mt-1 text-xs">
                      {updateErrors.clientname.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="label">Technology:</label>

                  <Controller
                    name="technology"
                    control={updateControl}
                    rules={{
                      required: "Technology is required",
                    }}
                    render={({ field: { onChange, value } }) => (
                      <Autocomplete
                        multiple
                        options={technology}
                        value={value || []}
                        onChange={(event, newValue) => onChange(newValue)}
                        slotProps={{
                          chip: {
                            className:
                              "!bg-zinc-200 !text-zinc-800 !rounded-full !h-6",
                          },
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Select Technology"
                            sx={{
                              width: "100%",
                              marginTop: "8px",
                              "& .MuiOutlinedInput-root": {
                                padding: "0px 6px ",
                                minHeight: "fit-content",
                                borderRadius: "4px",
                                backgroundColor: "white",
                                background: "#f4f4f5",
                                "& fieldset": {
                                  borderColor: "#a1a1aa",
                                  borderWidth: "1px",
                                },
                                "&:hover fieldset": {
                                  borderColor: "#71717a",
                                },
                                "&.Mui-focused fieldset": {
                                  borderColor: "#18181b",
                                },
                              },
                            }}
                          />
                        )}
                      />
                    )}
                  />
                  {updateErrors.technology && (
                    <p className="text-red-600 mt-1 text-xs">
                      {updateErrors.technology.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="label">Team Members:</label>

                  <Controller
                    name="teammembers"
                    control={updateControl}
                    rules={{ required: "Team Members is required" }}
                    render={({ field: { onChange, value = [] } }) => (
                      <Select
                        multiple
                        value={value}
                        onChange={onChange}
                        renderValue={(selected) => {
                          if (selected.length === 0) {
                            return (
                              <span style={{ color: "#9ca3af" }}>
                                Select team members
                              </span>
                            );
                          }
                          return selected
                            .map(
                              (id) =>
                                teamMember.find((user) => user.id === id)?.name,
                            )
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
                        {teamMember?.map((name) => (
                          <MenuItem key={name.id} value={name.id}>
                            <Checkbox checked={value.indexOf(name.id) > -1} />
                            <ListItemText primary={name.name} />
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />

                  {updateErrors.teammembers && (
                    <p className="text-red-600 mt-1 text-xs">
                      {updateErrors.teammembers.message}
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

const technology = [
  "React.js",
  "Next.js",
  "Vue.js",
  "Tailwind CSS",
  "TypeScript",
  "Redux",
  "Node.js",
  "Express.js",
  "MongoDB",
  "PostgreSQL",
  "GraphQL",
  "Docker",
  "Redis",
  "Firebase",
  "AWS",
];
