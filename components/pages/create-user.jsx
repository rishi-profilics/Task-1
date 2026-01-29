import React, { useState } from "react";
import TextInput from '../ui/text-input'
import DropDown from '../ui/dropdown'
import DateInput from '../ui/date-input'
import PhoneInput from '../ui/phone-input'
import PasswordInput from '../ui/password-input'
import { Link, Route, useNavigate } from "react-router-dom";

export default function CreateUser() {
  const FrontendSkills = ["HTML", "CSS", "JavaScript", "React", "Angulur"]
  const BackendSkills = ["PHP", "Laravel", "Python", "Node.js"]
  const GenderOptions =["Male", "Female", "Other"]
  const DepartmentOptions =["Web Development", "Devops", "Android Development", "Block Chain"]
  const navigate = useNavigate()

  const [error, seterror] = useState({})
  const [currentDate, setCurrentDate] = useState("")
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
    skills: [],
    // frontendskills: [],
    // backendskills: [],
    aboutme: "",
  })

  const handleChange = (e) => {
    const {name, value} = e.target
    setFormData( prev => ({ ...prev, [name]: value}))
  }

  const handleSkillChange = (e) => {
  const {name, value, checked} = e.target
  setFormData(prev => ({ ...prev, skills: checked ? [...prev.skills, value] : prev.skills.filter((skills) => skills !== val)
  }))
}


  const saveDataToLocalStorage = (data) => {
    const existingData = JSON.parse(localStorage.getItem("Data")) || []

        existingData.push(data)

        localStorage.setItem("Data", JSON.stringify(existingData))
  }

  const validate = (data) => {
    const newError = {}

    if(!data.firstname.trim()) {
      newError.firstname = "name is required"
    }

    if(!data.email.trim()) {
      newError.email = "email is required"
    }
    else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))) {
      newError.email = "email must be in some@gmail.com format"
    }

    if(!data.mobileno1.trim()) {
      newError.mobileno1 = "Phone no. is required"
    }

    if(!data.gender.trim()) {
      newError.gender = "gender is required"
    }

    else if( data.mobileno1.length < 10) {
      newError.mobileno1 = "number must contain 10 characters"
    }

    if(!data.dob.trim()) {
      newError.dob = "Select a Date of Birth"
    }

    if(!data.department) {
      newError.department = "Please Select a Department"
    }

    if(!data.joiningdate) {
      newError.joiningdate = "Select a joining Date"
    }

    if(!data.password.trim()) {
      newError.password = "Password is Required"
    }

    else if(data.password.length < 8) {
      newError.password = "Password should contain atlease 8 letters"
    }

    if(!data.address1.trim()) {
      newError.address1 = "Address is Required"
    }

    if(data.skills.length < 1 ) {
      newError.skills = "please Select at lease one skill"
    }

    return newError
  }

  // const date = new Date().toLocaleDateString("en-GB")
  // setCurrentDate(date)
  // console.log(date)


  const handleSubmit = (e) => {
    e.preventDefault();

    const formError =  validate(formData)
    seterror(formError)
    console.log(formError)

    if(Object.keys(formError).length > 0){
      return
    }
    

    saveDataToLocalStorage(formData)
    setFormData({
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
      skills: [],
      // frontendskills: [],
      // backendskills: [],
      aboutme: "",
    })
    
    navigate("/users")

  };


  return (
    <div className="bg-zinc-300 h-full space-y-12 w-full p-6">
          <div className="w-full flex justify-end">
            <Link to="/users" >
             <button className='px-3 py-1.5 text-white bg-slate-500 rounded-sm'>See Users</button>
            </Link>
        </div>

      <form onSubmit={handleSubmit} className="bg-zinc-100 p-4 w-full space-y-6 rounded-lg">

      {/* Form to edit profile */}
        <h1 className="heading">Add Profile</h1>
          <div className="grid grid-cols-6 gap-3 gap-y-4 w-full">
          <div className="col-span-3">
              <TextInput handleChange={handleChange} value={formData.firstname} type="text" label="First Name" name="firstname" isRequired={true} placeholder="First Name"/>
              {error.firstname && <p className="text-red-500">{error.firstname}</p> }     
          </div>

          <div className="col-span-3">
              <TextInput handleChange={handleChange} value={formData.lastname} type="text" label="Last Name" name="lastname" isRequired={true} placeholder="Last Name" />
          </div>

          <div className="col-span-2">
              <TextInput handleChange={handleChange} value={formData.email} type="text" label="Email Address" name="email" isRequired={true} placeholder="somemail@gmail.com" />
              {error.email && <p className="text-red-500">{error.email}</p> }
          </div>

          <div className="col-span-2">
              <DropDown handleChange={handleChange} value={formData.gender} options={GenderOptions} name="gender" label="Gender" />
              {error.gender && <p className="text-red-500">{error.gender}</p> }
          </div>
          
          <div className="col-span-2">
              <DateInput handleChange={handleChange} value={formData.dob} name="dob" label="DOB" />
              {error.dob && <p className="text-red-500">{error.dob}</p> }
          </div>

          <div className="col-span-3">
              <DropDown handleChange={handleChange} value={formData.department} options={DepartmentOptions} name="department" label="Select Department"/>
              {error.department && <p className="text-red-500">{error.department}</p> }
          </div>

          <div className="col-span-3">
              <DateInput handleChange={handleChange} value={formData.joiningdate} name="joiningdate" label="Joining Date" />
              {error.joiningdate && <p className="text-red-500">{error.joiningdate}</p> }
          </div>

          <div className="col-span-2">
              <PhoneInput handleChange={handleChange} value={formData.mobileno1} type="number" name="mobileno1" label="Mobile No (1)" isRequired={true} placeholder="Enter Mobile No" />
              {error.mobileno1 && <p className="text-red-500">{error.mobileno1}</p> }
          </div>

          <div className="col-span-2">
              <PhoneInput handleChange={handleChange} value={formData.mobileno2} type="number" name="mobileno2" label="Mobile No (2)" isRequired={false} placeholder="Enter Mobile No" />
          </div>

          <div className="col-span-2">
              <PasswordInput handleChange={handleChange} value={formData.password} type="password" name="password" isRequired={true} label="Password" placeholder="..........." />
              {error.password && <p className="text-red-500">{error.password}</p> }
          </div>

          <div className="col-span-6">
              <TextInput handleChange={handleChange} value={formData.address1} type="text" name="address1" label="Address Line 1" isRequired={true} placeholder="Address Line 1" />
              {error.address1 && <p className="text-red-500">{error.address1}</p> }
          </div>

          <div className="col-span-6">
              <TextInput handleChange={handleChange} value={formData.address2} type="text" name="address2" label="Address Line 2" isRequired={false} placeholder="Address Line 2" />
          </div>

          <div className="col-span-2">
              <PhoneInput handleChange={handleChange} value={formData.emergencycontact1} type="number" name="emergencycontact1" label="Emergency Contact 1" isRequired={false} placeholder="Enter Emergency Contact" />
          </div>

          <div className="col-span-2">
              <PhoneInput handleChange={handleChange} value={formData.emergencycontact2} type="number" name="emergencycontact2" label="Emergency Contact 2" isRequired={false} placeholder="Enter Emergency Contact" />
          </div>

          <div className="col-span-2">
              <PhoneInput handleChange={handleChange} value={formData.emergencycontact3} type="number" name="emergencycontact3" label="Emergency Contact 3" isRequired={false} placeholder="Enter Emergency Contact" />
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
                  <input type="checkbox" value={item} checked={formData.skills.includes(item)} name={item.toLowerCase()} onChange={handleSkillChange} /> {item}
                </div>
              ))}
              </div>
            </div>

            <div>
              <h2 className="heading2">Backend</h2>
              <div className="flex mt-2 gap-4">
              {BackendSkills.map((item, index) => (
                <div key={index} name={item} className="flex gap-2">
                  <input type="checkbox" value={item} checked={formData.skills.includes(item)} name={item.toLowerCase()} onChange={handleSkillChange} /> {item}
                </div>
              ))}
              </div>
            </div>
            {error.skills && <p className="text-red-500">{error.skills}</p> }
        </div>

      {/* About Me Section */}

      <h1 className="heading">About Me</h1>
      <textarea name="aboutme" onChange={handleChange} value={formData.aboutme} className="input h-32" placeholder="Hello Developers."></textarea>

      <hr  className="text-zinc-400"/>

      <div className="flex justify-end">
        <input type="submit"  value="Add Profile" className="px-3 py-1.5 text-white bg-slate-400 rounded-sm"/>
      </div>
      </form>

    </div>
  );
}



// should not check validation if one is wrong
// email validation
// dob validation
// joining date validation
//
