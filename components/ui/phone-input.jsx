import React from "react";

export default function PhoneInput({label, type, placeholder, isRequired, handleChange, name, value}) {
  return (
    <>
      <label className="font-semibold text-gray-700">{label}</label>
      <input
        onChange={handleChange}
        value={value}
        name={name}
        type={type}
        minLength={10}
        className="input"
        // required={isRequired}
        placeholder={placeholder}
      />
    </>
  );
}
