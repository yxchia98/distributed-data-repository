import { Popover, Transition } from "@headlessui/react";
import axios from "axios";
import { Fragment } from "react";
import { IconContext } from "react-icons";
import { BsPersonCircle } from "react-icons/bs";
import { IoLogOutOutline } from "react-icons/io5";
import { googleLogout } from "./googleAuth";

const LogoutButton: React.FC = () => {
    return (
        // <button
        //     className="h-8 w-16 self-center text-xs text-center border border-red-500 bg-red-500 text-white rounded-md px-2 transition duration-300 ease select-none hover:bg-red-600 focus:outline-none focus:shadow-outline"
        //     onClick={googleLogout}
        // >
        //     Logout
        // </button>
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
                                <button className="bg-white p-4 rounded-md flex flex-row justify-center items-center">
                                    <IconContext.Provider
                                        value={{
                                            size: "1.5em",
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
                                    className="bg-gray-50 p-4 rounded-md flex flex-row justify-center items-center"
                                    onClick={googleLogout}
                                >
                                    <IconContext.Provider
                                        value={{
                                            size: "1.5em",
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

export default LogoutButton;
