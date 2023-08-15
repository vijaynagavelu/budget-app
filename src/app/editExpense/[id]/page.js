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
    const [timer, setTimer] = useState('');
    const [error, setError] = useState(false);

    const id = params.id;

    const [isDeleted, setIsDeleted] = useState(false);
    const [isUpdated, setIsUpdated] = useState(false);

    setTimeout(() => setTimer(1), 3000)

    const handleDelete = () => {
        setIsDeleted(true);
    };

    const handleUpdate = () => {
        setIsUpdated(true);
        setTimeout(() => {
            setIsUpdated(false);
        }, 2000);
    }

    const getData = useCallback(async () => {
        if (!token) {
            return;
        }
        const response = await fetch(`http://localhost:3000/api/editExpense?id=${id}&`, {
            headers: {
                "authorization": token
            },
            method: "GET",
        });
        const result = await response.json();
        console.log(result);
        const parsedResult = JSON.parse(result.result);

        if (parsedResult[0] && parsedResult[0].amount) {
            setNote(parsedResult[0].note);
            setAmount(parsedResult[0].amount);
            setNeed(parsedResult[0].need);
        }
    }, [id, token]);

    const updateData = useCallback(async (data) => {
        if (note && amount && need) {
            const response = await fetch(`http://localhost:3000/api/editExpense?id=${id}&`, {
                headers: {
                    "authorization": token
                },
                method: "PUT",
                body: JSON.stringify(data),
            });
            const result = await response.json();
            console.log("Success:", result);
            handleUpdate();
            setError(false)
        } else setError(true);
    }, [amount, id, need, note, token]);

    const check = useCallback(() => {
        if (note && amount && need) {
            setError(false);
        }
    }, [amount, need, note])

    useEffect(() => {
        check()
    }, [check])


    async function deleteData() {
        const response = await fetch(`http://localhost:3000/api/editExpense?id=${id}&`, {
            headers: {
                "authorization": token
            },
            method: "DELETE",
        });
        const result = await response.json();
        console.log("Success:", result);
        handleDelete();
        window.location.href = '/dashboard'
    }



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


    if (!timer) {
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
            <div className="flex min-h-screen flex-col min-w-[45%] px-6 pt-20 pb-4" >

                <div className="flex w-full justify-between pb-14">
                    <div className="-ml-6 text-2xl ">Edit Expense</div>
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
                        onClick={() => deleteData({ "need": need, "note": note, "amount": amount })}
                        className={`transition-colors mb-2 border-2 border-[#E3EBFD] duration-300 ${isDeleted ? 'bg-red-500 text-white' : 'bg-transparent-300 text-transparent-700'
                            } hover:bg-red-600 hover:border-transparent hover:text-white px-4 py-2 rounded-md`}
                    >
                        {isDeleted ? 'Deleted ✘  ' : 'Delete'}
                    </button>

                    <button
                        onClick={() => updateData({ "need": need, "note": note, "amount": amount })}
                        className={`transition-colors mb-6 border-2 border-[#E3EBFD] duration-300 ${isUpdated ? 'bg-green-500 text-white' : 'bg-transparent-300 text-transparent-700'
                            } hover:bg-green-600  hover:border-transparent hover:text-white px-4 py-2 rounded-md`}
                    >
                        {isUpdated ? 'Updated ✔' : 'Update'}
                    </button>
                </div>

            </div>
        </main>

    )
}