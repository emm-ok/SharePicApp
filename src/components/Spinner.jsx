import React from 'react'
import { Vortex } from 'react-loader-spinner';

const Spinner = ({ message, textColor }) => {
  return (
    <div className='flex flex-col gap-4 justify-center items-center w-full h-full'>
      <Vortex
        color="#00BFFF"
        height={100}
        width={200}
        className='m-5'
        ariaLabel='loading'
      />
      <p className={`${textColor && 'text-white text-[2rem]'} text-xl text-center px-2`}>{message}</p>
    </div>
  )
}

export default Spinner