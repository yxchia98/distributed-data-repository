const AgencyCard = () => {
    return (
        <div className="max-w py-20 px-2 mx-2 my-2 overflow-hidden bg-white bg-local bg-origin-content shadow-lg">
            <div className="text-center">
                <div className="font-semibold mb-2 pb-4 2xl:text-4xl xl:text-3xl md:text-2xl sm:text-xl text-gray-700">
                    Onboarded Agencies
                </div>
            </div>

            <div className="flex justify-center h-20">
                <img src="/logo/govtech-logo.png" className="grayscale px-4" />
                <img src="/logo/mom-logo.png" className="grayscale px-4" />
                <img src="/logo/moe-logo.png" className="grayscale px-4" />
                <img src="/logo/moh-logo.png" className="grayscale px-4" />
            </div>
        </div>
    );
};

export default AgencyCard;
