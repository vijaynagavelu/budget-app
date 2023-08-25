export function Nav({ transactionsByDate, isUpdated, isDeleted, getHeaderText }) {


    function generateRandomColor() {
        let maxVal = 0xFFFFFF; // 16777215
        let randomNumber = Math.random() * maxVal;
        randomNumber = Math.floor(randomNumber);
        randomNumber = randomNumber.toString(16);
        let randColor = randomNumber.padStart(6, 0);
        return `#${randColor.toUpperCase()}`
    }


    return (
        <div>
            {Object.entries(transactionsByDate).map(([date, transactions]) => {
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
            })}
        </div>

    )
}
