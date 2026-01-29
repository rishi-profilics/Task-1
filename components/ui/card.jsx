import React from 'react'
import { FaFacebookF, FaLinkedinIn, FaSlackHash } from 'react-icons/fa'

export default function Card({item}) {
    const { firstname, lastname, email } = item
  return (
      <div className="bg-zinc-100 p-4 rounded-xl flex flex-col items-center gap-5">
        <div className="h-32 w-32 rounded-full overflow-hidden object-cover">
            <img src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR99-ZMZeEtYlFVdT-HN3Hz0f_i64Zf76D67g&s"} alt="" />
        </div>

        <div className="flex flex-col items-center">
            <h2 className='text-zinc-700 font-semibold'>{`${firstname} ${lastname}`}</h2>
            <h3 className='text-zinc-600'>{email}</h3>
        </div>

        <div className="flex justify-center gap-6">
            <FaFacebookF size={22}/>
            <FaSlackHash size={22} />
            <FaLinkedinIn size={22} />
        </div>

        <div className="flex flex-col items-center gap-y-2">
            <button className='button'>View Profile</button>
            <button className='button'>Message</button>
        </div>

        {/* <div className="flex gap-8">
            <div className="flex flex-col items-center">
                <h3 className='font-semibold text-lg'>Project</h3>
                <h4 className='text-xl font-bold text-zinc-500'>{project}</h4>
            </div>
            
            <div className="w-px h-ful bg-zinc-300"></div>

            <div className="flex flex-col items-center">
                <h3 className='font-semibold text-lg'>Deal</h3>
                <h4 className='text-xl font-bold text-zinc-500'>{deal}</h4>
            </div>
        </div> */}
      </div>
  )
}
