import React from 'react'
import { UseSelector, useSelector } from 'react-redux'

const Welcome = () => {
  const {user} =useSelector((state)=>state.auth);
  
  return (
    <div >
        <h1 className='title'>Επισκόπηση</h1>
        <h2 className='subtitle'>Καλώς ορίσατε <strong>{user && user.name}</strong></h2>
        <br></br>
    </div>
  )
}

export default Welcome