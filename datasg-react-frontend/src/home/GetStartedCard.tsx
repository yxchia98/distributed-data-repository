const GetStartedCard = () => {
    return (
        <div className="max-w py-10 px-2 mx-2 my-2 overflow-hidden bg-white bg-local bg-origin-content shadow-lg">
            <div className="flex flex-col text-center">
                <div className="font-semibold pb-2  2xl:text-4xl xl:text-3xl md:text-2xl sm:text-xl text-gray-700">
                    Break through inter-agency barriers today
                </div>
                <div className="text-gray-700">
                    Log in with your government-issued work email and harness the power of
                    Whole-of-Government data
                </div>
            </div>
            <div className="flex justify-center h-20">
                <button className="h-10 self-center flex items-center justify-center text-sm-bold border border-indigo-500 bg-indigo-500 text-white rounded-md px-4 transition duration-300 ease select-none hover:bg-indigo-600 focus:outline-none focus:shadow-outline">
                    <p className="">Login</p>
                </button>
            </div>
        </div>
    );
};

export default GetStartedCard;
