"use client"
import useFirebaseAuthentication from "@/hooks/useFirebaseAuthentication";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";


export default function Home() {

    const [note, setNote] = useState('');
    const [amount, setAmount] = useState('');
    const [need, setNeed] = useState('');
    const [token, setToken] = useState('');
    const [createdAt, setCreatedAt] = useState('');
    const [updatedAt, setUpdatedAt] = useState('');
    const [isUpdated, setIsUpdated] = useState(false);
    const [error, setError] = useState(false);
    const authUser = useFirebaseAuthentication();

    const [temp, setTemp] = useState('');


    const firstDayOfMonth = useCallback(async () => {
        const currentDate = new Date(); // Current date and time
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 2);
        setCreatedAt(convertToEpoch(firstDayOfMonth));
    }, [])

    const currentDayOfMonth = useCallback(async () => {
        const currentDate = new Date(); // Current date and time
        // const currentDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), currentDate.getHours());
        setUpdatedAt(convertToEpoch(currentDate));
    }, [])

    function convertToEpoch(date) {
        const epochTimestamp = Math.floor(date.getTime() / 1000);
        return epochTimestamp;
    }

    const handleUpdate = () => {
        setIsUpdated(true);
        setTimeout(() => {
            setIsUpdated(false);
        }, 2000);
    };

    const postData = useCallback(async (data) => {
        if (note && amount && need && token) {
            try {
                const response = await fetch(`/api/addExpense`, {
                    headers: {
                        "authorization": token,
                        "Content-Type": "application/json"
                    },
                    method: "POST",
                    body: JSON.stringify(data),
                });

                if (!response.ok) {
                    console.error("Error posting data:", response.status, response.statusText);
                    return;
                }
                const result = await response.json();
                console.log("Success:", result);
                setAmount("");
                setNote("");
                setNeed("");
                handleUpdate();
                setError(false);
            } catch (error) {
                console.error("Error posting data:", error);
            }
        } else {
            setError(true);
        }
    }, [amount, need, note, token]);

    const check = useCallback(async () => {
        if (note && amount && need) {
            setError(false);
        }
    }, [amount, need, note])

    useEffect(() => {
        check()
    }, [check])

    useEffect(() => {
        if (!authUser) {
            return;
        }
        authUser.getIdToken().then((val) => {
            setToken(val);
            firstDayOfMonth();
            currentDayOfMonth();
        })
    }, [authUser, currentDayOfMonth, firstDayOfMonth])

    return (
        <main className="flex justify-center">
            <div className="flex min-h-screen flex-col w-full max-w-lg px-10 pt-20 pb-4" >

                <div className="flex w-full justify-between pb-14">
                    <div className="-ml-6 text-2xl ">New Expense</div>
                    <Link href="/dashboard">
                        <div className="w-8 cursor-pointer text-center rounded-md"> <svg xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 24 24" id="box"><path fill="white" d="M7,14H9a1,1,0,0,0,0-2H7a1,1,0,0,0,0,2Zm6,2H7a1,1,0,0,0,0,2h6a1,1,0,0,0,0-2ZM19,2H5A3,3,0,0,0,2,5V19a3,3,0,0,0,3,3H19a3,3,0,0,0,3-3V5A3,3,0,0,0,19,2ZM14,4V7.29l-1.51-.84a1,1,0,0,0-1,0L10,7.29V4Zm6,15a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V5A1,1,0,0,1,5,4H8V9a1,1,0,0,0,.5.86,1,1,0,0,0,1,0L12,8.47l2.51,1.4A1,1,0,0,0,15,10a1,1,0,0,0,1-1V4h3a1,1,0,0,1,1,1Z"></path></svg></div>
                    </Link>
                </div>


                {/* <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" enable-background="new 0 0 32 32" version="1" viewBox="0 0 32 32" id="edit"><path fill="white" d="M26.857,31.89H3c-1.654,0-3-1.346-3-3V5.032c0-1.654,1.346-3,3-3h16.214c0.553,0,1,0.448,1,1s-0.447,1-1,1H3c-0.551,0-1,0.449-1,1V28.89c0,0.551,0.449,1,1,1h23.857c0.552,0,1-0.449,1-1V12.675c0-0.552,0.447-1,1-1s1,0.448,1,1V28.89C29.857,30.544,28.512,31.89,26.857,31.89z M24.482,23.496c-0.002,0-0.003,0-0.005,0L5.192,23.407c-0.553-0.002-0.998-0.452-0.996-1.004c0.002-0.551,0.45-0.996,1-0.996c0.001,0,0.003,0,0.004,0l19.286,0.089c0.552,0.002,0.998,0.452,0.995,1.004C25.479,23.051,25.032,23.496,24.482,23.496z M15.251,18.415c-0.471,0-0.781-0.2-0.957-0.366c-0.297-0.28-0.709-0.931-0.14-2.151l0.63-1.35c0.516-1.104,1.596-2.646,2.459-3.51L26,2.281c0.003-0.002,0.005-0.004,0.007-0.006c0.002-0.002,0.004-0.004,0.006-0.006l0.451-0.451c1.168-1.169,2.979-1.262,4.036-0.207c0,0,0,0,0,0c1.056,1.055,0.963,2.866-0.207,4.036c0,0-0.536,0.552-0.586,0.586l-8.635,8.635c-0.85,0.85-2.345,1.964-3.405,2.538l-1.218,0.657C15.969,18.322,15.572,18.415,15.251,18.415z M26.714,4.396l-8.056,8.057c-0.699,0.7-1.644,2.047-2.061,2.942L16.4,15.815l0.316-0.17c0.885-0.479,2.233-1.482,2.942-2.192l8.057-8.057L26.714,4.396z M28.163,3.016l0.932,0.932c0.2-0.356,0.177-0.737-0.009-0.923C28.881,2.82,28.499,2.83,28.163,3.016z"></path></svg> */}

                <div className=" mb-2 pt-10  text-sm">What did you spend on?</div>
                <div className="flex h-10">
                    <input type="text" onChange={(e) => { setNote(e.target.value); check() }} className='text-white grow bg-transparent border-2 border-[#E3EBFD] rounded-md text-base  font-semibold p-3' placeholder="" value={note} ></input>
                </div>

                <div className=" mb-2 pt-4  text-sm">Amount</div>
                <div className="flex h-10">
                    <input type="number" onChange={(e) => { setAmount(e.target.value); check() }} className='text-white specialInput grow bg-transparent border-2 border-[#E3EBFD] rounded-md text-base  font-semibold p-3' placeholder="" value={amount} ></input>
                </div>

                <div className=" mb-2 pt-4  text-sm">Need</div>
                <div className="flex mb-2" onChange={(e) => { setNeed(e.target.value); check() }} >
                    <select className="text-white bg-transparent border-2 border-[#E3EBFD] text-base p-3 font-medium grow rounded-md">
                        <option className="text-white bg-black" value="">--Please choose an option--</option>
                        <option className="text-white bg-black" value="Non Essentials" >Non Essentials</option>
                        <option className="text-white bg-black" value="Essentials" >Essentials</option>
                    </select>
                </div>

                {error && <div className="text-red-600 font-bold mb-8">Fill all the values </div>}
                {!error && <div className="text-transparent font-bold mb-8">Fill all the values </div>}

                <div className="flex flex-col grow justify-end mb-6" >
                    <button
                        onClick={() => postData({ "need": need, "note": note, "amount": amount, "createdAt": createdAt, "updatedAt": updatedAt })}
                        className={`transition-colors duration-300 ${isUpdated
                            ? 'bg-indigo-800 text-white transform scale-105'
                            : 'bg-indigo-600 text-white-700'
                            } hover:bg-indigo-800 hover:text-white px-4 py-2 rounded-md`}
                    >
                        {isUpdated ? 'Added ✔' : 'Add'}
                    </button>
                </div>
            </div>
        </main >

    )
}
