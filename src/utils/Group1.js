export function Group1({ color, title, amount, percentage, setPercentage }) {

    return (
        <div className="flex items-center mb-4 justify-between">
            <div className="flex  items-center gap-2">
                <div className={`flex w-8 h-8  ${color} rounded`}>
                </div>
                <div className="flex w-2">
                </div>

                <div className=" flex flex-col mr-4">
                    <div className=" text-lg font-semibold  -mb-1 ">
                        {title}
                    </div>
                    <div className=" text-base font-light">
                        {amount}
                    </div>
                </div>
            </div>

            <input onChange={(e) => {
                setPercentage(e.target.value);
            }} className="piechartInput w-20 h-10 text-m text-black font-semibold rounded" placeholder="0" type="number" value={percentage} name="quantity" min={0} step={10} max={100}>
            </input>
        </div >
    )
}

