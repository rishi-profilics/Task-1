import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Tab() {
    const {pathname} = useLocation()
    console.log(pathname)
  return (
    <div className='w-full flex gap-8 border-b border-zinc-500 p-6 mb-10 items-center'>
        <Link className='w-fit relative' to="/users">
            <h3 className={` ${pathname == "/users" ? "text-black font-semibold" : "text-zinc-600"} `}>View Profile</h3>
            {pathname == "/users" && <div className="absolute w-full left-0.5 top-12 bg-black h-0.5"/>} 
        </Link>
        <Link className='w-fit relative' to="/">
            <h3 className={`${pathname == "/" ? "text-black font-semibold"  : "text-zinc-600"}`}>Create profile</h3>
            {pathname == "/" && <div className="absolute w-full left-0.5 top-12 bg-black h-0.5"/>}
        </Link>
    </div>
  )
}
