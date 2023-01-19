// import { regular, solid } from "@fortawesome/fontawesome-svg-core";
import { FiShare2 } from "react-icons/fi";

const OfferingCard = () => {
    return (
        <div className="max-w py-20 px-2 mx-2 my-2 overflow-hidden bg-white bg-local bg-origin-content shadow-lg">
            <div className="text-center">
                <div className="font-semibold mb-2 pb-4 2xl:text-4xl xl:text-3xl md:text-2xl sm:text-xl text-gray-700">
                    Our Offerings
                </div>
            </div>

            <div className="flex justify-center">
                <div className="items-center">
                    <FiShare2 /> <p>Data Archiving</p>
                    <p>Safely archive data for auditing purposes</p>
                </div>
                <div className="flex-h justify-center items-center h-20">Hello</div>
            </div>
        </div>
    );
};

export default OfferingCard;
