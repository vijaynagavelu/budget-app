"use client"
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import Image from 'next/image';

export default function Home() {

    const [name, setName] = useState();
    const [input, setInput] = useState();
    const[value,setValue]= useState('');
    const [salary, setSalary] = useState("");
    const[timer,setTimer]=useState('');


    setTimeout(() => setTimer(1), 6000)

    // async function response() {
    //     const response = await fetch("http://localhost:3000/api/salary");
    //     const result = await response.json();
    //     console.log("result", result);
    // }

    async function postData(data) {
        const response = await fetch("http://localhost:3000/api/salary", {
            method: "POST",
            body: JSON.stringify(data),
        });
        const result = await response.json();
        console.log("Success:", result);
    }

    // async function resDelete() {
    //     const response = await fetch("http://localhost:3000/api/expense", {
    //         method: "DELETE",
    //     });
    //     const result = await response.json();
    //     console.log("Success:", result);
    // }

    const getData = useCallback(async() => {
        const response = await fetch(`http://localhost:3000/api/expense/${value}`, {
            method: "GET",
           });
       const result = await response.json();
       const parsedResult  = JSON.parse(result.result);
       if(parsedResult && parsedResult[0].salary){
          setSalary(parsedResult[0].salary);       
        }
       console.log("salary_resultt",parsedResult );
    }, [value]);
    

    useEffect(()=>{      
        getData();
        setValue(localStorage.getItem("email"))
    },[getData]);

    function parseInteger(int) {
        console.log(int);
        if (int) {
            let num = int.replaceAll(',', '');
            num = parseInt(num);
            return num.toLocaleString();
        } else {
            return "";
        }
    }

    if(salary){
        window.location.href = '/pieChart';
    }


    if(timer){
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

                
                <input type="text"  onChange={(e) => {
                        setName(e.target.value)
                    }} className='text-black pl-5  text-base p-1 font-semibold w-full' placeholder=" Enter name" value={name}>
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
                        setInput(e.target.value)
                    }} className='text-black  text-base p-1 font-semibold w-full' placeholder="0" value={parseInteger(input)}></input>

                </div>

                <Link href="/pieChart">
                    <button  onClick={() => postData({"email":value ,"name": name, "salary": input})}  className='py-2 bg-indigo-600 w-full rounded-md'> Next -&gt;  </button>
                </Link>
                {/* <button onClick={() => response()} className='py-2 bg-green-600 w-full rounded-md'> get request</button> */}
                {/* <button onClick={() => resDelete()} className='py-2 bg-red-600 w-full rounded-md'> delete request</button> */}
            </div>
        </main >
     )
    }
    
    return(
        <div className='flex justify-center h-full items-center text-center '>
        <Image className="emoji"
            width={100}
            height={100}
            alt="sry"
            src="https://media.tenor.com/UnFx-k_lSckAAAAC/amalie-steiness.gif"/>
    </div>
    )
}
