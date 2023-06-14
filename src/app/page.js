'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {

  return (
    <main className="flex h-full justify-center">

      <div className=' hidden lg:flex flex-col bg-gray-800 basis-1/2'>
        <div className="justify-start  text-2xl  mb-16 pt-6 pl-6">
          <div className='max-w-xl'>Budgetry</div>
        </div>

        <div className='flex justify-center text-center '>
          <Image className="emoji" width={500}
            height={900} alt="sry" src="https://www.pngall.com/wp-content/uploads/7/Budget-PNG-Pic.png" />
        </div>


        <div className="flex justify-center text-center  text-2xl ">
          <div className='max-w-sm'>Get started to know how your salary is spent and save effeciently</div>
        </div>
      </div>



      <div className='flex px-28 flex-col justify-center lg:basis-1/2'>
        <div className=" max-w-xl  lg:hidden   text-2xl  mb-16">
          Budgetry
        </div>
        <h1 className='text-5xl font-semibold mb-2 '>Get started.</h1>

        <p className='text-sm mb-6' >Already have an account?
          <span className='text-indigo-400 '>&nbsp; Login</span>
        </p>

        <div className='flex flex-col justify-between  lg:flex-row gap-x-2'>
          <div className='flex flex-row   mb-4 lg:mb-0 justify-center items-center border gap-x-2 rounded-md px-2'>
            <Image className="emoji" width={18}
              height={18} alt="sry" src="https://cdn-icons-png.flaticon.com/512/281/281764.png" />

            <p className='py-3 text-sm'>  Continue with Google</p>
          </div>

          <div className='flex flex-row   justify-center items-center border gap-x-2  rounded-md  px-2'>
            <Image className="emoji " width={18}
              height={18} alt="sry" src={'https://cdn-icons-png.flaticon.com/256/1312/1312139.png'} />

            <p className='py-3 text-sm '>  Continue with Facebook</p>
          </div>
        </div>




        <div className="flex flex-row items-center mb-5 mt-16 lg:mt-6">
          <span className="border h-0 w-full"></span>
          <span >or</span>
          <span className="border h-0 w-full"></span>
        </div>


        <p className=' text-xs mb-1.5'>Email address</p>
        <input className='text-black text-base p-3 font-medium  mb-4 rounded-md' placeholder='hello' value={"prasanna@gmail.com"}></input>

        <p className=' text-xs mb-1.5'> Password</p>
        <input className='text-black text-base p-3 font-normal mb-4 rounded-md'></input>

        <p className='5 text-xs mb-1.5'> Confirm Password</p>
        <input className='text-black text-base p-3 font-normal mb-8 rounded-md'></input>

        <Link href="/salary">
          <button type='button' className='py-2 bg-indigo-600 w-full rounded-md'> Register </button>
        </Link>
      </div>

    </main >
  )
}
