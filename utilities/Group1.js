export function Group1({ color, title, amount, percentage, setPercentage }) {
    return (
        <div className="flex flex-row items-center mb-4 justify-between ">
            <div className="flex flex-row items-center gap-8 ">
                <div className={`w-8 h-8 ${color} rounded`}>
                </div>

                <div className=" flex flex-col gap-0  ">
                    <div className=" text-lg font-semibold  -mb-1  w-100">
                        {title}
                    </div>
                    <div className=" text-base font-light w-100">
                        {amount}
                    </div>
                </div>
            </div>
            <input onChange={(e) => {
                setPercentage(e.target.value);
            }} className="w-20 h-10 text-m text-black font-semibold rounded" placeholder="0" type="number" value={percentage} name="quantity" min={0} step={10} max={100}></input>
        </div >
    )
} 