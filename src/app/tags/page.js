"use client"

import { useEffect,useState,useCallback } from "react";


export default function Home() {

    const [note,setNote] = useState(null);
    const [amount,setAmount] = useState(null);
    const [tag, setTag] = useState(null);


    async function postData(data) {
        const response = await fetch("http://localhost:3000/api/tags", {
            method: "POST",
            body: JSON.stringify(data),
        });
        const result = await response.json();
        console.log("Success:", result);
    }

    // const getData = useCallback(async() => {
    //     const response = await fetch(`http://localhost:3000/api/tags`, {
    //         method: "GET",
    //        });
    //    const result = await response.json();
    //    const parsedResult  = JSON.parse(result.result);
    //    setTags(parsedResult);
    //    console.log("salary_resultt",parsedResult );
    // }, []);
    

    // useEffect(()=>{      
    //     getData();
    // },[getData]);

    return (
        <main className="flex flex-col justify-ceter">
            <div className="flex   min-h-screen flex-col max-w-xl  px-6 pt-40 pb-4" >
                <div className=" absolute  top-0 left-0 max-w-xl  text-2xl  pt-20 pl-6">
                    New Expense
                </div>
    
                <div className=" mb-2 pt-10  text-sm">
                What did you spend on?
                </div>

                <div className="flex mb-0 h-10">
                     <input type="text" onChange={(e) => {setNote(e.target.value)}} className='text-white grow bg-transparent border-2 border-[#E3EBFD] rounded-md text-base p-1 font-semibold p-3' placeholder="" value={note} ></input>
                </div>
                <div className=" mb-2 pt-4  text-sm">Amount</div>

                <div className="flex h-10">
                     <input type="text" onChange={(e) => {setAmount(e.target.value)}} className='text-white grow bg-transparent border-2 border-[#E3EBFD] rounded-md text-base p-1 font-semibold p-3' placeholder="" value={amount} ></input>
                </div>
                <div className=" mb-2 pt-4  text-sm">Tag</div>
        
                <div className="flex " onChange={(e) => {setTag(e.target.value)}} >
                    <select className="text-white bg-transparent border-2 border-[#E3EBFD] text-base p-3 font-medium grow rounded-md">
                        <option className="text-white bg-black" value="">--Please choose an option--</option>
                        <option className="text-white bg-black" value="Non Essentials" >Non Essentials</option>
                        <option className="text-white bg-black" value="Essentials" >Essentials</option>
                        <option className="text-white bg-black" value="Savings">Savings</option>
                    </select>
                </div>


                <div className="flex flex-col grow justify-end mb-6" >
                   <button onClick={() => postData({"tag":input })}   className='py-2 bg-indigo-600 justify-end rounded-md'>Add </button>
                </div>
    
            </div> 
        </main>

    )
}
