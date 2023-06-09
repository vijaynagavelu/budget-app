export default function Home1() {
    return (
        <main className="flex min-h-screen flex-col items-left p-6">
            <div className=" max-w-xl  text-2xl  mb-52">
                Budgetry
            </div>


            <div className=" text-xl font-semibold  mb-2  w-100">
                Enter your current monthly salary
            </div>

            <div className=" mb-12 text-sm">
                The total income you incur regularly
            </div>

            <div className="flex mb-8 ">
                <select name="currencies " className="text-black border-black text-base p-3 font-medium w-36 " id="cars">
                    <option className="text-xs" >INR (₹)</option>
                    <option className="text-xs" >€</option>
                    <option className="text-xs">A$</option>
                    <option className="text-xs">MYR</option>
                </select>
                <input className='text-black  text-base p-3 font-medium w-full  ' value={"69,960.00"}></input>
            </div>

            <button className='py-2 bg-indigo-600 '> Next -&gt;  </button>

        </main >
    )
}
