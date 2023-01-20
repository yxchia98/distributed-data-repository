import { IconContext } from "react-icons";
import { BsGithub, BsTelegram, BsWhatsapp } from "react-icons/bs";
import { MdOutlineAlternateEmail } from "react-icons/md";

const FooterCard = () => {
    return (
        <div className="max-w py-10 mx-2 my-2 overflow-auto bg-white bg-local bg-origin-content shadow-lg">
            <div className="flex flex-row justify-center">
                <div className="flex flex-col px-[5%] w-[25%] items-center">
                    <div className="font-semibold pb-2 xl:text-lg sm:text-base text-gray-700">
                        Information
                    </div>
                    <ul className="text-gray-400 text-xs">
                        <li className="align-middle justify-center flex flex-row pb-1">Vision</li>
                        <li className="align-middle justify-center flex flex-row pb-1">The Team</li>
                        <li className="align-middle justify-center flex flex-row pb-1">Roadmap</li>
                    </ul>
                </div>
                <div className="flex flex-col px-[5%] w-[25%] items-center">
                    <div className="font-semibold pb-2 xl:text-lg sm:text-base text-gray-700">
                        Resources
                    </div>
                    <ul className="text-gray-400 text-xs">
                        <li className="align-middle justify-center flex flex-row pb-1">
                            Get Started Guide
                        </li>
                        <li className="align-middle justify-center flex flex-row pb-1">
                            Developer API
                        </li>
                        <li className="align-middle justify-center flex flex-row pb-1">
                            Documentation
                        </li>
                    </ul>
                </div>
                <div className="flex flex-col px-[5%] w-[25%] items-center">
                    <div className="font-semibold pb-2 xl:text-lg sm:text-base text-gray-700">
                        Contact us here
                    </div>
                    <div className="flex flex-row justify-center">
                        <IconContext.Provider value={{ size: "1em" }}>
                            <div className="px-[5%]">
                                <BsGithub />
                            </div>
                        </IconContext.Provider>
                        <IconContext.Provider value={{ size: "1em" }}>
                            <div className="px-[5%]">
                                <MdOutlineAlternateEmail />
                            </div>
                        </IconContext.Provider>
                        <IconContext.Provider value={{ size: "1em" }}>
                            <div className="px-[5%]">
                                <BsWhatsapp />
                            </div>
                        </IconContext.Provider>
                        <IconContext.Provider value={{ size: "1em" }}>
                            <div className="px-[5%]">
                                <BsTelegram />
                            </div>
                        </IconContext.Provider>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FooterCard;
