'use client';
import { useCallback, useEffect, useState } from "react";
import { Group1 } from "../../utilities/Group1";


export default function Home2() {

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
        } else {
            setEssentialsShare(0);
            setSavingsShare(0);
            setNonessentialsShare(0);
            console.log("your value is wrongs");
        }
    }, [decimal, essentials, nonessentials, salary, savings]);


    useEffect(() => {
        budgetRatio();
    }, [budgetRatio]);


    return (
        <main className="flex min-h-screen flex-col items-left p-6">
            <div className=" max-w-xl  text-2xl  mb-10">
                Budgetry
            </div>
            <div className=" text-xl font-semibold  mb-2  w-100">
                Set your monthly goal
            </div>
            <div className=" mb-12 text-sm">
                The 50-30-20 model is widly adopted, but you can set your own goal too
            </div>

            <div className="flex justify-center">
                <div className="w-40 h-40 bg-white z-10 rounded-full whiteRound">
                    <div className="text-black w-40 flex justify-center font-semibold totalAmount">
                        ₹{parseInteger(salary)}
                    </div>
                </div>

                <div className="piechart" style={{
                    backgroundImage: `conic-gradient(pink ${degA}deg, blueviolet 0 ${degB}deg, orange 0 ${degC}deg)`
                }}></div>
            </div>


            <div className="flex mb-8 ">
                <select name="currencies " className="text-black border-black text-base p-3 font-medium w-36 " id="cars">
                    <option className="text-xs" >INR (₹)</option>
                    <option className="text-xs" >€</option>
                    <option className="text-xs">A$</option>
                    <option className="text-xs">MYR</option>
                </select>
                <input type="text" onChange={(e) => {
                    setSalary(e.target.value),
                        budgetRatio()
                }} className='text-black  text-base p-3 font-semibold w-full' placeholder="0" value={parseInteger(salary)}></input>
            </div>

            {/* <div className="flex flex-row items-center justify-between mb-6 ">
                <div className="flex flex-row items-center gap-8 ">
                    <div className={`w-8 h-8 bg-cyan-100 rounded`}>
                    </div>

                    <div className=" flex flex-col gap-0">
                        <div className=" text-lg font-semibold  -mb-1  w-100">
                            save
                        </div>
                        <div className=" text-base font-light w-100">
                            555
                        </div>
                    </div>
                </div>
                <input readOnly className="w-20 h-10 text-m text-black font-semibold rounded" placeholder="0" type="number" name="quantity" min={0} step={10} max={100}></input>
            </div > */}

            <div className="mb-0">
                <Group1 color="bg-cyan-100" title="Essentials" amount={`₹${essentialsShare}`} percentage={essentials} setPercentage={setEssentials} />
                <Group1 color="bg-blue-500" title="Savings" amount={`₹${savingsShare}`} percentage={savings} setPercentage={setSavings} />
                <Group1 color="bg-yellow-300" title="Non-essentials" amount={`₹${nonessentialsShare}`} percentage={nonessentials} setPercentage={setNonessentials} />
            </div>

            {(parseInt(essentials) + parseInt(nonessentials) + parseInt(savings)) !== 100 && <div className="text-red-600 font-bold mb-8">Enter the values correctly</div>}       <div></div>
            {(parseInt(essentials) + parseInt(nonessentials) + parseInt(savings)) === 100 && <div className="text-transparent font-bold mb-8">Enter the values correctly</div>}       <div></div>

            <button className='py-2 bg-indigo-600 '> Next -&gt;  </button>
        </main >


    )
}
