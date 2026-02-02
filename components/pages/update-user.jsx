import React, { useEffect, useState } from "react";
import TextInput from "../ui/text-input";
import DropDown from "../ui/dropdown";
import DateInput from "../ui/date-input";
import PhoneInput from "../ui/phone-input";
import PasswordInput from "../ui/password-input";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Header from "../ui/header";

export default function UpdateUser() {
  const FrontendSkills = ["HTML", "CSS", "JavaScript", "React", "Angulur"];
  const BackendSkills = ["PHP", "Laravel", "Python", "Node.js"];
  const GenderOptions = ["Male", "Female"];
  const DepartmentOptions = [
    "Web Development",
    "Devops",
    "Android Development",
    "Block Chain",
  ];
  const navigate = useNavigate();
  const {id} = useParams()

  const [error, seterror] = useState({});
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    gender: "",
    dob: "",
    department: "",
    joiningdate: "",
    mobileno1: "",
    mobileno2: "",
    password: "",
    address1: "",
    address2: "",
    emergencycontact1: "",
    emergencycontact2: "",
    emergencycontact3: "",
    skills: {
      frontend: [],
      backend: [],
    },
    aboutme: "",
  });


  useEffect(() => {
    const getUserById = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/user/${id}`)
        const user = res.data.data
        setFormData({
           ...user, dob : user.dob ? user.dob.split("T")[0] : "", 
           joiningdate : user.joiningdate ? user.joiningdate.split("T")[0] : "", 

        })
      } catch (error) {
        console.log(error)
      }
      
    }
    console.log(formData)
    getUserById()
  },[])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

const handleSkillChange = (e, type) => {
  const { value, checked } = e.target;

  setFormData((prev) => {
    const currentSkills = prev.skills || {
      frontend: [],
      backend: [],
    };

    const updatedSkills = checked
      ? [...currentSkills[type], value]
      : currentSkills[type].filter(
          (skill) => skill !== value
        );

    return {
      ...prev,
      skills: {
        ...currentSkills,
        [type]: updatedSkills,
      },
    };
  });
};

  // const saveDataToLocalStorage = (data) => {
  //   const existingData = JSON.parse(localStorage.getItem("Data")) || []

  //       existingData.push(data)

  //       localStorage.setItem("Data", JSON.stringify(existingData))
  // }

  const validate = (data) => {
    const currentDate = new Date().valueOf();
    const dob = new Date(data.dob).valueOf();
    const joiningdate = new Date(data.joiningdate).valueOf();

    if (!data.firstname.trim()) {
      return { firstname: "name is required" };
    } else if (data.firstname.length < 3) {
      return { firstname: "Name hould contain more then 3 characters" };
    }

    if (!data.email.trim()) {
      return { email: "email is required" };
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      return { email: "email must be in some@gmail.com format" };
    }

    if (!data.gender) {
      return { gender: "gender is required" };
    }

    if (!data.dob.trim()) {
      return { dob: "Select a Date of Birth" };
    } else if (dob > currentDate) {
      return { dob: "Select a correct date" };
    }

    if (!data.department) {
      return { department: "Please Select a Department" };
    }

    if (!data.joiningdate) {
      return { joiningdate: "Select a joining Date" };
    } else if (joiningdate < currentDate) {
      return { joiningdate: "Select correct date" };
    }

    if (!data.mobileno1) {
      return { mobileno1: "Phone no. is required" };
    } else if (data.mobileno1.length < 10) {
      return { mobileno1: "number must contain 10 characters" };
    }

    if (!data.password.trim()) {
      return { password: "Password is Required" };
    } else if (data.password.length < 8) {
      return { password: "Password should contain atlease 8 letters" };
    }

    if (!data.address1.trim()) {
      return { address1: "Address is Required" };
    }

    if (data.skills.length < 1) {
      return { skills: "please Select at lease one skill" };
    }

    return {};
  };


  const handleDeleteUser = async () => {
    try {
      const res = await axios.patch(`http://localhost:3000/deleteuser/${id}`)
      console.log("user deleted", res)
      console.log(id)
      navigate("/users")
    } catch (error) {
      console.log(error)
    }
  }


  const handleSubmit = async (e) => {
    e.preventDefault();

    const formError = validate(formData);

    if (Object.keys(formError).length > 0) {
      seterror(formError);
      return;
    }

    try {
      const res = await axios.patch(`http://localhost:3000/user/${id}`, formData);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }

    // saveDataToLocalStorage(formData)
    // setFormData({
    //   firstname: "",
    //   lastname: "",
    //   email: "",
    //   gender: "",
    //   dob: "",
    //   department: "",
    //   joiningdate: "",
    //   mobileno1: "",
    //   mobileno2: "",
    //   password: "",
    //   address1: "",
    //   address2: "",
    //   emergencycontact1: "",
    //   emergencycontact2: "",
    //   emergencycontact3: "",
    //   skills: [],
    //   aboutme: "",
    // });

    navigate("/users");
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-100 p-4 w-full space-y-6 rounded-lg"
      >
        {/* Form to edit profile */}
        <div className="flex justify-between items-center">
          <h1 className="heading">Edit Profile</h1>
          <button onClick={handleDeleteUser} type="button" className="px-3 py-1.5 text-white cursor-pointer bg-red-500 rounded-sm">
            Delete User
          </button>
        </div>
        <div className="grid grid-cols-6 gap-3 gap-y-4 w-full">
          <div className="col-span-3">
            <TextInput
              handleChange={handleChange}
              value={formData.firstname}
              type="text"
              label="First Name"
              name="firstname"
              isRequired={true}
              placeholder="First Name"
            />
            {error.firstname && (
              <p className="text-red-500">{error.firstname}</p>
            )}
          </div>

          <div className="col-span-3">
            <TextInput
              handleChange={handleChange}
              value={formData.lastname}
              type="text"
              label="Last Name"
              name="lastname"
              isRequired={true}
              placeholder="Last Name"
            />
          </div>

          <div className="col-span-2">
            <TextInput
              handleChange={handleChange}
              value={formData.email}
              type="text"
              label="Email Address"
              name="email"
              isRequired={true}
              placeholder="somemail@gmail.com"
            />
            {error.email && <p className="text-red-500">{error.email}</p>}
          </div>

          <div className="col-span-2">
            <DropDown
              handleChange={handleChange}
              value={formData.gender}
              options={GenderOptions}
              name="gender"
              label="Gender"
            />
            {error.gender && <p className="text-red-500">{error.gender}</p>}
          </div>

          <div className="col-span-2">
            <DateInput
              handleChange={handleChange}
              value={formData.dob}
              name="dob"
              label="DOB"
            />
            {error.dob && <p className="text-red-500">{error.dob}</p>}
          </div>

          <div className="col-span-3">
            <DropDown
              handleChange={handleChange}
              value={formData.department}
              options={DepartmentOptions}
              name="department"
              label="Select Department"
            />
            {error.department && (
              <p className="text-red-500">{error.department}</p>
            )}
          </div>

          <div className="col-span-3">
            <DateInput
              handleChange={handleChange}
              value={formData.joiningdate}
              name="joiningdate"
              label="Joining Date"
            />
            {error.joiningdate && (
              <p className="text-red-500">{error.joiningdate}</p>
            )}
          </div>

          <div className="col-span-2">
            <PhoneInput
              handleChange={handleChange}
              value={formData.mobileno1}
              type="number"
              name="mobileno1"
              label="Mobile No (1)"
              isRequired={true}
              placeholder="Enter Mobile No"
            />
            {error.mobileno1 && (
              <p className="text-red-500">{error.mobileno1}</p>
            )}
          </div>

          <div className="col-span-2">
            <PhoneInput
              handleChange={handleChange}
              value={formData.mobileno2}
              type="number"
              name="mobileno2"
              label="Mobile No (2)"
              isRequired={false}
              placeholder="Enter Mobile No"
            />
          </div>

          <div className="col-span-2">
            <PasswordInput
              handleChange={handleChange}
              value={formData.password}
              type="password"
              name="password"
              isRequired={true}
              label="Password"
              placeholder="..........."
            />
            {error.password && <p className="text-red-500">{error.password}</p>}
          </div>

          <div className="col-span-6">
            <TextInput
              handleChange={handleChange}
              value={formData.address1}
              type="text"
              name="address1"
              label="Address Line 1"
              isRequired={true}
              placeholder="Address Line 1"
            />
            {error.address1 && <p className="text-red-500">{error.address1}</p>}
          </div>

          <div className="col-span-6">
            <TextInput
              handleChange={handleChange}
              value={formData.address2}
              type="text"
              name="address2"
              label="Address Line 2"
              isRequired={false}
              placeholder="Address Line 2"
            />
          </div>

          <div className="col-span-2">
            <PhoneInput
              handleChange={handleChange}
              value={formData.emergencycontact1}
              type="number"
              name="emergencycontact1"
              label="Emergency Contact 1"
              isRequired={false}
              placeholder="Enter Emergency Contact"
            />
          </div>

          <div className="col-span-2">
            <PhoneInput
              handleChange={handleChange}
              value={formData.emergencycontact2}
              type="number"
              name="emergencycontact2"
              label="Emergency Contact 2"
              isRequired={false}
              placeholder="Enter Emergency Contact"
            />
          </div>

          <div className="col-span-2">
            <PhoneInput
              handleChange={handleChange}
              value={formData.emergencycontact3}
              type="number"
              name="emergencycontact3"
              label="Emergency Contact 3"
              isRequired={false}
              placeholder="Enter Emergency Contact"
            />
          </div>
        </div>

        {/* Skills Section */}
        <h1 className="heading">Skills</h1>
        <div className="space-y-5">
          <div>
            <h2 className="heading2">Frontend</h2>
            <div className="flex mt-2 gap-4">
              {FrontendSkills.map((item, index) => (
                <div key={index} name={item} className="flex gap-2">
                  <input
                    type="checkbox"
                    value={item}
                    checked={formData.skills.frontend.includes(item)}
                    name={item.toLowerCase()}
                    onChange={(e) => handleSkillChange(e, 'frontend')}
                  />{" "}
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="heading2">Backend</h2>
            <div className="flex mt-2 gap-4">
              {BackendSkills.map((item, index) => (
                <div key={index} name={item} className="flex gap-2">
                  <input
                    type="checkbox"
                    value={item}
                    checked={formData.skills.backend.includes(item)}
                    name={item.toLowerCase()}
                    onChange={(e) => handleSkillChange(e, 'backend')}
                  />{" "}
                  {item}
                </div>
              ))}
            </div>
          </div>
          {error.skills && <p className="text-red-500">{error.skills}</p>}
        </div>

        {/* About Me Section */}

        <h1 className="heading">About Me</h1>
        <textarea
          name="aboutme"
          onChange={handleChange}
          value={formData.aboutme}
          className="input h-32"
          placeholder="Hello Developers."
        ></textarea>

        <hr className="text-zinc-400" />

        <div className="flex justify-end">
          <input
            type="submit"
            value="Update Profile"
            className="px-3 py-1.5 cursor-pointer text-white bg-slate-400 rounded-sm"
          />
        </div>
      </form>
    </div>
  );
}
