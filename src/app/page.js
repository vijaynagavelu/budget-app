import Image from 'next/image';
import Link from 'next/link';


export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-left p-6">
      <div className=" max-w-xl  text-2xl  mb-16">
        Budgetry
      </div>
      <h1 className='text-5xl font-semibold mb-2'>Get started.</h1>


      <p className='text-sm mb-6' >Already have an account?
        <span className='text-indigo-400 '>&nbsp; Login</span>
      </p>



      <div className='flex flex-row  px-16 mb-4 justify-center items-center border gap-x-2 rounded-md'>
        <Image className="emoji" width={18}
          height={18} alt="sry" src="https://cdn-icons-png.flaticon.com/512/281/281764.png" />

        <p className='py-3 text-sm'>  Continue with Google</p>
      </div>

      <div className='flex flex-row  px-16 justify-center items-center border gap-x-2 mb-16 rounded-md'>
        <Image className="emoji " width={18}
          height={18} alt="sry" src={'https://cdn-icons-png.flaticon.com/256/1312/1312139.png'} />

        <p className='py-3 text-sm '>  Continue with Facebook</p>
      </div>


      <div className="flex flex-row items-center mb-5">
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

      <Link href="/page2" className='flex '>
        <button className='py-2 bg-indigo-600  w-full'> Register </button>
      </Link>


    </main >
  )
}
