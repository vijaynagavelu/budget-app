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
    const [realTime, setRealTime] = useState('');

    const [error, setError] = useState(false);
    const authUser = useFirebaseAuthentication();

    const handleUpdate = () => {
        setIsUpdated(true);

        setTimeout(() => {
            setIsUpdated(false);
        }, 2000);
    };

    const postData = useCallback(async (data) => {
        if (note && amount && need && token) {
            const response = await fetch("http://localhost:3000/api/addExpense", {
                headers: {
                    "authorization": token
                },
                method: "POST",
                body: JSON.stringify(data),
            });
            const result = await response.json();
            console.log("Success:", result);
            setAmount("");
            setNote("");
            setNote("");
            handleUpdate();
            setError(false)
        } else setError(true)
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
            currentTime();
        })
    }, [authUser])





    function firstDayOfMonth() {
        const currentDate = new Date(); // Current date and time
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 2);
        // firstDayOfMonth.setHours(-18, -30, 0, 0)
        setCreatedAt(firstDayOfMonth);
        console.log("firstDayOfMonth:", firstDayOfMonth);
    }

    function currentDayOfMonth() {
        const currentDate = new Date(); // Current date and time
        // const currentDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
        const currentDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 14);
        currentDayOfMonth.setHours(currentDate.getHours() + 5, currentDate.getMinutes() + 30, currentDate.getSeconds(), currentDate.getMilliseconds())
        setUpdatedAt(currentDayOfMonth);
        console.log("currentDayOfMonth:");
    }

    function currentTime() {
        const currentDate = new Date(); // Current date and time
        setRealTime(currentDate);
    }


    return (
        <main className="flex justify-center">
            <div className="flex min-h-screen flex-col w-full max-w-lg px-10 pt-20 pb-4" >

                <div className="flex w-full justify-between pb-14">
                    <div className="-ml-6 text-2xl ">New Expense</div>
                    <Link href="/dashboard">
                        <div className="w-8  border-2 border-gray-200  cursor-pointer  text-center rounded-md"> x</div>
                    </Link>
                </div>

                <div className=" mb-2 pt-10  text-sm">What did you spend on?</div>
                <div className="flex mb-0 h-10">
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
