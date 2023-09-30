'use client';
import useFirebaseAuthentication from "@/hooks/useFirebaseAuthentication";
import Link from "next/link";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { auth } from "../googleSignIn/config"
import { signOut } from "firebase/auth";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";


export default function Home() {

    const authUser = useFirebaseAuthentication();
    const [token, setToken] = useState('');
    const [filteredList, setFilteredList] = useState(null);
    const [filter, setFilter] = useState('All');

    const [startDate, setStartDate] = useState(new Date());
    const [calendar, setCalendar] = useState(null);
    const [showCalendar, setShowCalendar] = useState(false);
    const [minDate, setMinDate] = useState('');
    const [maxDate, setMaxDate] = useState('');
    const [initialDisplayDate, setInitialDisplayDate] = useState('');

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
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);
    const [isUpdated, setIsUpdated] = useState(false);
    const [effect, setEffect] = useState(true);


    const handleDelete = (id) => {
        setIsDeleted(id);
        setTimeout(() => {
            setIsDeleted(false);
        }, 2000);
    };

    const logOut = () => {
        signOut(auth).then(() => {
            // Sign-out successful.
        }).catch((error) => {
            // An error happened.
        });
    }

    function parseInteger(int) {
        if (int) {
            let num = parseInt(int.replaceAll(',', ''));
            return num;
        } else {
            return "";
        }
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
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();

        if (startDate.getMonth() !== currentMonth || startDate.getFullYear() !== currentYear) {
            return '';
        }
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

    function SimplifyFetchedResult(data) {
        const consolidatedObject = data.reduce((result, item) => {
            result[item.need] = item._sum.amount;
            return result;
        }, {});
        return consolidatedObject;
    }

    function firstDayOfMonth(date) {
        const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        setStartDate(firstDayOfMonth);

        const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        setMinDate(startOfMonth);
        const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        setMaxDate(endOfMonth);
        const initialDisplayDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        setInitialDisplayDate(initialDisplayDate);
    }

    function getMonthName(monthIndex) {
        const monthNames = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
        return monthNames[monthIndex];
    }

    const getList = useCallback(async () => {
        if (!token) {
            return;
        }
        setEffect(false);
        try {
            const response = await fetch(`/api/dashboard?tag=${filter}&date=${startDate}&singleDate=${calendar}`, {
                headers: {
                    "authorization": token,
                    "Content-Type": "application/json"
                },
                method: "GET",
            });
            if (!response.ok) {
                console.error("Error fetching data:", response.status, response.statusText);
                return;
            }
            const result = await response.json();
            const parsedResult = JSON.parse(result.result);
            const reversedList = parsedResult.reverse();
            setEffect(true);
            setFilteredList(reversedList);
            //console.log("FilteredList:", reversedList);
        } catch (error) {
            console.error("Error fetching or processing data:", error);
        }
    }, [calendar, filter, startDate, token]);

    const getAmount = useCallback(async () => {
        if (!token) {
            return;
        }
        try {
            const response = await fetch(`/api/addExpense?date=${startDate}&`, {
                headers: {
                    "authorization": token,
                    "Content-Type": "application/json"
                },
                method: "GET",
            });
            if (!response.ok) {
                console.error("Error fetching data:", response.status, response.statusText);
                return;
            }
            const result = await response.json();
            const parsedResult = JSON.parse(result.result);

            const amount = SimplifyFetchedResult(parsedResult);
            const essentialsSpent = amount?.Essentials || 0;
            const nonessentialsSpent = amount?.["Non Essentials"] || 0;
            setEssentialsSpent(essentialsSpent);
            setNonessentialsSpent(nonessentialsSpent);
            setSpent(essentialsSpent + nonessentialsSpent);
        } catch (error) {
            console.error('Error fetching or processing data:', error);
        }
    }, [startDate, token]);

    const deleteData = useCallback(async (id) => {
        if (!token) {
            return;
        }
        handleDelete(id);
        try {
            const response = await fetch(`/api/editExpense?id=${id}&`, {
                headers: {
                    "authorization": token,
                    "Content-Type": "application/json"
                },
                method: "DELETE",
            });
            if (!response.ok) {
                console.error("Error fetching data:", response.status, response.statusText);
                return;
            }
            const result = await response.json();
            console.log("Success:", result);
            getList();
            getAmount()
        } catch (error) {
            console.error("Error deleting data:", error);
        }
    }, [getList, getAmount, token]);

    const getData = useCallback(async () => {
        if (!token) {
            return;
        }
        try {
            const response = await fetch(`/api/salary`, {
                headers: {
                    "authorization": token,
                    "Content-Type": "application/json"
                },
                method: "GET",
            });
            if (!response.ok) {
                console.error("Error fetching data:", response.status, response.statusText);
                return;
            }
            const result = await response.json();
            const parsedResult = JSON.parse(result.result);

            if (!parsedResult || !Array.isArray(parsedResult) || parsedResult.length === 0) {
                console.error("Error fetching data:", response.status, response.statusText);
                return;
            }
            //console.log(parsedResult)
            const data = parsedResult[0];
            setEssentialsShare(data.essentials);
            setSavingsShare(data.savings);
            setNonessentialsShare(data.non_essentials);
            setSalary(data.salary);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }, [token]);

    const budgetRatio = useCallback(() => {
        let num = parseInt(salary.includes(",") ? salary.replaceAll(',', '') : salary);
        num = parseInt(num);
        if (essentialsShare && nonessentialsShare) {
            if ((parseInteger(essentialsShare) + parseInteger(nonessentialsShare) + parseInteger(savingsShare)) === num) {
                const deg1 = (360 * (parseInteger(essentialsShare) / num)).toFixed(2);
                const deg2 = (parseInteger((360 * (parseInteger(nonessentialsShare) / num)).toFixed(2)) + parseInteger(deg1));
                const deg3 = (360 * (parseInteger(savingsShare) / num)).toFixed(2);
                setDegA(deg1);
                setDegB(deg2);
                setDegC(deg3);
            }
        }
    }, [essentialsShare, nonessentialsShare, salary, savingsShare]);

    useEffect(() => {
        budgetRatio();
    }, [budgetRatio]);

    useEffect(() => {
        if (!authUser) {
            if (authUser === false) {
                window.location.href = '/';
            }
            return;
        }
        authUser.getIdToken().then((val) => {
            setToken(val);
        });
        getList();
    }, [authUser, getList])

    useEffect(() => {
        firstDayOfMonth(new Date());
    }, [])

    useEffect(() => {
        getData();
    }, [getData])

    useEffect(() => {
        getAmount();
    }, [getAmount])


    const ChildComponent = React.memo(({ filteredList, deleteData }) => {

        if (!filteredList.length) {
            return (
                <div className=" w-full h-72 text-red-500 ">
                    No Transactions done....
                </div>
            )
        }

        function convertToHumanReadable(time) {
            const timestamp = parseInt(time, 10) * 1000;
            const date = new Date(timestamp);
            const formattedDate = date.toLocaleDateString();
            //console.log(date, formattedDate);
            return formattedDate;
        }

        const transactionsByDate = filteredList.reduce((acc, transaction) => {
            const now = convertToHumanReadable(transaction.updatedAt);
            //console.log(now);
            const date = now;
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(transaction);
            return acc;
        }, {});

        function formatDate(date) {
            const options = { month: 'short' };
            const stringedDate = new Date(date).toLocaleDateString('en-US', options);
            const options1 = { day: 'numeric' };
            const stringedDate1 = new Date(date).toLocaleDateString('en-US', options1);
            return stringedDate.toString() + ' - ' + stringedDate1.toString();
        }

        function getHeaderText(date) {
            const currentDate = new Date();
            const yesterday = new Date(currentDate);
            yesterday.setDate(currentDate.getDate() - 1);

            const parsedDate = new Date(date);
            if (parsedDate.toDateString() === currentDate.toDateString()) {
                return 'Today';
            } else if (parsedDate.toDateString() === yesterday.toDateString()) {
                return 'Yesterday';
            } else {
                console.log(typeof (formatDate(date)))
                return formatDate(date);
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

        const handleUpdate = (id) => {
            setIsUpdated(id);
        }


        return (
            <div className="pb-10">
                {
                    Object.entries(transactionsByDate).map(([date, transactions]) => {
                        const headerText = getHeaderText(date);
                        return (
                            <div key={date} className="date-group ">
                                <div className="text-sm  mt-2 text-gray-400">{headerText} </div>
                                {transactions.map((transaction, index) => (
                                    <div key={index} className="flex justify-between items-center py-2">
                                        <div className="text-2xl w-10 rounded mr-4 h-8" style={{ backgroundColor: generateRandomColor() }}></div>
                                        <div className="basis-4/6">
                                            <div className="text-base" >{transaction.note}</div>
                                            <div className="text-xs text-gray-400">{transaction.need} </div>
                                        </div>

                                        <div className="text-sm text-right mr-2 basis-2/6">-₹{transaction.amount}</div>

                                        <div onClick={() => { (window.location.href = `/editExpense/${transaction.id}`), handleUpdate(transaction.id) }} className={` mx-4 rounded-md cursor-pointer border-2 border-transparent duration-300 hover:border-green-600 ${isUpdated === transaction.id ? 'bg-green-500 ' : 'bg-transparent-300'}`}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="22" viewBox="0 0 24 24" id="edit"><g data-name="Layer 2"><path fill="white" d="M19 20H5a1 1 0 0 0 0 2h14a1 1 0 0 0 0-2zM5 18h.09l4.17-.38a2 2 0 0 0 1.21-.57l9-9a1.92 1.92 0 0 0-.07-2.71L16.66 2.6A2 2 0 0 0 14 2.53l-9 9a2 2 0 0 0-.57 1.21L4 16.91a1 1 0 0 0 .29.8A1 1 0 0 0 5 18zM15.27 4 18 6.73l-2 1.95L13.32 6zm-8.9 8.91L12 7.32l2.7 2.7-5.6 5.6-3 .28z" data-name="edit-2"></path></g></svg>
                                        </div>

                                        <div onClick={() => deleteData(transaction.id)} className={`rounded-md cursor-pointer border-2 border-transparent duration-300 hover:border-red-600 ${isDeleted === transaction.id ? 'bg-red-500 ' : 'bg-transparent-300 '} `}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="22" viewBox="0 0 32 32" id="delete"><path fill="white" d="M24.2,12.193,23.8,24.3a3.988,3.988,0,0,1-4,3.857H12.2a3.988,3.988,0,0,1-4-3.853L7.8,12.193a1,1,0,0,1,2-.066l.4,12.11a2,2,0,0,0,2,1.923h7.6a2,2,0,0,0,2-1.927l.4-12.106a1,1,0,0,1,2,.066Zm1.323-4.029a1,1,0,0,1-1,1H7.478a1,1,0,0,1,0-2h3.1a1.276,1.276,0,0,0,1.273-1.148,2.991,2.991,0,0,1,2.984-2.694h2.33a2.991,2.991,0,0,1,2.984,2.694,1.276,1.276,0,0,0,1.273,1.148h3.1A1,1,0,0,1,25.522,8.164Zm-11.936-1h4.828a3.3,3.3,0,0,1-.255-.944,1,1,0,0,0-.994-.9h-2.33a1,1,0,0,0-.994.9A3.3,3.3,0,0,1,13.586,7.164Zm1.007,15.151V13.8a1,1,0,0,0-2,0v8.519a1,1,0,0,0,2,0Zm4.814,0V13.8a1,1,0,0,0-2,0v8.519a1,1,0,0,0,2,0Z"></path></svg>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                    })
                }
            </div>

        )
    });

    const memoizedChildComponent = useMemo(() => (
        <ChildComponent
            filteredList={filteredList}
            deleteData={deleteData}
        />
    ), [filteredList, deleteData]);
    ChildComponent.displayName = 'ChildComponent'


    if (!filteredList) {
        return (
            <main className="flex justify-center">
                <div className="flex min-h-screen  flex-col w-full max-w-lg justify-center px-12 pt-4 pb-4" >

                    <div className="absolute w-full h-full top-0 left-0 z-40 backdrop-blur-[3px] bg-white-100"></div>

                    <div className="topPortion">
                        <div className=" flex flex-row items-end bg-black border-b border-slate-500  py-2  z-10">
                            <div className="relative inline-block text-black">
                                <button
                                    onClick={() => { setDropdownOpen(!isDropdownOpen) }}
                                    className=" text-4xl text-white  rounded  focus:outline-none">
                                    ☰
                                </button>
                                {isDropdownOpen && (
                                    <div className="absolute cursor-pointer text-white left-1  right-0 mt-2 border-l border-t border-l-gray-300  rounded-md">
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
                            <DatePicker className="w-20 z-1 cursor-pointer caret-transparent focus:outline-none h-min text-4xl bg-black"
                                selected={startDate}
                                onChange={(date) => firstDayOfMonth(date)}
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
                            <div className="bg-green-500 h-4  rounded-md" style={{ width: `${(((essentialsSpent / (parseInteger(essentialsShare))) * 100) > 100 ? 100 : (essentialsSpent / (parseInteger(essentialsShare)) * 100))}%` }}></div>
                        </div>
                        <div>₹{numToString(essentialsSpent)} of ₹{numToString(parseInteger(essentialsShare))}</div>

                        <div className="flex justify-between w-full pt-6">
                            <div className="flex align-center text-md text-center mb-1">Non-Essentials</div>
                            <div className="flex align-center text-sm text-center mb-1 text-gray-400">₹{numToString(parseInteger(nonessentialsShare) - nonessentialsSpent)}  left </div>
                        </div>


                        <div className=" bg-white rounded-md">
                            <div className="bg-yellow-500 h-4  rounded-md" style={{ width: `${(((nonessentialsSpent / (parseInteger(nonessentialsShare)) * 100) > 100) ? 100 : (nonessentialsSpent / (parseInteger(nonessentialsShare)) * 100))}%` }}></div>
                        </div>
                        <div>₹{numToString(nonessentialsSpent)} of ₹{numToString(parseInteger(nonessentialsShare))}</div>

                        <div className=" mt-8 m-auto w-40 border-b border-b-gray-400"></div>

                    </div>

                    <div className="footer h-46">
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
                            <div className="border-2 cursor-pointer rounded-md px-1 border-gray-500 text-sm " onClick={() => { setShowCalendar(true); }}>Pick a date 📅 </div>

                            <button onClick={() => { setCalendar(null) }} className={`flex ${calendar ? "" : 'hidden'} items-center w-auto  rounded-md border border-gray-500  justify-center cursor-pointer`}>
                                <span className="text-white font-normal text-xs">clear date</span>
                            </button>
                        </div>
                        <div className=" sticky -mt-6  flex justify-end right-0 bottom-4">
                            <button onClick={() => { window.location.href = `/addExpense/` }} className="bg-blue-500  text-4xl hover:bg-blue-600  text-white pb-2 px-3 rounded-full ">
                                +
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        )
    }

    //console.log("render")
    return (
        <main className="flex justify-center ">
            <div className="flex min-h-screen  flex-col w-full max-w-lg justify-center px-12 pt-4 pb-4" >

                <nav className=" flex flex-row items-end bg-black border-b border-slate-500 sticky top-0  py-2  z-[53]">
                    <div className="relative inline-block text-black">
                        <button
                            onClick={() => { setDropdownOpen(!isDropdownOpen) }}
                            className=" text-4xl text-white -ml-1 focus:outline-none" >
                            ☰
                        </button>
                        {isDropdownOpen && (
                            <div className="absolute cursor-pointer text-white left-1  -ml-1 mt-2  ">
                                <ul className="">
                                    <Link href="/addExpense">
                                        <li className="bg-gray-100 w-28 text-black py-1 px-1 border-2 border-b-zinc-500 rounded-tr-md">Add Expense</li>
                                    </Link>
                                    <Link href="/">
                                        <li onClick={logOut} className="bg-gray-100 w-28 text-black py-1 px-1 rounded-b-md">Logout</li>
                                    </Link>
                                </ul>
                            </div>
                        )}
                    </div>
                    <DatePicker className="w-20 z-11 cursor-pointer caret-transparent focus:outline-none h-min text-4xl bg-black"
                        selected={startDate}
                        onChange={(date) => firstDayOfMonth(date)}
                        dateFormat=" MMM "
                        showMonthYearPicker
                    />
                    <div className="text-sm pl-2 text-gray-400">{daysRemainingInMonth()}</div>
                </nav>

                <div className="topPortion ">
                    <div className="flex mt-6 justify-center">
                        <div className="w-40 h-40 bg-white rounded-full whiteRound">
                            <div className="text-black w-40 flex justify-center font-semibold totalAmount">
                                ₹{numToString(parseInteger(salary))}
                            </div>
                        </div>

                        <div className="piechart "
                            style={{ backgroundImage: `conic-gradient(pink ${degA}deg, blueviolet 0 ${degB}deg, orange 0 ${degC}deg)` }}>
                        </div>
                    </div>

                    <div className="flex justify-around w-full">
                        <div className="flex flex-col align-center text-sm text-center mb-2 text-gray-400"> <span>₹{numToString(spent)}</span>  <span>Spent</span>  </div>
                        <div className="flex flex-col align-center text-sm text-center mb-2 text-cyan-400"><span>₹{numToString(parseInteger(salary) - spent)} </span>  <span>Left</span></div>
                    </div>



                    <div className="flex justify-between w-full pt-10">
                        <div className="flex align-center text-md text-center mb-1"> Essentials</div>
                        <div className="flex align-center  text-sm text-center mb-1 text-gray-400">₹{numToString(parseInteger(essentialsShare) - essentialsSpent)} {(parseInteger(essentialsShare) < essentialsSpent ? 'exceeded' : 'left')} </div>
                    </div>

                    <div className=" bg-white rounded-md">
                        <div className="bg-green-500 h-4  rounded-md" style={{ width: `${(((essentialsSpent / (parseInteger(essentialsShare))) * 100) > 100 ? 100 : (essentialsSpent / (parseInteger(essentialsShare)) * 100))}%` }}></div>
                    </div>
                    <div>₹{numToString(essentialsSpent)} of ₹{numToString(parseInteger(essentialsShare))}</div>


                    <div className="flex justify-between w-full pt-6">
                        <div className="flex align-center text-md text-center mb-1">Non-Essentials</div>
                        <div className="flex align-center text-sm text-center mb-1 text-gray-400">₹{numToString(parseInteger(nonessentialsShare) - nonessentialsSpent)}   {(parseInteger(nonessentialsShare) < nonessentialsSpent ? 'exceeded' : 'left')} </div>
                    </div>

                    <div className=" bg-white rounded-md">
                        <div className="bg-yellow-500 h-4  rounded-md" style={{ width: `${(((nonessentialsSpent / (parseInteger(nonessentialsShare)) * 100) > 100) ? 100 : (nonessentialsSpent / (parseInteger(nonessentialsShare)) * 100))}%` }}></div>
                    </div>
                    <div>₹{numToString(nonessentialsSpent)} of ₹{numToString(parseInteger(nonessentialsShare))}</div>


                    <div className="mt-8 m-auto w-40 border-b border-b-gray-400"></div>

                </div>


                <div className="footer">
                    <div className="flex  justify-between w-full pt-6 sticky top-10 bg-black">
                        <div className=" text-lg mb-2">Transactions </div>

                        <div className="flex" onChange={(e) => { setFilter([e.target.value]) }} >
                            <select className="text-white bg-transparent border-2 cursor-pointer border-gray-500 text-base font-medium grow rounded-md h-8 w-12">
                                <option className="flex text-white bg-black" value='All' >All</option>
                                <option className="text-white bg-black" value="Non Essentials" > NE -Non Essentials </option>
                                <option className="text-white bg-black" value="Essentials" > Es -Essentials</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 w-72 mb-4  sticky pb-2 top-[100px] z-[52]  bg-black">
                        <div className={`flex items-center gap-2 h-8 `}>
                            {!calendar && <><div className=" border-2 cursor-pointer rounded-md px-1 border-gray-500 text-sm " onClick={() => { setShowCalendar(!showCalendar) }}>Pick a date 📅 </div></>}
                            {calendar && calendar.getDate() !== null && (<div className="border-2 cursor-pointer rounded-md px-2 border-gray-500 text-sm " onClick={() => { setShowCalendar(!showCalendar); }} > {calendar.getDate()}, {getMonthName(calendar.getMonth())} 📅</div>)}

                            <button onClick={() => { setCalendar(null), setShowCalendar(false) }} className={`flex ${calendar ? "" : 'hidden'} items-center w-auto  rounded-md border border-gray-500  justify-center cursor-pointer`}>
                                <span className="text-white font-normal text-xs">clear date</span>
                            </button>
                        </div>

                        <Calendar
                            value={calendar}
                            activeStartDate={initialDisplayDate ? initialDisplayDate : null}
                            tileDisabled={({ date }) => date < startDate || date > maxDate}
                            minDate={minDate} maxDate={maxDate} className={`rounded-lg text-black ${showCalendar ? "" : "hidden"}`} onChange={(e) => { setCalendar(e), setShowCalendar(false) }}
                        />
                    </div>

                    <div className={` ${!effect ? '' : 'hidden'}`} >
                        <div className={`animate-pulse ${!effect ? '' : 'hidden'}`}>
                            <div className="px-2 mt-4 rounded mb-2 h-4 w-14 bg-slate-700"></div>
                            <div className="flex justify-between items-center py-2">
                                <div className="text-2xl bg-slate-700 rounded w-8 h-8"></div>
                                <div className="basis-3/5">
                                    <div className="rounded mb-2 h-4 w-30 bg-slate-700" ></div>
                                    <div className="rounded h-2 w-20 bg-slate-700"></div>
                                </div>
                                <div className="rounded h-4 w-14 bg-slate-700"></div>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <div className="text-2xl bg-slate-700 rounded w-8 h-8"></div>
                                <div className="basis-3/5">
                                    <div className="rounded mb-2 h-4 w-30 bg-slate-700" ></div>
                                    <div className="rounded h-2 w-20 bg-slate-700"></div>
                                </div>
                                <div className="rounded h-4 w-14 bg-slate-700"></div>
                            </div>
                            <div className="px-2 mt-4 rounded mb-2 h-4 w-14 bg-slate-700"></div>
                            <div className="flex justify-between items-center py-2">
                                <div className="text-2xl bg-slate-700 rounded w-8 h-8"></div>
                                <div className="basis-3/5">
                                    <div className="rounded mb-2 h-4 w-30 bg-slate-700" ></div>
                                    <div className="rounded h-2 w-20 bg-slate-700"></div>
                                </div>
                                <div className="rounded h-4 w-14 bg-slate-700"></div>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <div className="text-2xl bg-slate-700 rounded w-8 h-8"></div>
                                <div className="basis-3/5">
                                    <div className="rounded mb-2 h-4 w-30 bg-slate-700" ></div>
                                    <div className="rounded h-2 w-20 bg-slate-700"></div>
                                </div>
                                <div className="rounded h-4 w-14 bg-slate-700"></div>
                            </div>
                            <div className="px-2 mt-4 rounded mb-2 h-4 w-14 bg-slate-700"></div>
                            <div className="flex justify-between items-center py-2">
                                <div className="text-2xl bg-slate-700 rounded w-8 h-8"></div>
                                <div className="basis-3/5">
                                    <div className="rounded mb-2 h-4 w-30 bg-slate-700" ></div>
                                    <div className="rounded h-2 w-20 bg-slate-700"></div>
                                </div>
                                <div className="rounded h-4 w-14 bg-slate-700"></div>
                            </div>
                            <div className="px-2 mt-4 rounded mb-2 h-4 w-14 bg-slate-700"></div>
                            <div className="flex justify-between items-center py-2">
                                <div className="text-2xl bg-slate-700 rounded w-8 h-8"></div>
                                <div className="basis-3/5">
                                    <div className="rounded mb-2 h-4 w-30 bg-slate-700" ></div>
                                    <div className="rounded h-2 w-20 bg-slate-700"></div>
                                </div>
                                <div className="rounded h-4 w-14 bg-slate-700"></div>
                            </div>
                            <div className=" sticky -mt-12  flex justify-end right-0 bottom-4">

                            </div>

                        </div>
                        <div className=" sticky -mt-4  flex justify-end right-0 bottom-4">
                            <button onClick={() => { window.location.href = `/addExpense/` }} className="bg-blue-500  text-4xl hover:bg-blue-600  text-white pb-2 px-3 rounded-full ">
                                +
                            </button>
                        </div>
                    </div>


                    <div className={`list ${!effect ? 'hidden' : ''} `}>
                        {memoizedChildComponent}
                        <div className=" sticky -mt-12  flex justify-end right-0 bottom-4">
                            <button onClick={() => { window.location.href = `/addExpense/` }} className="bg-blue-500  text-4xl hover:bg-blue-600  text-white pb-2 px-3 rounded-full ">
                                +
                            </button>
                        </div>
                    </div >

                </div >
            </div >
        </main >

    )
}
