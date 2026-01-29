import React from 'react'

export default function DateInput({name, label, handleChange, value}) {
  return (
    <>
        <label className="font-semibold text-gray-700">{label}</label>
        <input onChange={handleChange} value={value} className="input"  type="date" name={name} /> 
    </>
  )
}
