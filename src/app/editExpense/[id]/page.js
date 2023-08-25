"use client"

import useFirebaseAuthentication from "@/hooks/useFirebaseAuthentication";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";


export default function Home({ params }) {

    const [note, setNote] = useState('');
    const [amount, setAmount] = useState('');
    const [need, setNeed] = useState('');
    const [token, setToken] = useState('');
    const authUser = useFirebaseAuthentication();
    const [error, setError] = useState(false);
    const [isUpdated, setIsUpdated] = useState(false);
    const id = params.id;


    const getData = useCallback(async () => {
        if (!token) {
            return;
        }
        try {
            const response = await fetch(`/api/editExpense?id=${id}&`, {
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
            const parsedResult = JSON.parse(result.result);
            if (parsedResult[0] && parsedResult[0].amount) {
                const data = parsedResult[0];
                setNote(data.note);
                setAmount(data.amount);
                setNeed(data.need);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }, [id, token]);

    const updateData = useCallback(async (data) => {
        if (!note || !amount || !need || !token) {
            setError(true);
            return;
        }
        try {
            const response = await fetch(`/api/editExpense?id=${id}&`, {
                headers: {
                    "authorization": token,
                    "Content-Type": "application/json"
                },
                method: "PUT",
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                console.error("Error fetching data:", response.status, response.statusText);
                return;
            }
            const result = await response.json();
            console.log("Success:", result);
            setIsUpdated(true);
            setError(false);
            window.location.href = '/dashboard';
        } catch (error) {
            console.error("Error updating data:", error);
            setError(true);
        }
    }, [amount, id, need, note, token]);

    const check = useCallback(() => {
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
        })
    }, [authUser])

    useEffect(() => {
        getData();
    }, [getData])


    if (!note) {
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

    return (
        <main className="flex justify-center">
            <div className="flex min-h-screen flex-col w-full max-w-lg px-10 pt-20 pb-4" >

                <div className="flex w-full justify-between pb-14">
                    <div className="-ml-6 text-2xl ">Edit Expense</div>
                    <Link href="/dashboard">
                        <div className="w-8  border-2 border-gray-200  cursor-pointer  text-center rounded-md"> x</div>
                    </Link>
                </div>

                <label className=" mb-2 pt-10  text-sm">What did you spend on?</label>
                <div className="flex mb-0 h-10">
                    <input type="text" onChange={(e) => { setNote(e.target.value); check() }} className='text-white grow bg-transparent border-2 border-[#E3EBFD] rounded-md text-base  font-semibold p-3' placeholder="" value={note} ></input>
                </div>

                <label className=" mb-2 pt-4  text-sm">Amount</label>
                <div className="flex h-10">
                    <input type="number" onChange={(e) => { setAmount(e.target.value); check() }} className='text-white specialInput grow bg-transparent border-2 border-[#E3EBFD] rounded-md text-base  font-semibold p-3' placeholder="" value={amount} ></input>
                </div>

                <label className=" mb-2 pt-4  text-sm">Need</label>
                <div className="flex ">
                    <select onChange={(e) => { setNeed(e.target.value); check() }} value={need} className="text-white bg-transparent border-2 border-[#E3EBFD] text-base p-3 font-medium grow rounded-md">
                        <option className="text-white bg-black" value="">--Please choose an option--</option>
                        <option className="text-white bg-black" value="Non Essentials" >Non Essentials</option>
                        <option className="text-white bg-black" value="Essentials" >Essentials</option>
                    </select>
                </div>

                {error && <div className="text-red-600 font-bold mb-8">Fill all the values </div>}
                {!error && <div className="text-transparent font-bold mb-8">Fill all the values </div>}

                <div className="flex flex-col grow justify-end" >
                    <button
                        onClick={() => updateData({ "need": need, "note": note, "amount": amount })}
                        className={`transition-colors mb-6 border-2 border-[#E3EBFD] duration-300 ${isUpdated ? 'bg-green-500 text-white' : 'bg-transparent-300 text-transparent-700'
                            } hover:border-green-600   hover:text-white px-4 py-2 rounded-md`}
                    >
                        {isUpdated ? 'Updated ✔' : 'Update'}
                    </button>
                </div>

            </div>
        </main>

    )
}
