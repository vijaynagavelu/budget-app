import Link from "next/link";

export default function Home1() {
    return (
        <main className="flex justify-center">

            <div className="flex min-h-screen max-w-xl justify-center  flex-col  p-6">
                <div className=" absolute  top-0 left-0  text-2xl  pt-6 pl-6">
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
                        <option >INR (₹)</option>
                        <option >€</option>
                        <option>A$</option>
                        <option>MYR</option>
                    </select>
                    <input className='text-black  text-base p-3 font-medium w-full  ' value={"69,960.00"}></input>
                </div>

                <Link href="/pieChart">
                    <button className='py-2 bg-indigo-600 w-full rounded-md'> Next -&gt;  </button>
                </Link>

            </div>

        </main >
    )
}
