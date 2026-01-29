import React from 'react'
import { Route, Routes } from 'react-router-dom'
import CreateUser from '../components/pages/create-user'
import ShowUsers from '../components/pages/show-users'

export default function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<CreateUser/>}  />
        <Route path='/users' element={<ShowUsers/>}  />
      </Routes>
    </div>
  )
}
