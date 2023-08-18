'use client';
import { useCallback, useEffect, useState } from "react";
import { Group1 } from "../../../utilities/Group1";

import useFirebaseAuthentication from '@/hooks/useFirebaseAuthentication';
import Link from "next/link";
import Image from 'next/image';



export default function Home() {

    const authUser = useFirebaseAuthentication();

    const [essentials, setEssentials] = useState('');
    const [savings, setSavings] = useState('');
    const [nonessentials, setNonessentials] = useState('');

    const [essentialsShare, setEssentialsShare] = useState(0);
    const [savingsShare, setSavingsShare] = useState(0);
    const [nonessentialsShare, setNonessentialsShare] = useState(0);

    const [degA, setDegA] = useState(120);
    const [degB, setDegB] = useState(240);
    const [degC, setDegC] = useState(0);
    const [salary, setSalary] = useState("");
    const [token, setToken] = useState('');
    const [error, setError] = useState(false);
    const [data, setData] = useState('');
    const [timer, setTimer] = useState('');

    setTimeout(() => setTimer(1), 6000)

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

    const getData = useCallback(async () => {
        if (!token) {
            return;
        }
        const response = await fetch(`/api/salary`, {
            headers: {
                "authorization": token
            },
            method: "GET",
        });
        const result = await response.json();
        console.log(result);
        const parsedResult = JSON.parse(result.result);
        //console.log("result",parsedResult[0].salary);
        if (parsedResult && parsedResult[0].essentials) {
            setData(parsedResult[0].essentials)
        }
        setSalary(parsedResult[0].salary);
    }, [token]);


    async function updateData(data) {
        if (!token) {
            return;
        }
        if ((parseInt(essentials) + parseInt(nonessentials) + parseInt(savings)) === 100) {
            const response = await fetch(`/api/salary`, {
                headers: {
                    "authorization": token
                },
                method: "PUT",
                body: JSON.stringify(data),
            });
            const result = await response.json();
            console.log("Success:", result);
            window.location.href = '/pieChart'
        } else setError(true);
    }


    const decimal = useCallback((value) => {
        var beforeDecimal = value.split(".").shift();
        var afterDecimal = value.split(".").pop();
        const num = parseInteger(beforeDecimal);
        return (num + "." + afterDecimal);
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
            setError(false);
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
        if (!authUser) {
            return;
        }
        authUser.getIdToken().then((val) => {
            setToken(val);
        });
        getData();
    }, [authUser, getData])


    useEffect(() => {
        budgetRatio();
    }, [budgetRatio]);

    if (data) {
        window.location.href = '/addExpense';
    }

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

    return (
        <main className="flex justify-center">
            <div className="flex min-h-screen flex-col max-w-xl justify-center px-6 pt-8 pb-4" >
                <div className=" absolute  top-0 left-0 max-w-xl  text-2xl  pt-6 pl-6">
                    Budgetry
                </div>

                <div className=" text-xl font-semibold  mb-2  w-100">
                    Set your monthly goal
                </div>
                <div className=" mb-2 text-sm">
                    The 50-30-20 model is widly adopted, but you can set your own goal too
                </div>




                <div className="flex justify-center">
                    <div className="w-40 h-40 bg-white z-10 rounded-full whiteRound">
                        <div className="text-black w-40 flex justify-center font-semibold totalAmount">
                            ₹{parseInteger(salary)}
                        </div>
                    </div>

                    <div className="piechart"
                        style={{ backgroundImage: `conic-gradient(pink ${degA}deg, blueviolet 0 ${degB}deg, orange 0 ${degC}deg)` }}>
                    </div>
                </div>

                <div className="mb-0">
                    <Group1 color="bg-cyan-100" title="Essentials" amount={`₹${essentialsShare}`} percentage={essentials} setPercentage={setEssentials} />
                    <Group1 color="bg-blue-500" title="Savings" amount={`₹${savingsShare}`} percentage={savings} setPercentage={setSavings} />
                    <Group1 color="bg-yellow-300" title="Non-essentials" amount={`₹${nonessentialsShare}`} percentage={nonessentials} setPercentage={setNonessentials} />
                </div>

                {error && <div className="text-red-600 font-bold mb-8">Enter the values correctly</div>}
                {!error && <div className="text-transparent font-bold mb-8">Enter the values correctly</div>}

                <button onClick={() => updateData({ "essentials": essentialsShare, "savings": savingsShare, "non_essentials": nonessentialsShare })} className='py-2 bg-indigo-600 w-full rounded-md'> Next -&gt;  </button>
            </div>
        </main>
    )
}
