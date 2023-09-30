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
        // const currentDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), temp, currentDate.getHours());
        // setUpdatedAt(convertToEpoch(currentDayOfMonth));
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
                setTemp('');
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

                <div className="flex w-full justify-between items-center pb-14">
                    <div className="-ml-6 text-2xl ">New Expense</div>
                    <Link href="/dashboard">
                        <div className="w-8 cursor-pointer text-center rounded-md">

                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="24" height="24" id="pie-chart"><path fill="white" d="M16 32c5.158 0 9.734-2.452 12.66-6.242L16 16V0C7.164 0 0 7.164 0 16s7.164 16 16 16zM14 2.142V16c0 .62.288 1.206.778 1.584l10.964 8.452A13.864 13.864 0 0 1 16 30C8.28 30 2 23.72 2 16 2 8.96 7.224 3.116 14 2.142zM18.75.268v14.31l11.424 8.806A15.83 15.83 0 0 0 32 16C32 8.104 26.272 1.574 18.75.268z"></path></svg>

                        </div>
                    </Link>
                </div>

                {/* <div className="flex flex-col">
                    <label>Oct</label>
                    <input type="text" onChange={(e) => { setTemp(e.target.value); check() }} className='text-white grow bg-transparent border-2 border-[#E3EBFD] rounded-md text-base  font-semibold p-3' placeholder="" value={temp} ></input>
                </div> */}
                {/* for devs */}


                <label className=" mb-2 pt-10  text-sm">What did you spend on?</label>
                <div className="flex h-10">
                    <input type="text" onChange={(e) => { setNote(e.target.value); check() }} className='text-white grow bg-transparent border-2 border-[#E3EBFD] rounded-md text-base  font-semibold p-3' placeholder="" value={note} ></input>
                </div>

                <label className=" mb-2 pt-4  text-sm">Amount</label>
                <div className="flex h-10">
                    <input type="number" onChange={(e) => { setAmount(e.target.value); check() }} className='text-white specialInput grow bg-transparent border-2 border-[#E3EBFD] rounded-md text-base  font-semibold p-3' placeholder="" value={amount} ></input>
                </div>

                <label className=" mb-2 pt-4  text-sm">Need</label>
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
