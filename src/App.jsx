import React from 'react'
import { Route, Routes, useLocation, useParams } from 'react-router-dom'
import CreateUser from '../components/pages/create-user'
import ShowUsers from '../components/pages/show-users'
import UpdateUser from '../components/pages/update-user'
import Header from '../components/ui/header'

export default function App() {
  const location = useLocation();

  return (
    <div className='bg-zinc-300 min-h-screen space-y-12 w-full p-6'>
      <Header/>
      <Routes>
        <Route path='/create' element={<CreateUser/>}  />
        <Route path='/users' element={<ShowUsers/>}  />
        <Route path='/update/:id' element={<UpdateUser/>}  />
      </Routes>
    </div>
  )
}
