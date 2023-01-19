import { BsArrowRight } from "react-icons/bs";
import { IconContext } from "react-icons";

const MainCard = () => {
    return (
        <div className="max-w py-20 px-2 mx-2 my-2 overflow-hidden bg-white flex justify-center bg-local bg-origin-content shadow-lg">
            <div className="px-6 pt-10">
                <div className="font-bold mb-2 pb-4 xl:text-6xl md:text-4xl sm:text-2xl text-gray-700 items-center">
                    Efficiently share Data <br /> across Agencies. <br /> Transparently.
                </div>
                <div className="">
                    <button className="h-12 self-center flex items-center justify-center text-sm-bold border border-indigo-500 bg-indigo-500 text-white rounded-md px-4 transition duration-300 ease select-none hover:bg-indigo-600 focus:outline-none focus:shadow-outline">
                        <p className="pr-1.5">Get Started</p>
                        <BsArrowRight className="fill-white" />
                    </button>
                </div>
            </div>
            <div className="xl:w-[50%] xl:-translate-x-20 md:w-[60%] md:-translate-x-12">
                <img src="/img/DDR-landing-image.png"></img>
            </div>
        </div>
    );
};

export default MainCard;
