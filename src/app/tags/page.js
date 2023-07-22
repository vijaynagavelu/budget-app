"use client"

import { useEffect,useState,useCallback } from "react";


export default function Home() {

    const [note,setNote] = useState('');
    const [amount,setAmount] = useState('');
    const [tag, setTag] = useState('');
    const [userId,setUserId] = useState('');
    const[value,setValue]= useState('');



    async function postData(data) {
        const response = await fetch("http://localhost:3000/api/tags", {
            method: "POST",
            body: JSON.stringify(data),
        });
        const result = await response.json();
        console.log("Success:", result);
        setAmount("");
        setNote("");
        setNote("");
    }

    const getData = useCallback(async() => {
        const response = await fetch(`http://localhost:3000/api/expense/${value}`, {
            method: "GET",
           });
       const result = await response.json();
       //console.log(result);
       const parsedResult  = JSON.parse(result.result);
       if(parsedResult[0] && parsedResult[0].id){
        //console.log("result",parsedResult[0].id);
       setUserId(parsedResult[0].id);
       }
    }, [value]); 
    

    useEffect(()=>{    
        setValue(localStorage.getItem("email"));  
        getData();
    },[getData]);

    return (
        <main className="flex   justify-center">
            <div className="flex min-h-screen flex-col min-w-[45%]    px-6 pt-40 pb-4" >
                <div className=" absolute  top-0 left-0  text-2xl  pt-20 pl-6">
                    New Expense
                </div>

                <div  className="w-20 cursor-pointer absolute text-center top-0 right-0 pt-20  pr-6 rounded-md">
                x
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
                   <button onClick={() => postData({"tag":tag ,"note": note,"amount":amount, "userId": userId})}   className='py-2 bg-indigo-600 justify-end rounded-md'>Add </button>
                </div>
    
            </div> 
        </main>

    )
}
