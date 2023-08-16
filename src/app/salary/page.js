"use client"
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import Image from 'next/image';
import useFirebaseAuthentication from "@/hooks/useFirebaseAuthentication";

export default function Home() {

    const [name, setName] = useState('');
    const [token, setToken] = useState('');
    const [inputSalary, setInputSalary] = useState();
    const [email, setEmail] = useState('');
    const [salary, setSalary] = useState("");
    const [timer, setTimer] = useState('');
    const authUser = useFirebaseAuthentication();


    setTimeout(() => setTimer(1), 6000)

    async function postData(data) {
        const response = await fetch("http://localhost:3000/api/salary", {
            headers: {
                "authorization": token
            },
            method: "POST",
            body: JSON.stringify(data),
        });
        const result = await response.json();
        console.log("Success:", result);
        window.location.href = '/pieChart';
    }


    const getData = useCallback(async () => {
        if (!token) {
            return;
        }
        const response = await fetch(`http://localhost:3000/api/salary`, {
            headers: {
                "authorization": token
            },
            method: "GET",
        });
        const result = await response.json();
        const parsedResult = JSON.parse(result.result);
        console.log("parsedResult", parsedResult[0]);
        if (parsedResult[0] && parsedResult[0].salary) {
            setSalary(parsedResult[0].salary);
        }
        else {
            console.log("No data");
        }
    }, [token]);


    useEffect(() => {
        if (!authUser) {
            return;
        }
        authUser.getIdToken().then((val) => {
            setToken(val);
            setEmail(authUser.email);
            console.log(authUser.email)
            //console.log(val, authUser);
        })
        getData();
    }, [authUser, getData]);

    function parseInteger(int) {
        //console.log(int);
        if (int) {
            let num = int.replaceAll(',', '');
            num = parseInt(num);
            return num.toLocaleString();
        } else {
            return "";
        }
    }

    if (salary) {
        window.location.href = '/pieChart';
    }


    if (timer) {
        return (
            <main className="flex justify-center">

                <div className="flex min-h-screen max-w-xl justify-center  flex-col  p-6">
                    <div className=" absolute  top-0 left-0  text-2xl  pt-6 pl-6">
                        Budgetry
                    </div>
                    <div className=" text-xl font-semibold  mb-2  w-100">
                        Enter your current monthly salary
                    </div>
                    <div className=" mb-12 text-sm">
                        The total income you incur regularly
                    </div>


                    <input type="text" onChange={(e) => {
                        setName(e.target.value)
                    }} className='text-black pl-5  text-base p-1 font-semibold w-full' placeholder=" Enter name" >
                    </input>

                    <br></br>

                    <div className="flex mb-8 ">
                        <select name="currencies " className="text-black border-black text-base p-3 font-medium w-36 " id="cars">
                            <option >INR (₹)</option>
                            <option >€</option>
                            <option>A$</option>
                            <option>MYR</option>
                        </select>

                        <input type="text" onChange={(e) => {
                            setInputSalary(e.target.value)
                        }} className='text-black  text-base p-1 font-semibold w-full' placeholder="0" value={parseInteger(inputSalary)}></input>
                    </div>

                    <button onClick={() => postData({ "email": email, "name": name, "salary": inputSalary })} className='py-2 bg-indigo-600 w-full rounded-md'> Next -&gt;  </button>
                </div>
            </main >
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



    // async function resDelete() {
    //     const response = await fetch("http://localhost:3000/api/expense", {
    //         method: "DELETE",
    //     });
    //     const result = await response.json();
    //     console.log("Success:", result);
    // }