import { Group1 } from "../../utilities/Group1";


export default function Home1() {

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
                    <div className="totalAmount">
                        ₹69,960.00
                    </div>
                </div>

                <div className="piechart" style={{
                    backgroundImage: `conic-gradient(pink ${120}deg, lightblue 0 ${200}deg, orange 0 ${300}deg)`
                }}></div>
            </div>


            <div className="flex mb-8 ">
                <select name="currencies " className="text-black border-black text-base p-3 font-medium w-36 " id="cars">
                    <option className="text-xs" >INR (₹)</option>
                    <option className="text-xs" >€</option>
                    <option className="text-xs">A$</option>
                    <option className="text-xs">MYR</option>
                </select>
                <input readOnly className='text-black  text-base p-3 font-medium w-full' value={"69,960.00"}></input>
            </div>

            {/* <div className="flex flex-row items-center justify-between mb-6 ">
                <div className="flex flex-row items-center gap-8 ">
                    <div className={`w-8 h-8 bg-cyan-100 rounded`}>
                    </div>

                    <div className=" flex flex-col gap-0">
                        <div className=" text-lg font-semibold  -mb-1  w-100">
                            ff
                        </div>
                        <div className=" text-base font-light w-100">
                            f
                        </div>
                    </div>
                </div>
                <input className="w-20 h-10 text-sm text-black rounded" placeholder="0" type="number" name="quantity" min={0} step={10} max={100}></input>
            </div > */}

            <div className="mb-10">
                <Group1 color="bg-cyan-100" title="Essentials" amount="₹34,980.00" percentage="20" />
                <Group1 color="bg-blue-500" title="Savings" amount="₹13,992.00" percentage="20" />
                <Group1 color="bg-yellow-300" title="Non-essentials" amount="₹20,988.00" percentage="30" />
            </div>

            <button className='py-2 bg-indigo-600 '> Next -&gt;  </button>
        </main >


    )
}
