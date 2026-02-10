import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Tab() {
    const {pathname} = useLocation()
  return (
    <div className='w-full flex gap-8 border-b border-zinc-500 p-6 mb-10 items-center'>
        <Link className='w-fit relative' to="/">
            <h3 className={` ${pathname == "/" ? "text-black font-semibold" : "text-zinc-600"} `}>Edit Profile</h3>
            {pathname == "/users" && <div className="absolute w-full left-0.5 top-12 bg-black h-0.5"/>} 
        </Link>
        <Link className='w-fit relative' to="/calender">
            <h3 className={` ${pathname == "/calender" ? "text-black font-semibold" : "text-zinc-600"} `}>Calender</h3>
            {pathname == "/users" && <div className="absolute w-full left-0.5 top-12 bg-black h-0.5"/>} 
        </Link>
        <Link className='w-fit relative' to="/timeline">
            <h3 className={` ${pathname == "/timeline" ? "text-black font-semibold" : "text-zinc-600"} `}>Timeline</h3>
            {pathname == "/users" && <div className="absolute w-full left-0.5 top-12 bg-black h-0.5"/>} 
        </Link>
        {/* <Link className='w-fit relative' to="/">
            <h3 className={`${pathname == "/" ? "text-black font-semibold"  : "text-zinc-600"}`}>Create profile</h3>
            {pathname == "/" && <div className="absolute w-full left-0.5 top-12 bg-black h-0.5"/>}
        </Link> */}
    </div>
  )
}
