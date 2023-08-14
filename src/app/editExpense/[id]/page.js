"use client"

import useFirebaseAuthentication from "@/hooks/useFirebaseAuthentication";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";


export default function Home({ params }) {

    const [note, setNote] = useState('');
    const [amount, setAmount] = useState('');
    const [need, setNeed] = useState('');
    const [token, setToken] = useState('');
    const authUser = useFirebaseAuthentication();
    const id = params.id;


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

    async function updateData(data) {
        if (note && need && amount) {
            const response = await fetch(`http://localhost:3000/api/editExpense?id=${id}&`, {
                headers: {
                    "authorization": token
                },
                method: "PUT",
                body: JSON.stringify(data),
            });
            const result = await response.json();
            console.log("Success:", result);
            setAmount("");
            setNote("");
            setNote("");
        }
    }

    async function deleteData() {
        const response = await fetch(`http://localhost:3000/api/editExpense?id=${id}&`, {
            method: "DELETE",
        });
        const result = await response.json();
        console.log("Success:", result);
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
                    <input type="text" onChange={(e) => { setNote(e.target.value) }} className='text-white grow bg-transparent border-2 border-[#E3EBFD] rounded-md text-base  font-semibold p-3' placeholder="" value={note} ></input>
                </div>

                <div className=" mb-2 pt-4  text-sm">Amount</div>
                <div className="flex h-10">
                    <input type="number" onChange={(e) => { setAmount(e.target.value) }} className='text-white specialInput grow bg-transparent border-2 border-[#E3EBFD] rounded-md text-base  font-semibold p-3' placeholder="" value={amount} ></input>
                </div>

                <div className=" mb-2 pt-4  text-sm">Need</div>
                <div className="flex ">
                    <select onChange={(e) => { setNeed(e.target.value) }} value={need} className="text-white bg-transparent border-2 border-[#E3EBFD] text-base p-3 font-medium grow rounded-md">
                        <option className="text-white bg-black" value="">--Please choose an option--</option>
                        <option className="text-white bg-black" value="Non Essentials" >Non Essentials</option>
                        <option className="text-white bg-black" value="Essentials" >Essentials</option>
                    </select>
                </div>

                <div className="flex flex-col grow justify-end" >
                    <button onClick={() => deleteData({ "need": need, "note": note, "amount": amount })} className='py-2 bg-red-500 justify-end rounded-md mb-4'>Delete </button>
                    <button onClick={() => updateData({ "need": need, "note": note, "amount": amount })} className='py-2 bg-green-600 justify-end rounded-md'>Update </button>
                </div>

            </div>
        </main>

    )
}
