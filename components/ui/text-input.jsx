import React from "react";

export default function TextInput({label, type, placeholder, isRequired, name, handleChange, value}) {
  return (
    <>
      <label className="font-semibold text-gray-700">{label}</label>
      <input
      onChange={handleChange}
        value={value}
        type={type}
        name={name}
        className="input"
        // required={isRequired}
        placeholder={placeholder}
      />
    </>
  );
}



          // <div className="col-span-3">
          //   <label className="font-semibold text-gray-700">First Name</label>           
          //   <input className="input" onChange={handleChange}  type="text"  name="firstname" required={true} placeholder="First Name"/>
          // </div>

          // <div className="col-span-3">
          //   <label className="font-semibold text-gray-700">Last Name</label>
          //   <input className="input" type="text" onChange={handleChange} name="lastname" required={true} placeholder="Last Name" />
          // </div>

          // <div className="col-span-2">
          //   <label className="font-semibold text-gray-700">Email Address</label>
          //   <input className="input" type="email" onChange={handleChange} name="email" required={true} placeholder="somemail@gmail.com" />
          // </div>

          // <div className="col-span-2">
          //     <DropDown handleChange={handleChange} options={GenderOptions} name="gender" label="Gender" />
          // </div>