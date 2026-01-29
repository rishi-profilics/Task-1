import React from 'react'

export default function DropDown({options, name, label, handleChange, value}) {
  return (
    <>
      <label className="font-semibold text-gray-700">{label}</label>
      <select value={value} onChange={handleChange} className="input" name={name}>
          <option value="" disabled>
            Select {name}
          </option>
        {
            options.map((item, index) => (
                <option key={index} value={item.toLowerCase()}>{item}</option>
            ))
        }

      </select>
    </>
  )
}
