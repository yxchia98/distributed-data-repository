// import { regular, solid } from "@fortawesome/fontawesome-svg-core";
import { IconContext } from "react-icons";
import { BsFillArchiveFill } from "react-icons/bs";
import { BiShareAlt } from "react-icons/bi";
import { MdLockOpen } from "react-icons/md";

const OfferingCard = () => {
    return (
        <div className="max-w py-20 px-2 mx-2 my-2 overflow-hidden bg-white bg-local bg-origin-content shadow-lg">
            <div className="text-center">
                <div className="font-semibold mb-2 pb-4 2xl:text-4xl xl:text-3xl md:text-2xl sm:text-xl text-gray-700">
                    Our Offerings
                </div>
            </div>

            <div className="flex justify-center items-center">
                <div className="w-[30%] flex flex-col items-center">
                    <div className=" bg-purple-200 rounded-xl text-center my-4">
                        <IconContext.Provider value={{ size: "2.5em", color: "rgb(85, 33, 181)" }}>
                            <div className="p-4">
                                <BsFillArchiveFill />
                            </div>
                        </IconContext.Provider>
                    </div>
                    <div className="font-semibold text-gray-700 2xl:text-2xl xl:text-xl md:text-lg sm:text-md">
                        Data Archiving
                    </div>
                    <div className=" text-gray-700">Safely archive data for auditing purposes</div>
                </div>
                <div className="w-[30%] flex flex-col items-center">
                    <div className=" bg-green-200 rounded-xl text-center my-4">
                        <IconContext.Provider value={{ size: "2.5em", color: "rgb(3 84 63)" }}>
                            <div className="p-4">
                                <BiShareAlt />
                            </div>
                        </IconContext.Provider>
                    </div>
                    <div className="font-semibold text-gray-700 2xl:text-2xl xl:text-xl md:text-lg sm:text-md">
                        Data Sharing
                    </div>
                    <div className=" text-gray-700">Efficiently collaborate and share data</div>
                </div>
                <div className="w-[30%] flex flex-col items-center">
                    <div className=" bg-pink-200 rounded-xl text-center my-4">
                        <IconContext.Provider value={{ size: "2.5em", color: "rgb(155, 28, 28)" }}>
                            <div className="p-4">
                                <MdLockOpen />
                            </div>
                        </IconContext.Provider>
                    </div>
                    <div className="font-semibold text-gray-700 2xl:text-2xl xl:text-xl md:text-lg sm:text-md">
                        Access Control
                    </div>
                    <div className=" text-gray-700">Manage data access securely</div>
                </div>
            </div>
        </div>
    );
};

export default OfferingCard;
