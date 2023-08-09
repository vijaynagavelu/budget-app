'use client';
import useFirebaseAuthentication from "@/hooks/useFirebaseAuthentication";
import { useCallback, useEffect, useState } from "react";


export default function Home() {

    const authUser = useFirebaseAuthentication();
    const [token, setToken] = useState('');
    const [authUserID, setAuthUserId] = useState('');
    const [list, setList] = useState(null);
    const [level, setLevel] = useState(20);

    const [spent, setSpent] = useState('');
    const [essentialsSpent, setEssentialsSpent] = useState('');
    const [nonessentialsSpent, setNonessentialsSpent] = useState('');

    const [essentialsShare, setEssentialsShare] = useState(0);
    const [savingsShare, setSavingsShare] = useState(0);
    const [nonessentialsShare, setNonessentialsShare] = useState(0);

    const [degA, setDegA] = useState(120);
    const [degB, setDegB] = useState(140);
    const [degC, setDegC] = useState(0);
    const [salary, setSalary] = useState("");

    function parseInteger(int) {
        //console.log(int);
        if (int) {
            let num = int.replaceAll(',', '');
            num = parseInt(num);
            return num;
            // return num.toLocaleString();
        } else {
            return "";
        }
    }

    const numToString = useCallback((value) => {
        // var beforeDecimal = value.split(".").shift();
        // const num = parseInteger(value);
        return value.toLocaleString();
    }, [])


    const getData = useCallback(async () => {
        if (!authUserID) {
            return;
        }
        const response = await fetch(`http://localhost:3000/api/expense/${authUserID}`, {
            headers: {
                "authorization": token
            },
            method: "GET",
        });
        const result = await response.json();
        const parsedResult = JSON.parse(result.result);
        // console.log("result", parsedResult[0]);
        setEssentialsShare(parsedResult[0].essentials)
        setSavingsShare(parsedResult[0].savings)
        setNonessentialsShare(parsedResult[0].non_essentials)
        setSalary(parsedResult[0].salary);
    }, [authUserID, token]);

    const getList = useCallback(async () => {
        if (!authUserID) {
            return;
        }
        const response = await fetch(`http://localhost:3000/api/dashboard/${authUserID}`, {
            headers: {
                "authorization": token
            },
            method: "GET",
        });
        const result = await response.json();
        const parsedResult = JSON.parse(result.result);
        setList(parsedResult);
        console.log("result ", parsedResult);
    }, [authUserID, token]);

    const budgetRatio = useCallback(() => {
        let num = salary.replaceAll(',', '');
        num = parseInt(num);
        //console.log(num);
        if ((parseInteger(essentialsShare) + parseInteger(nonessentialsShare) + parseInteger(savingsShare)) === num) {
            let deg1 = (360 * (parseInteger(essentialsShare) / num)).toFixed(2);
            let deg2 = (parseInteger((360 * (parseInteger(nonessentialsShare) / num)).toFixed(2)) + parseInteger(deg1));
            let deg3 = (360 * (parseInteger(savingsShare) / num)).toFixed(2);
            setDegA(deg1);
            setDegB(deg2);
            setDegC(deg3);
        }
    }, [essentialsShare, nonessentialsShare, salary, savingsShare]);

    const spentAmount = useCallback(async () => {
        if (!list) {
            return;
        }
        const spent = list.reduce((total, item) => {
            return parseInteger(item.amount) + total;
        }, 0)
        setSpent(spent);
        return spent;
    }, [list]);

    const spentOnEssentials = useCallback(async () => {
        if (!list) {
            return;
        }
        const spent = list.reduce((total, item) => {
            if (item.need == "Essentials") {
                return parseInteger(item.amount) + total;
            } else return 0 + total;
        }, 0)
        setEssentialsSpent(spent)
        return spent;
    }, [list]);

    const spentOnNonEssentials = useCallback(async () => {
        if (!list) {
            return;
        }
        const spent = list.reduce((total, item) => {
            if (item.need == "Non Essentials") {
                return parseInteger(item.amount) + total;
            } else return 0 + total;
        }, 0)
        setNonessentialsSpent(spent)
        return spent;
    }, [list]);

    useEffect(() => {
        budgetRatio();
    }, [budgetRatio]);

    useEffect(() => {
        spentAmount();
        spentOnNonEssentials();
        spentOnEssentials();
    }, [spentAmount, spentOnEssentials, spentOnNonEssentials]);


    useEffect(() => {
        if (!authUser) {
            return;
        }
        authUser.getIdToken().then((val) => {
            setToken(val);
            setAuthUserId(authUser.uid)
        });
        getData();
        getList();
    }, [authUser, getData, getList,])


    return (
        <main className="flex justify-center">
            <div className="flex mt-16 min-h-screen min-w-[80%] flex-col max-w-xl justify-center px-6 pt-8 pb-4" >
                <div className=" absolute  top-0 left-0 max-w-xl pt-6 pl-6">
                    <div className=" text-4xl mb-2"> ☰ November </div>
                    <div className="  text-xs">22 days left</div>
                </div>


                <div className="flex justify-center">
                    <div className="w-40 h-40 bg-white z-10 rounded-full whiteRound">
                        <div className="text-black w-40 flex justify-center font-semibold totalAmount">
                            ₹{numToString(salary)}
                        </div>
                    </div>

                    <div className="piechart"
                        style={{ backgroundImage: `conic-gradient(pink ${degA}deg, blueviolet 0 ${degB}deg, orange 0 ${degC}deg)` }}>
                    </div>
                </div>


                <div className="flex justify-around max-w-xl  ">
                    <div className="flex flex-col align-center text-sm text-center mb-2 text-gray-400"> <span>₹{numToString(spent)}</span>  <span>Spent</span>  </div>
                    <div className="flex flex-col align-center text-sm text-center mb-2 text-cyan-400"><span>₹{numToString(parseInteger(salary) - spent)} </span>  <span>Left</span></div>
                </div>

                <div className="flex justify-between max-w-xl pt-10">
                    <div className="flex align-center text-md text-center mb-1"> Essentials</div>
                    <div className="flex align-center text-sm text-center mb-1 text-gray-400">₹{numToString(parseInteger(essentialsShare) - essentialsSpent)} left </div>
                </div>

                <div className=" bg-white rounded-md">
                    <div className={`bg-green-500 h-4 rounded-md`} style={{ width: `${((essentialsSpent / (parseInteger(essentialsShare))) * 100)}%` }}></div>
                </div>
                <div>₹{numToString(essentialsSpent)} of ₹{numToString(parseInteger(essentialsShare))}</div>

                <div className="flex justify-between max-w-xl pt-6">
                    <div className="flex align-center text-md text-center mb-1">Non-Essentials</div>
                    <div className="flex align-center text-sm text-center mb-1 text-gray-400">₹{numToString(parseInteger(nonessentialsShare) - nonessentialsSpent)}  left </div>
                </div>


                <div className=" bg-white rounded-md">
                    <div className="bg-yellow-500 h-4  rounded-md" style={{ width: `${((nonessentialsSpent / (parseInteger(nonessentialsShare))) * 100)}%` }}></div>
                </div>
                <div>₹{numToString(nonessentialsSpent)} of ₹{numToString(parseInteger(nonessentialsShare))}</div>


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
