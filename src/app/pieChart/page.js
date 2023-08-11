'use client';
import { useCallback, useEffect, useState } from "react";
import { Group1 } from "../../../utilities/Group1";

import useFirebaseAuthentication from '@/hooks/useFirebaseAuthentication';
import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "../googleSignIn/config"


export default function Home() {

    const authUser = useFirebaseAuthentication();

    const [essentials, setEssentials] = useState(0);
    const [savings, setSavings] = useState(0);
    const [nonessentials, setNonessentials] = useState(0);

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
    const [authUserID, setAuthUserId] = useState('');

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

    const logOut = () => {
        signOut(auth).then(() => {
            // Sign-out successful.
        }).catch((error) => {
            // An error happened.
        });
    }

    const getData = useCallback(async () => {
        if (!token) {
            return;
        }
        const response = await fetch(`http://localhost:3000/api/expense/${authUserID}`, {
            headers: {
                "authorization": token
            },
            method: "GET",
        });
        const result = await response.json();
        console.log(result);
        const parsedResult = JSON.parse(result.result);
        //console.log("result",parsedResult[0].salary);
        if (parsedResult[0].essentials) {
            setData(parsedResult[0].essentials)
        }
        setSalary(parsedResult[0].salary);
    }, [authUserID, token]);


    async function updateData(data) {
        if ((parseInt(essentials) + parseInt(nonessentials) + parseInt(savings)) === 100) {
            const response = await fetch("http://localhost:3000/api/salary", {
                method: "PUT",
                body: JSON.stringify(data),
            });
            const result = await response.json();
            console.log("Success:", result);
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
            setAuthUserId(authUser.uid)
        });
        getData();
    }, [authUser, getData])


    useEffect(() => {
        budgetRatio();
    }, [budgetRatio]);

    if (data) {
        window.location.href = '/addExpense';
    }

    return (
        <main className="flex justify-center">
            <div className="flex min-h-screen flex-col max-w-xl justify-center px-6 pt-8 pb-4" >
                <div className=" absolute  top-0 left-0 max-w-xl  text-2xl  pt-6 pl-6">
                    Budgetry
                </div>
                <Link href="/">
                    <div onClick={logOut} className="w-20 absolute text-center top-0 right-0 mt-6 mr-6 bg-indigo-600 rounded-md">
                        Logout
                    </div>
                </Link>
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

                <Link href="/addExpense">
                    <button onClick={() => updateData({ "id": authUserID, "essentials": essentialsShare, "savings": savingsShare, "non_essentials": nonessentialsShare })} className='py-2 bg-indigo-600 w-full rounded-md'> Next -&gt;  </button>
                </Link>

            </div>
        </main>

    )
}
