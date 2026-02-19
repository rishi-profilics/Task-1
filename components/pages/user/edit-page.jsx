import React, { useEffect } from "react";
import Layout from "../../ui/layout";
import { useForm } from "react-hook-form";
import axios from "../../../utils/axios";
import Tab from "../../ui/tab";
import { formattedDate } from "../../../utils/format-date";

export default function EditPage() {
  const FrontendSkills = ["HTML", "CSS", "JavaScript", "React", "Angulur"];
  const BackendSkills = ["PHP", "Laravel", "Python", "Node.js"];
  const GenderOptions = ["Male", "Female"];
  const DepartmentOptions = [
    "Web Development",
    "Devops",
    "Android Development",
    "Block Chain",
  ];
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      department: "",
      gender: "",
    },
  });

  const fetchProfile = async () => {
    const user = await axios.get("/profile");
    const userData = user.data.data;

    setValue("firstName", userData.firstName);
    setValue("lastName", userData.lastName);
    setValue("email", userData.email);
    setValue("gender", userData.gender);
    setValue("dob", formattedDate(userData.dob));
    setValue("department", userData.department);
    setValue("joiningdate", formattedDate(userData.joiningdate));
    setValue("mobile1", userData.mobile1);
    setValue("address", userData.address);
    setValue("skills.frontend", userData.skills?.frontend);
    setValue("skills.backend", userData.skills?.backend);
    setValue("aboutme", userData.aboutme);
  };

  
  useEffect(() => {
    fetchProfile();
  }, []);

  const onSubmit = (data) => {
    const updateUser = async () => {
      const user = await axios.put("/profile", data);
    };

    updateUser();
    console.log(data);
    // reset(  )
  };

  return (
    <Layout>
      <div className="p-6">
        <Tab />
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-zinc-100 p-4 w-full space-y-6 rounded-lg"
        >
          {/* Form to edit profile */}
          <div className="flex justify-between items-center">
            <h1 className="heading">Edit Profile</h1>
          </div>
          <div className="grid grid-cols-6 gap-3 gap-y-4 w-full">
            <div className="col-span-6 md:col-span-3">
              <label className="font-semibold text-gray-700">First Name</label>
              <input
                {...register("firstName", {
                  required: "Name is required",
                  minLength: {
                    value: 3,
                    message: "Should contain atleast 3 characters",
                  },
                })}
                type="text"
                className="input"
                placeholder="First Name"
              />
              {errors.firstName && (
                <p className="text-red-600 text-xs">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div className="col-span-6 md:col-span-3">
              <label className="font-semibold text-gray-700">Last Name</label>
              <input
                {...register("lastName")}
                type="text"
                className="input"
                placeholder="Last Name"
              />
            </div>

            <div className="col-span-6 md:col-span-2">
              <label className="font-semibold text-gray-700">
                Email Address
              </label>
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter valid email",
                  },
                })}
                type="text"
                className="input"
                placeholder="Email Address"
              />
              {errors.email && (
                <p className="text-red-600 text-xs">{errors.email.message}</p>
              )}
            </div>

            <div className="col-span-6 md:col-span-2">
              <label className="font-semibold text-gray-700">Gender</label>
              <select {...register("gender")} className="input" name="gender">
                <option value="" disabled>
                  Select Gender
                </option>
                {GenderOptions.map((item, index) => (
                  <option key={index} value={item.toLowerCase()}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-6 md:col-span-2">
              <label className="font-semibold text-gray-700">DOB</label>
              <input
                {...register("dob", {
                  required: "Date of Birth is required",
                  validate: (value) => {
                    return (
                      new Date(value) < new Date() || "Select a Correct date"
                    );
                  },
                })}
                className="input"
                type="date"
              />
              {errors.dob && (
                <p className="text-red-600 text-xs">{errors.dob.message}</p>
              )}
            </div>

            <div className="col-span-6 md:col-span-3">
              <label className="font-semibold text-gray-700">
                Select Department
              </label>
              <select {...register("department")} className="input">
                <option value="" disabled>
                  Select Department
                </option>
                {DepartmentOptions.map((item, index) => (
                  <option key={index} value={item.toLowerCase()}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-6 md:col-span-3">
              <label className="font-semibold text-gray-700">
                Joining Date
              </label>
              <input
                {...register("joiningdate", {
                  required: "Joining Date is required",
                  validate: (value) => {
                    return (
                      new Date(value) > new Date() || "Select a Correct date"
                    );
                  },
                })}
                className="input"
                type="date"
              />
              {errors.joiningdate && (
                <p className="text-red-600 text-xs">
                  {errors.joiningdate.message}
                </p>
              )}
            </div>

            <div className="col-span-6 md:col-span-2">
              <label className="font-semibold text-gray-700">
                Mobile no. 1
              </label>
              <input
                {...register("mobile1", {
                  required: "Mobile number is required",
                  pattern: {
                    value: /^[6-9]\d{9}$/,
                    message: "Enter valid 10-digit mobile number",
                  },
                })}
                type="text"
                className="input"
                placeholder="Mobile no. 1"
              />
              {errors.mobile1 && (
                <p className="text-red-600 text-xs">{errors.mobile1.message}</p>
              )}
            </div>

            <div className="col-span-6 md:col-span-2">
              <label className="font-semibold text-gray-700">
                Mobile no. 2
              </label>
              <input
                {...register("mobile2")}
                type="number"
                className="input"
                placeholder="Mobile no. 2"
              />
            </div>

            <div className="col-span-6 md:col-span-2">
              <label className="font-semibold text-gray-700">Password</label>
              <input
                {...register("password", {
                  //   minLength: {
                  //     value: 8,
                  //     message: "Password must be more then 8 characters",
                  //   },
                })}
                type="password"
                className="input"
                placeholder="Password"
              />
              {errors.password && (
                <p className="text-red-600 text-xs">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="col-span-6">
              <label className="font-semibold text-gray-700">Address</label>
              <input
                {...register("address", {
                  required: "Address is required",
                  minLength: {
                    value: 3,
                    message: "Should contain atleast 3 characters",
                  },
                })}
                type="text"
                className="input"
                placeholder="Address"
              />
              {errors.address && (
                <p className="text-red-600 text-xs">{errors.address.message}</p>
              )}
            </div>
          </div>

          <h1 className="heading">Skills</h1>
          <div className="space-y-5">
            <div>
              <h2 className="heading2">Frontend</h2>
              <div className="flex flex-wrap mt-2 gap-4">
                {FrontendSkills.map((item, index) => (
                  <div key={index} name={item} className="flex  gap-2">
                    <input
                      {...register("skills.frontend", {
                        required: "Select atleast one Frontend Skill",
                      })}
                      type="checkbox"
                      value={item}
                    />{" "}
                    {item}
                  </div>
                ))}
              </div>
              {errors.skills?.frontend && (
                <p className="text-red-600 text-xs">
                  {errors.skills?.frontend.message}
                </p>
              )}
            </div>

            <div>
              <h2 className="heading2">Backend</h2>
              <div className="flex flex-wrap mt-2 gap-4">
                {BackendSkills.map((item, index) => (
                  <div key={index} name={item} className="flex  gap-2">
                    <input
                      {...register("skills.backend", {
                        required: "Select at least one backend skills",
                      })}
                      type="checkbox"
                      value={item}
                    />{" "}
                    {item}
                  </div>
                ))}
              </div>
              {errors.skills?.backend && (
                <p className="text-red-600 text-xs">
                  {errors.skills?.backend.message}
                </p>
              )}
            </div>
          </div>

          <h1 className="heading">About Me</h1>
          <textarea
            {...register("aboutme")}
            className="input h-52"
            placeholder="Hello Developers."
          ></textarea>

          <hr className="text-zinc-400" />

          <div className="flex justify-end">
            <input type="submit" value="Update Profile" className="button2" />
          </div>
        </form>
      </div>
    </Layout>
  );
}
