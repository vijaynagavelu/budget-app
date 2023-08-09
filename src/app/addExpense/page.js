"use client"

import useFirebaseAuthentication from "@/hooks/useFirebaseAuthentication";
import Link from "next/link";
import { useEffect, useState } from "react";


export default function Home() {

    const [note, setNote] = useState('');
    const [amount, setAmount] = useState('');
    const [need, setNeed] = useState('');
    const [userId, setUserId] = useState('');
    const [token, setToken] = useState('');
    const authUser = useFirebaseAuthentication();



    async function postData(data) {
        const response = await fetch("http://localhost:3000/api/tags", {
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
    }


    useEffect(() => {
        if (!authUser) {
            return;
        }
        authUser.getIdToken().then((val) => {
            setToken(val);
            setUserId(authUser.uid);
        })
    }, [authUser])



    return (
        <main className="flex   justify-center">
            <div className="flex min-h-screen flex-col min-w-[45%] px-6 pt-20 pb-4" >

                <div className="flex w-full justify-between pb-14">
                    <div className="-ml-6 text-2xl ">New Expense</div>
                    <Link href="/dashboard">
                        <div className="w-8  border-2 border-gray-200  cursor-pointer  text-center rounded-md"> x</div>
                    </Link>
                </div>

                <div className=" mb-2 pt-10  text-sm">What did you spend on?</div>
                <div className="flex mb-0 h-10">
                    <input type="text" onChange={(e) => { setNote(e.target.value) }} className='text-white grow bg-transparent border-2 border-[#E3EBFD] rounded-md text-base p-1 font-semibold p-3' placeholder="" value={note} ></input>
                </div>

                <div className=" mb-2 pt-4  text-sm">Amount</div>
                <div className="flex h-10">
                    <input type="text" onChange={(e) => { setAmount(e.target.value) }} className='text-white grow bg-transparent border-2 border-[#E3EBFD] rounded-md text-base p-1 font-semibold p-3' placeholder="" value={amount} ></input>
                </div>

                <div className=" mb-2 pt-4  text-sm">Need</div>
                <div className="flex " onChange={(e) => { setNeed(e.target.value) }} >
                    <select className="text-white bg-transparent border-2 border-[#E3EBFD] text-base p-3 font-medium grow rounded-md">
                        <option className="text-white bg-black" value="">--Please choose an option--</option>
                        <option className="text-white bg-black" value="Non Essentials" >Non Essentials</option>
                        <option className="text-white bg-black" value="Essentials" >Essentials</option>
                    </select>
                </div>


                <div className="flex flex-col grow justify-end mb-6" >
                    <button onClick={() => postData({ "need": need, "note": note, "amount": amount, "userId": userId })} className='py-2 bg-indigo-600 justify-end rounded-md'>Add </button>
                </div>

            </div>
        </main>

    )
}
