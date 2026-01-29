import React from "react";

export default function PasswordInput({label, type, placeholder, isRequired, handleChange, name, value}) {
  return (
    <>
      <label className="font-semibold text-gray-700">{label}</label>
      <input
        onChange={handleChange}
        name={name}
        value={value}
        type={type}
        className="input"
        // required={isRequired}
        placeholder={placeholder}
      />
    </>
  );
}
