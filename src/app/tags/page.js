"use client"

import { useEffect,useState,useCallback } from "react";


export default function Home() {

    const [input, setInput] = useState();
    const [tags, setTags] = useState(null);


    async function postData(data) {
        const response = await fetch("http://localhost:3000/api/tags", {
            method: "POST",
            body: JSON.stringify(data),
        });
        const result = await response.json();
        console.log("Success:", result);
    }

    const getData = useCallback(async() => {
        const response = await fetch(`http://localhost:3000/api/tags`, {
            method: "GET",
           });
       const result = await response.json();
       const parsedResult  = JSON.parse(result.result);
       setTags(parsedResult);
       console.log("salary_resultt",parsedResult );
    }, []);
    

    useEffect(()=>{      
        getData();
    },[getData]);

    return (

        <main className="flex flex-col justify-ceter">
            <div className="flex   min-h-screen flex-col max-w-xl  px-6 pt-40 pb-4" >
                <div className=" absolute  top-0 left-0 max-w-xl  text-2xl  pt-6 pl-6">
                    Budgetry
                </div>
    
                <div className=" text-xl font-semibold  mb-2  w-100">
                Create expense tags
                </div>
                <div className=" mb-2 text-sm">
                Tags can be assigned to expenses
                </div>
    
                <div className=" mb-2 pt-10  text-sm">
                Essential Tags
                </div>
    
                <div className="flex mb-8 h-10 justify-between gap-2 ">
                     <input type="text" onChange={(e) => {
                        setInput(e.target.value)
                    }} className='text-white grow bg-transparent border-2 border-[#E3EBFD] rounded-md text-base p-1 font-semibold' placeholder="" value={input} ></input>
                     <button className='font-xl h-10 w-10 border-2 border-[#E3EBFD] rounded-md '>+</button>
                </div>
        
    
                <div className="flex flex-col grow justify-end mb-6" >
                   <button onClick={() => postData({"tag":input })}   className='py-2 bg-indigo-600 justify-end rounded-md'> Next -&gt;  </button>
                </div>
    
            </div> 
        </main>

    )
}
