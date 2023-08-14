'use client';
import useFirebaseAuthentication from "@/hooks/useFirebaseAuthentication";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { auth } from "../googleSignIn/config"
import { signOut } from "firebase/auth";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Image from "next/image";

/**
 * @todo
 * 1. Expense list descending sort
 * 2. Month picker top nav sticky
 * 3. All page navigation
 * 4. Expense add form, amount remove arrows
 * 5. API router put in proper folder names
 * 6. Date wise grouping
 * 7. Logout button
 * 8. Update and delete expense
 * 9. pieChart page error -  Cannot read properties of undefined (reading 'essentials')
 * 10. Check the total percantage to be exactly 100% in budget screen
 * 11. Cannot read properties of undefined (reading 'toLocaleString') // dashboard page
 * 12. pick date
 * 13.input type number css global css find it
 *  */

/**
 * @todo
 * 1. Expense list descending sort
 * 2. Expense add form
 * 4. Date wise grouping
 * */

export default function Home() {

    const authUser = useFirebaseAuthentication();
    const [token, setToken] = useState('');
    const [filteredList, setFilteredList] = useState(null);
    const [filter, setFilter] = useState('All');

    const [startDate, setStartDate] = useState(new Date());

    const [calendar, setCalendar] = useState(null);
    const [showCalendar, setShowCalendar] = useState(false);

    const [spent, setSpent] = useState(0);
    const [essentialsSpent, setEssentialsSpent] = useState(0);
    const [nonessentialsSpent, setNonessentialsSpent] = useState(0);

    const [salary, setSalary] = useState("");
    const [essentialsShare, setEssentialsShare] = useState(0);
    const [savingsShare, setSavingsShare] = useState(0);
    const [nonessentialsShare, setNonessentialsShare] = useState(0);

    const [degA, setDegA] = useState(120);
    const [degB, setDegB] = useState(140);
    const [degC, setDegC] = useState(0);
    const [timer, setTimer] = useState('');
    const [isDropdownOpen, setDropdownOpen] = useState(false);

    setTimeout(() => setTimer(1), 6000)

    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
    };

    const logOut = () => {
        signOut(auth).then(() => {
            // Sign-out successful.
        }).catch((error) => {
            // An error happened.
        });
    }

    function toEditPage(id) {
        window.location.href = `/editExpense/${id}`;
        console.log(id);
        console.log("editpage")
    }

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

    function generateRandomColor() {
        let maxVal = 0xFFFFFF; // 16777215
        let randomNumber = Math.random() * maxVal;
        randomNumber = Math.floor(randomNumber);
        randomNumber = randomNumber.toString(16);
        let randColor = randomNumber.padStart(6, 0);
        return `#${randColor.toUpperCase()}`
    }

    function numToString(value) {
        if (!value) {
            //console.log("Invalid input to numToString function");
            return "0";
        }
        //console.log(value);
        return value.toLocaleString();
    }

    function daysRemainingInMonth() {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        const lastDayOfMonth = new Date(year, month + 1, 0);
        const totalDaysInMonth = lastDayOfMonth.getDate();
        const remainingDays = totalDaysInMonth - today.getDate();

        if (remainingDays === 0) {
            return "Last day of the month!";
        } else if (remainingDays === 1) {
            return "1 day left";
        } else {
            return `${remainingDays} days left`;
        }
    }

    function SimplifyDateFunction(data) {
        const consolidatedObject = data.reduce((result, item) => {
            result[item.need] = item._sum.amount;
            return result;
        }, {});
        return consolidatedObject;
    }

    function firstDayOfMonth(date) {
        const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        setStartDate(firstDayOfMonth);
        //console.log(firstDayOfMonth);
    }

    function getMonthName(monthIndex) {
        const monthNames = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
        return monthNames[monthIndex];
    }


    {
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
            // console.log("result", parsedResult[0]);
            setEssentialsShare(parsedResult[0].essentials), setSavingsShare(parsedResult[0].savings), setNonessentialsShare(parsedResult[0].non_essentials)
            setSalary(parsedResult[0].salary);
        }, [token]);

        const getAmount = useCallback(async () => {
            if (!token) {
                return;
            }
            const response = await fetch(`http://localhost:3000/api/addExpense`, {
                headers: {
                    "authorization": token
                },
                method: "GET",
            });
            const result = await response.json();
            const parsedResult = JSON.parse(result.result);
            //console.log("result getAmount ", parsedResult);
            const amount = SimplifyDateFunction(parsedResult);
            if (amount && amount.Essentials) {
                setEssentialsSpent(amount.Essentials);
            }
            if (amount && amount["Non Essentials"]) {
                setNonessentialsSpent(amount["Non Essentials"]);
            }
            setSpent(nonessentialsSpent + essentialsSpent)
        }, [essentialsSpent, nonessentialsSpent, token]);

        const getList = useCallback(async () => {
            if (!token) {
                return;
            }
            const response = await fetch(`http://localhost:3000/api/dashboard?tag=${filter}&date=${startDate}&singleDate=${calendar}`, {
                headers: {
                    "authorization": token
                },
                method: "GET",
            });
            const result = await response.json();
            const parsedResult = JSON.parse(result.result);
            setFilteredList(parsedResult);
            console.log("FilteredList :", parsedResult);
        }, [calendar, filter, startDate, token]);

        const budgetRatio = useCallback(() => {
            let num = salary.replaceAll(',', '');
            num = parseInt(num);
            if (essentialsShare && nonessentialsShare) {
                if ((parseInteger(essentialsShare) + parseInteger(nonessentialsShare) + parseInteger(savingsShare)) === num) {
                    let deg1 = (360 * (parseInteger(essentialsShare) / num)).toFixed(2);
                    let deg2 = (parseInteger((360 * (parseInteger(nonessentialsShare) / num)).toFixed(2)) + parseInteger(deg1));
                    let deg3 = (360 * (parseInteger(savingsShare) / num)).toFixed(2);
                    setDegA(deg1);
                    setDegB(deg2);
                    setDegC(deg3);
                }
            }
            //console.log(num);
        }, [essentialsShare, nonessentialsShare, salary, savingsShare]);

        useEffect(() => {
            budgetRatio();
        }, [budgetRatio]);

        useEffect(() => {
            if (!authUser) {
                return;
            }
            authUser.getIdToken().then((val) => {
                setToken(val);
            });
            getData();
            getList();
            getAmount();
        }, [authUser, getData, getList, getAmount])
    }// functions

    useEffect(() => {
        firstDayOfMonth(new Date());
    }, [])



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


    if (!salary) {
        return (
            <main className="flex items-center justify-center h-screen">
                <div>
                    <div>Salary is not entered</div>
                    <Link href="/">
                        <button className='py-2 underline w-full text-indigo-700 rounded-md'>&#9664;  Go to salary page   </button>
                    </Link>
                </div>

            </main >
        )
    }


    if (!filteredList.length) {
        return (
            <main className="flex justify-center">
                <div className="flex min-h-screen  flex-col w-full max-w-lg justify-center px-12 pt-4 pb-4" >

                    <div className="topPortion">
                        <div className=" flex flex-row items-end bg-black border-b border-slate-500 sticky py-2 top-0 z-50">
                            <div className="relative inline-block text-black">
                                <button
                                    onClick={() => { toggleDropdown() }}
                                    className=" text-4xl text-white  rounded  focus:outline-none">
                                    ☰
                                </button>
                                {isDropdownOpen && (
                                    <div className="absolute cursor-pointer text-white left-1  right-0 mt-2 border-l border-t border-l-gray-300  rounded-md">
                                        {/* Dropdown content goes here */}
                                        <ul className="">
                                            <Link href="/addExpense">
                                                <li className="hover:bg-gray-100 w-28 hover:text-black py-1 px-1 rounded-md">Add Expense</li>
                                            </Link>
                                            <Link href="/">
                                                <li onClick={logOut} className="hover:bg-gray-100 w-20 hover:text-black py-1 px-1 rounded-md">Logout</li>
                                            </Link>
                                        </ul>
                                    </div>
                                )}
                            </div>
                            <DatePicker className="w-20 z-11 cursor-pointer caret-transparent focus:outline-none h-min text-4xl bg-black"
                                selected={startDate}
                                onChange={(date) => firstDayOfMonth(date)} xl
                                dateFormat=" MMM "
                                showMonthYearPicker
                            />
                            <div className="text-sm pl-2 text-gray-400">{daysRemainingInMonth()}</div>
                        </div>


                        <div className="flex mt-6 justify-center">
                            <div className="w-40 h-40 bg-white z-5 rounded-full whiteRound">
                                <div className="text-black w-40 flex justify-center font-semibold totalAmount">
                                    ₹{numToString(parseInteger(salary))}
                                </div>
                            </div>

                            <div className="piechart"
                                style={{ backgroundImage: `conic-gradient(pink ${degA}deg, blueviolet 0 ${degB}deg, orange 0 ${degC}deg)` }}>
                            </div>
                        </div>


                        <div className="flex justify-around w-full">
                            <div className="flex flex-col align-center text-sm text-center mb-2 text-gray-400"> <span>₹{numToString(spent)}</span>  <span>Spent</span>  </div>
                            <div className="flex flex-col align-center text-sm text-center mb-2 text-cyan-400"><span>₹{numToString(parseInteger(salary) - spent)} </span>  <span>Left</span></div>
                        </div>

                        <div className="flex justify-between w-full pt-10">
                            <div className="flex align-center text-md text-center mb-1"> Essentials</div>
                            <div className="flex align-center  text-sm text-center mb-1 text-gray-400">₹{numToString(parseInteger(essentialsShare) - essentialsSpent)} left </div>
                        </div>

                        <div className=" bg-white rounded-md">
                            <div className={`bg-green-500 h-4 rounded-md`} style={{ width: `${((essentialsSpent / (parseInteger(essentialsShare))) * 100)}%` }}></div>
                        </div>
                        <div>₹{numToString(essentialsSpent)} of ₹{numToString(parseInteger(essentialsShare))}</div>

                        <div className="flex justify-between w-full pt-6">
                            <div className="flex align-center text-md text-center mb-1">Non-Essentials</div>
                            <div className="flex align-center text-sm text-center mb-1 text-gray-400">₹{numToString(parseInteger(nonessentialsShare) - nonessentialsSpent)}  left </div>
                        </div>


                        <div className=" bg-white rounded-md">
                            <div className="bg-yellow-500 h-4  rounded-md" style={{ width: `${((nonessentialsSpent / (parseInteger(nonessentialsShare))) * 100)}%` }}></div>
                        </div>
                        <div>₹{numToString(nonessentialsSpent)} of ₹{numToString(parseInteger(nonessentialsShare))}</div>

                        <div className="mt-8 m-auto w-40 border-b border-b-gray-400"></div>

                    </div>


                    <div className="footer">
                        <div className="flex  justify-between w-full pt-6">
                            <div className=" text-lg mb-2">Transactions </div>

                            <div className="flex" onChange={(e) => { setFilter([e.target.value]) }} >
                                <select className="text-white bg-transparent border-2 cursor-pointer border-gray-500 text-base font-medium grow rounded-md h-8 w-12">
                                    <option className="flex text-white bg-black" value='All' >All</option>
                                    <option className="text-white bg-black" value="Non Essentials" > NE -Non Essentials </option>
                                    <option className="text-white bg-black" value="Essentials" > Es -Essentials</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 w-full mb-4">
                            {!calendar && <><div className="border-2 cursor-pointer rounded-md px-1 border-gray-500 text-sm " onClick={() => { setShowCalendar(true); }}>Pick a date 📅 </div></>}
                            {calendar && calendar.getDate() !== null && (<div className="border-2 cursor-pointer rounded-md px-2 border-gray-500 text-sm "> {calendar.getDate()}, {getMonthName(calendar.getMonth())} 📅</div>)}

                            <button onClick={() => { setCalendar(null) }} className={`flex ${calendar ? "" : 'hidden'} items-center w-auto  rounded-md border border-gray-500  justify-center cursor-pointer`}>
                                <span className="text-white font-normal text-xs">clear date</span>
                            </button>
                        </div>

                        <Calendar className={`rounded-lg mb-4 text-black ${showCalendar ? "" : "hidden"}`} onChange={(e) => { setCalendar(e), setShowCalendar(false) }} value={calendar} />


                        <div className=" h-56 w-full text-red-500 overflow-auto custom-scrollbar">
                            No Transactions done...
                        </div>

                    </div>
                </div>
            </main>

        )
    }

    return (
        <main className="flex justify-center">
            <div className="flex min-h-screen  flex-col w-full max-w-lg justify-center px-12 pt-4 pb-4" >

                <div className="topPortion">
                    <div className=" flex flex-row items-end bg-black border-b border-slate-500 sticky py-2 top-0 z-50">
                        <div className="relative inline-block text-black">
                            <button
                                onClick={() => { toggleDropdown() }}
                                className=" text-4xl text-white  rounded  focus:outline-none">
                                ☰
                            </button>
                            {isDropdownOpen && (
                                <div className="absolute cursor-pointer text-white left-1  right-0 mt-2 border-l border-t border-l-gray-300  rounded-md">
                                    {/* Dropdown content goes here */}
                                    <ul className="">
                                        <Link href="/addExpense">
                                            <li className="hover:bg-gray-100 w-28 hover:text-black py-1 px-1 rounded-md">Add Expense</li>
                                        </Link>
                                        <Link href="/">
                                            <li onClick={logOut} className="hover:bg-gray-100 w-20 hover:text-black py-1 px-1 rounded-md">Logout</li>
                                        </Link>
                                    </ul>
                                </div>
                            )}
                        </div>
                        <DatePicker className="w-20 z-11 cursor-pointer caret-transparent focus:outline-none h-min text-4xl bg-black"
                            selected={startDate}
                            onChange={(date) => firstDayOfMonth(date)} xl
                            dateFormat=" MMM "
                            showMonthYearPicker
                        />
                        <div className="text-sm pl-2 text-gray-400">{daysRemainingInMonth()}</div>
                    </div>


                    <div className="flex mt-6 justify-center">
                        <div className="w-40 h-40 bg-white z-5 rounded-full whiteRound">
                            <div className="text-black w-40 flex justify-center font-semibold totalAmount">
                                ₹{numToString(parseInteger(salary))}
                            </div>
                        </div>

                        <div className="piechart"
                            style={{ backgroundImage: `conic-gradient(pink ${degA}deg, blueviolet 0 ${degB}deg, orange 0 ${degC}deg)` }}>
                        </div>
                    </div>


                    <div className="flex justify-around w-full">
                        <div className="flex flex-col align-center text-sm text-center mb-2 text-gray-400"> <span>₹{numToString(spent)}</span>  <span>Spent</span>  </div>
                        <div className="flex flex-col align-center text-sm text-center mb-2 text-cyan-400"><span>₹{numToString(parseInteger(salary) - spent)} </span>  <span>Left</span></div>
                    </div>

                    <div className="flex justify-between w-full pt-10">
                        <div className="flex align-center text-md text-center mb-1"> Essentials</div>
                        <div className="flex align-center  text-sm text-center mb-1 text-gray-400">₹{numToString(parseInteger(essentialsShare) - essentialsSpent)} left </div>
                    </div>

                    <div className=" bg-white rounded-md">
                        <div className={`bg-green-500 h-4 rounded-md`} style={{ width: `${((essentialsSpent / (parseInteger(essentialsShare))) * 100)}%` }}></div>
                    </div>
                    <div>₹{numToString(essentialsSpent)} of ₹{numToString(parseInteger(essentialsShare))}</div>

                    <div className="flex justify-between w-full pt-6">
                        <div className="flex align-center text-md text-center mb-1">Non-Essentials</div>
                        <div className="flex align-center text-sm text-center mb-1 text-gray-400">₹{numToString(parseInteger(nonessentialsShare) - nonessentialsSpent)}  left </div>
                    </div>


                    <div className=" bg-white rounded-md">
                        <div className="bg-yellow-500 h-4  rounded-md" style={{ width: `${((nonessentialsSpent / (parseInteger(nonessentialsShare))) * 100)}%` }}></div>
                    </div>
                    <div>₹{numToString(nonessentialsSpent)} of ₹{numToString(parseInteger(nonessentialsShare))}</div>

                    <div className="mt-8 m-auto w-40 border-b border-b-gray-400"></div>

                </div>


                <div className="footer">
                    <div className="flex  justify-between w-full pt-6">
                        <div className=" text-lg mb-2">Transactions </div>

                        <div className="flex" onChange={(e) => { setFilter([e.target.value]) }} >
                            <select className="text-white bg-transparent border-2 cursor-pointer border-gray-500 text-base font-medium grow rounded-md h-8 w-12">
                                <option className="flex text-white bg-black" value='All' >All</option>
                                <option className="text-white bg-black" value="Non Essentials" > NE -Non Essentials </option>
                                <option className="text-white bg-black" value="Essentials" > Es -Essentials</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 w-full mb-4">
                        {!calendar && <><div className="border-2 cursor-pointer rounded-md px-1 border-gray-500 text-sm " onClick={() => { setShowCalendar(true); }}>Pick a date 📅 </div></>}
                        {calendar && calendar.getDate() !== null && (<div className="border-2 cursor-pointer rounded-md px-2 border-gray-500 text-sm "> {calendar.getDate()}, {getMonthName(calendar.getMonth())} 📅</div>)}

                        <button onClick={() => { setCalendar(null) }} className={`flex ${calendar ? "" : 'hidden'} items-center w-auto  rounded-md border border-gray-500  justify-center cursor-pointer`}>
                            <span className="text-white font-normal text-xs">clear date</span>
                        </button>
                    </div>

                    <Calendar className={`rounded-lg mb-4 text-black ${showCalendar ? "" : "hidden"}`} onChange={(e) => { setCalendar(e), setShowCalendar(false) }} value={calendar} />

                    <div className="text-sm px-2 mt-2 text-gray-400">Today </div>

                    <div className=" h-56 w-full overflow-auto custom-scrollbar">
                        {filteredList.map((item, i) => {
                            return (
                                <div key={i} className="flex justify-between items-center py-2">
                                    {(item.need == "Essentials") && <div className="text-2xl basis-1/6 rounded mr-10  h-8" style={{ backgroundColor: generateRandomColor() }}></div>}
                                    {(item.need == "Non Essentials") && <div className="text-2xl basis-1/6 rounded mr-10  h-8" style={{ backgroundColor: generateRandomColor() }}></div>}
                                    <div className="basis-4/6">
                                        <div className="text-base" >{item.note}</div>
                                        <div className="text-xs text-gray-400">{item.need} </div>
                                    </div>
                                    <div onClick={() => { toEditPage(item.id) }} className="pr-2 cursor-pointer">🖉</div>
                                    <div className="text-sm text-right basis-2/6">-₹{item.amount}.00</div>
                                </div>
                            )
                        })}
                    </div>

                </div>
            </div>
        </main>

    )
}





















/* <ul className="text-xs flex gap-2">
                       <li className="w-fit border-2 rounded-md px-2 border-gray-500">All</li>
                       <li className="w-fit border-2 rounded-md px-2 border-gray-500">Food</li>
                       <li className="w-fit border-2 rounded-md px-2 border-gray-500">Shopping</li>
                       <li className="w-fit border-2 rounded-md px-2 border-gray-500">Electricity</li>
                   </ul> */

/* <div className="footer">
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
            </div> */