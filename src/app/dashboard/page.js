'use client';
import {useCallback, useEffect, useState} from "react";


export default function Home() {

    const [essentials, setEssentials] = useState(50);
    const [savings, setSavings] = useState(40);
    const [nonessentials, setNonessentials] = useState(10);

    const [essentialsShare, setEssentialsShare] = useState(0);
    const [savingsShare, setSavingsShare] = useState(0);
    const [nonessentialsShare, setNonessentialsShare] = useState(0);

    const [degA, setDegA] = useState(120);
    const [degB, setDegB] = useState(200);
    const [degC, setDegC] = useState(0);
    const [salary, setSalary] = useState("");
    const[value,setValue]= useState('');

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

    const logout=()=>{
        localStorage.clear();
        window.location.href = '/';
    }

    const getData = useCallback(async() => {
        const response = await fetch(`http://localhost:3000/api/expense/${value}`, {
            method: "GET",
           });
       const result = await response.json();
       //console.log(result);
       const parsedResult  = JSON.parse(result.result);
       //console.log("result",parsedResult[0].salary);
       setSalary(parsedResult[0].salary);
    }, [value]); 


    async function updateData(data) {
        const response = await fetch("http://localhost:3000/api/salary", {
            method: "PUT",
            body: JSON.stringify(data),
        });
        const result = await response.json();
        console.log("Success:", result);
    }
    

    const decimal = useCallback((value) => {
        var beforeDecimal = value.split(".").shift();
        var afterDecimal = value.split(".").pop();
        const num = parseInteger(beforeDecimal);
        return(num + "." + afterDecimal);
    }, [])

    const budgetRatio = useCallback(() => {
        let num = salary.replaceAll(',', '');
        num = parseInt(num);
        if ((parseInt(essentials) + parseInt(nonessentials) + parseInt(savings)) === 100 && num) {
            let perA = (num * (essentials / 100)).toFixed(2);
            let perB = (num * (savings / 100)).toFixed(2);
            let perC = (num * (nonessentials / 100)).toFixed(2);

            let deg1 = (360 * (essentials / 100)).toFixed(2);
            let deg2 = (parseInt((360 * (savings / 100)).toFixed(2)) + parseInt(deg1));
            let deg3 = (360 * (nonessentials / 100)).toFixed(2);

            setEssentialsShare(decimal(perA));
            setSavingsShare(decimal(perB));
            setNonessentialsShare(decimal(perC));
            setDegA(deg1);
            setDegB(deg2);
            setDegC(deg3);
        } else {
            setEssentialsShare(0);
            setSavingsShare(0);
            setNonessentialsShare(0);
            console.log("your value is wrongs");
        }
    }, [
        decimal,
        essentials,
        nonessentials,
        salary,
        savings
    ]);

 
    useEffect(() => {
        budgetRatio();
        getData();
        setValue(localStorage.getItem("email"));
    }, [budgetRatio, getData, salary]);

    return (

        <main className="flex justify-center">
            <div className="flex mt-16 min-h-screen min-w-[80%] flex-col max-w-xl justify-center px-6 pt-8 pb-4" >
            <div className=" absolute  top-0 left-0 max-w-xl pt-6 pl-6">
              <div className=" text-4xl mb-2">November </div>  
              <div className="  text-xs">22 days left</div>
            </div>
          
           
            <div className="flex justify-center">
                <div className="w-40 h-40 bg-white z-10 rounded-full whiteRound">
                    <div className="text-black w-40 flex justify-center font-semibold totalAmount">
                        ₹{parseInteger(salary)}
                    </div>
                </div>

                <div className="piechart" 
                style={{ backgroundImage: `conic-gradient(pink ${degA}deg, blueviolet 0 ${degB}deg, orange 0 ${degC}deg)`}}>   
                </div>
            </div>


            <div className="flex justify-around max-w-xl  ">
              <div className="flex flex-col align-center text-sm text-center mb-2 text-gray-400"> <span>₹20,988</span>  <span>Spent</span>  </div>  
              <div className="flex flex-col align-center text-sm text-center mb-2 text-cyan-400"><span>₹34,980 </span>  <span>Left</span></div>
            </div>

            <div className="flex justify-between max-w-xl pt-10">
              <div className="flex align-center text-md text-center mb-1"> Essentials</div>  
              <div className="flex align-center text-sm text-center mb-1 text-gray-400">₹34,980 left </div>
            </div>

            <div className=" bg-white rounded-md">
                <div className="bg-green-500 h-4 w-[55%] rounded-md"></div>
            </div>

            <div className="flex justify-between max-w-xl pt-6">
              <div className="flex align-center text-md text-center mb-1">Non-Essentials</div>  
              <div className="flex align-center text-sm text-center mb-1 text-gray-400">₹₹3,498  left </div>
            </div>

            <div className=" bg-white rounded-md">
                <div className="bg-yellow-500 h-4 w-[55%] rounded-md"></div>
            </div>

            <div className="mt-8 m-auto w-40 border-b border-b-gray-400"></div>

            <div className="flex  justify-between max-w-xl pt-6">
            <div className=" text-lg mb-2">Transactions </div>  
              <div className="flex items-center w-fit gap-2 h-fit border-2 rounded-md px-2 border-gray-500" >
                <div >All</div>
                <div className="h-fit -mt-2 text-md rotate-0">⌄</div>
              </div>
            </div>

            <div className="w-fit border-2 rounded-md px-2 border-gray-500 mb-4 text-sm">Pick a date 📅</div>


            <ul className="text-xs  flex gap-2">
                <li className="w-fit border-2 rounded-md px-2 border-gray-500">All</li>
                <li className="w-fit border-2 rounded-md px-2 border-gray-500">Food</li>    
                <li className="w-fit border-2 rounded-md px-2 border-gray-500">Shopping</li>
                <li className="w-fit border-2 rounded-md px-2 border-gray-500">Electricity</li>    
            </ul>

            <div className="text-sm px-2 mt-2 text-gray-400">Today </div>

            <div className="flex justify-between items-center py-2">
                <div className="text-2xl  ">🍜</div>
                <div className="basis-3/5">
                 <div className="text-base" >Weekend dinner</div>
                 <div className="text-xs text-gray-400">Eat out</div>
                </div>
                <div className="text-sm ">-₹980.00</div>
            </div>
            <div className="flex justify-between items-center py-2">
                <div className="text-2xl  ">👕</div>
                <div className="basis-3/5">
                 <div className="text-base" >Dress for office</div>
                 <div className="text-xs text-gray-400">Shopping </div>
                </div>
                <div className="text-sm ">-₹1950.00</div>
            </div>

            <div className="text-sm px-2 mt-2 text-gray-400">Yesterday</div>

            <div className="flex justify-between items-center py-2">
                <div className="text-2xl">🍅</div>
                <div className="basis-3/5">
                 <div className="text-base" >Veggies for week</div>
                 <div className="text-xs text-gray-400">Food</div>
                </div>
                <div className="text-sm">-₹364.00</div>
            </div>
               
            {/* <button onClick={() => updateData({"email":value,"essentials":essentialsShare ,"savings": savingsShare, "non_essentials": nonessentialsShare})} className='py-2 bg-indigo-600 rounded-md'> Next -&gt;  </button> */}
        </div> 
        </main>

    )
}
