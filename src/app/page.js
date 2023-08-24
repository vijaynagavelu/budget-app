'use client';
import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { auth, provider } from "./googleSignIn/config"
import { signInWithPopup } from 'firebase/auth';
import useFirebaseAuthentication from '@/hooks/useFirebaseAuthentication';

import { signInWithEmailAndPassword } from "firebase/auth";


export default function Home() {

    const [token, setToken] = useState('');
    const [authenticatedUser, setAuthenticatedUser] = useState('');
    const authUser = useFirebaseAuthentication();
    const [email, setEmail] = useState('paul@gmail.com');
    const [password, setPassword] = useState('123456');


    useEffect(() => {
        if (authenticatedUser) {
            window.location.href = '/salary';
        }
    }, [authenticatedUser]);

    const signInWithGmail = () => {
        signInWithPopup(auth, provider).then((data) => {
            console.log(data.user)
        })
    }

    const loginWithDemoAccount = async (e) => {
        e.preventDefault()
        try {
            await signInWithEmailAndPassword(
                auth,
                email,
                password
            )
            console.log("logged");
        } catch (error) {
            console.log(error.message);
        }
    }

    const fetchData = useCallback(async () => {
        if (!token) {
            return;
        }
        console.log("Fetching data...");
        try {
            const response = await fetch(`/api/salary`, {
                headers: {
                    "authorization": token,
                    "Content-Type": "application/json"
                },
                method: "GET",
            });
            if (!response.ok) {
                console.error("Error fetching data:", response.status, response.statusText);
                return;
            }
            const result = await response.json();
            setAuthenticatedUser(result);
            //console.log(result);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }, [token]);


    useEffect(() => {
        if (!authUser) {
            return;
        }
        authUser.getIdToken().then((val) => {
            setToken(val);
        })
        fetchData();
    }, [authUser, fetchData])

    if (!authenticatedUser) {
        return (
            <main className="flex h-full  justify-center">

                <div className=' hidden lg:flex flex-col bg-gray-800 basis-1/2'>
                    <div className="justify-start  text-2xl  mb-16 pt-6 pl-6">
                        <div className='max-w-xl'>Budgetry</div>
                    </div>

                    <div className='flex justify-center text-center '>
                        <Image className="emoji"
                            width={500}
                            height={900}
                            alt="sry"
                            src="https://www.pngall.com/wp-content/uploads/7/Budget-PNG-Pic.png" />
                    </div>


                    <div className="flex justify-center text-center  text-2xl ">
                        <div className='max-w-sm'>Get started to know how your salary is spent and save effeciently</div>
                    </div>
                </div>
                <div className='flex px-10 flex-col h-full flex-start pt-12 lg:basis-1/2'>

                    <div className='topPortion'>
                        <div className=" max-w-xl  lg:hidden   text-2xl  mb-16">
                            Budgetry
                        </div>
                        <h1 className='text-5xl font-semibold mb-2 '>Get started.</h1>

                        <p className='text-sm mb-6'>Already have an account?
                            <span className='text-indigo-400 '>&nbsp; Sign up</span>
                        </p>

                        <div className='flex flex-col justify-between  lg:flex-col gap-x-2'>
                            <div onClick={signInWithGmail} className='flex flex-row cursor-pointer w-full  mb-4 lg:mb-0 justify-center items-center border gap-x-2 rounded-md px-2'>
                                <Image className="emoji"
                                    width={18}
                                    height={18}
                                    alt="sry"
                                    src="https://cdn-icons-png.flaticon.com/512/281/281764.png" />

                                <p className='py-3 text-sm '>
                                    Continue with Google</p>
                            </div>

                            <div className="flex flex-row items-center mb-5 mt-6 lg:mt-6">
                                <span className="border h-0 w-full"></span>
                                <span>or</span>
                                <span className="border h-0 w-full"></span>
                            </div>
                        </div>

                    </div>


                    <div className='footer flex flex-col grow'>
                        <p className=' text-xs mb-1.5'>Email address</p>
                        <input readOnly className='text-black w-full text-base p-3 font-medium  mb-4 rounded-md' value={email}></input>

                        <p className=' text-xs mb-1.5'>
                            Password</p>
                        <input type='password' readOnly className='w-full text-black text-base p-3 font-normal mb-4 rounded-md' value={password}></input>

                        <div className='h-full w-full flex items-end'>
                            <button type='button' onClick={loginWithDemoAccount} className=' py-2 mb-8 bg-indigo-600 w-full rounded-md'>
                                Login with Demo Account
                            </button>
                        </div>
                    </div>

                </div>
            </main>
        )
    }

    return (
        <div className='flex justify-center h-full items-center text-center '>
            <Image priority={true} className="emoji"
                width={100}
                height={100}
                alt="sry"
                src="https://media.tenor.com/UnFx-k_lSckAAAAC/amalie-steiness.gif" />
        </div>
    )
}














{/* <div className='flex flex-row w-full  justify-center items-center border gap-x-2  rounded-md  px-2'>
                        <Image className="emoji "
                            width={18}
                            height={18}
                            alt="sry"
                            src={'https://cdn-icons-png.flaticon.com/256/1312/1312139.png'} />

                        <p className='py-3 text-sm '>
                            Continue with Facebook</p>
                    </div> */}