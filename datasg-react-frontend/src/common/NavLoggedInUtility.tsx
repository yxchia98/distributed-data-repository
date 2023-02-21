import { Popover, Transition } from "@headlessui/react";
import axios from "axios";
import { Fragment } from "react";
import { IconContext } from "react-icons";
import { BsPersonCircle } from "react-icons/bs";
import { SiDatabricks } from "react-icons/si";
import { MdPendingActions } from "react-icons/md";
import { IoLogOutOutline } from "react-icons/io5";
import { googleLogout } from "./googleAuth";
import { useNavigate } from "react-router-dom";

const LoggedInUtility: React.FC = () => {
    const navigate = useNavigate();
    const handleProfileOnClick = () => {
        return navigate("/profile/details");
    };
    const handleRequestOnClick = () => {
        return navigate("/profile/requests");
    };
    const handleTopicOnClick = () => {
        return navigate("/profile/topics");
    };
    return (
        <Popover className="relative">
            {({ open }) => (
                <>
                    <Popover.Button
                        className={`
                ${open ? "" : "text-opacity-90"}
                group inline-flex items-center rounded-md px-3 py-2 text-base font-medium text-white hover:text-opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
                    >
                        <IconContext.Provider
                            value={{
                                size: "2em",
                                color: "rgb(107 114 128)",
                            }}
                        >
                            <div className=" h-5 w-5 flex items-center justify-center">
                                <BsPersonCircle />
                            </div>
                        </IconContext.Provider>
                    </Popover.Button>
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                    >
                        <Popover.Panel className="absolute z-10 mt-2 transform -translate-x-8 px-0 ">
                            <div className="overflow-hidden flex flex-col rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 ">
                                <button
                                    onClick={handleProfileOnClick}
                                    className="bg-white p-4 rounded-md flex flex-row justify-between items-center"
                                >
                                    <IconContext.Provider
                                        value={{
                                            size: "1.25em",
                                            color: "rgb(107 114 128)",
                                        }}
                                    >
                                        <div className="px-2">
                                            <BsPersonCircle />
                                        </div>
                                    </IconContext.Provider>
                                    <p className="text-sm font-medium text-gray-900 px-2">
                                        Profile
                                    </p>
                                </button>
                                <button
                                    onClick={handleRequestOnClick}
                                    className="bg-white px-2 py-4 flex flex-row border-t-[1px] border-gray-100 justify-between items-center"
                                >
                                    <IconContext.Provider
                                        value={{
                                            size: "1.25em",
                                            color: "rgb(107 114 128)",
                                        }}
                                    >
                                        <div className="px-2">
                                            <MdPendingActions />
                                        </div>
                                    </IconContext.Provider>
                                    <p className="text-sm font-medium text-gray-900 px-2">
                                        Requests
                                    </p>
                                </button>
                                <button
                                    onClick={handleTopicOnClick}
                                    className="bg-white px-2 py-4 flex flex-row  border-b-[1px] border-t-[1px] border-gray-100 justify-between items-center"
                                >
                                    <IconContext.Provider
                                        value={{
                                            size: "1.25em",
                                            color: "rgb(107 114 128)",
                                        }}
                                    >
                                        <div className="pl-2">
                                            <SiDatabricks />
                                        </div>
                                    </IconContext.Provider>
                                    <p className="text-sm font-medium text-gray-900 pr-2">
                                        My Topics
                                    </p>
                                </button>
                                <button
                                    className="bg-gray-50 p-4 rounded-b-md flex flex-row justify-between items-center"
                                    onClick={googleLogout}
                                >
                                    <IconContext.Provider
                                        value={{
                                            size: "1.25em",
                                            color: "rgb(107 114 128)",
                                        }}
                                    >
                                        <div className="px-2">
                                            <IoLogOutOutline />
                                        </div>
                                    </IconContext.Provider>
                                    <span className="text-sm font-medium text-gray-900 px-2">
                                        Logout
                                    </span>
                                </button>
                            </div>
                        </Popover.Panel>
                    </Transition>
                </>
            )}
        </Popover>
    );
};

export default LoggedInUtility;
