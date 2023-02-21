import axios from "axios";
import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import NavigationBar from "../../common/NavigationBar";
import { useAppSelector } from "../../redux/hooks";
import CustomErrorPage from "../../common/CustomErrorPage";
import { Link } from "react-router-dom";
import { IconContext } from "react-icons";
import { BsPersonCircle } from "react-icons/bs";
import { MdPendingActions } from "react-icons/md";
import { SiDatabricks } from "react-icons/si";
import { IoLogOutOutline } from "react-icons/io5";
import { NavLink } from "react-router-dom";

const ProfileSideBar: React.FC = (props) => {
    const userSelector = useAppSelector((state) => state.user);

    return (
        <div className="w-full h-full border-r-1 flex border-gray-300 overflow-auto bg-gray-50">
            <nav className="w-full">
                <div className="w-full border-b-2 flex flex-row justify-center items-center">
                    <span className="text-xl p-4">My Stuff</span>
                </div>
                <ul className="w-full">
                    <li className="w-auto m-2">
                        <NavLink
                            to={`details`}
                            className={({ isActive, isPending }) =>
                                isActive
                                    ? `w-full grid grid-cols-5 py-4 bg-indigo-500 rounded-xl shadow-md text-white`
                                    : `w-full grid grid-cols-5 py-4 bg-white rounded-xl shadow-md text-gray-700 hover:bg-indigo-100 transition duration-300`
                            }
                        >
                            <div className="col-start-2 flex">
                                <IconContext.Provider
                                    value={{
                                        size: "1.5em",
                                        // color: "rgb(107 114 128)",
                                    }}
                                >
                                    <div className="mx-2">
                                        <BsPersonCircle />
                                    </div>
                                </IconContext.Provider>
                                <span>Profile</span>
                            </div>
                        </NavLink>
                    </li>

                    <li className="w-auto m-2">
                        <NavLink
                            to={`requests`}
                            className={({ isActive, isPending }) =>
                                isActive
                                    ? `w-full grid grid-cols-5 py-4 bg-indigo-500 rounded-xl shadow-md text-white`
                                    : `w-full grid grid-cols-5 py-4 bg-white rounded-xl shadow-md text-gray-700 hover:bg-indigo-100 transition duration-300`
                            }
                        >
                            <div className="col-start-2 flex">
                                <IconContext.Provider
                                    value={{
                                        size: "1.5em",
                                        // color: "rgb(107 114 128)",
                                    }}
                                >
                                    <div className="mx-2">
                                        <MdPendingActions />
                                    </div>
                                </IconContext.Provider>
                                <span>Requests</span>
                            </div>
                        </NavLink>
                    </li>
                    <li className="w-auto m-2">
                        <NavLink
                            to={`topics`}
                            className={({ isActive, isPending }) =>
                                isActive
                                    ? `w-full grid grid-cols-5 py-4 bg-indigo-500 rounded-xl shadow-md text-white`
                                    : `w-full grid grid-cols-5 py-4 bg-white rounded-xl shadow-md text-gray-700 hover:bg-indigo-100 transition duration-300`
                            }
                        >
                            <div className="col-start-2 flex">
                                <IconContext.Provider
                                    value={{
                                        size: "1.5em",
                                        // color: "rgb(107 114 128)",
                                    }}
                                >
                                    <div className="mx-2">
                                        <SiDatabricks />
                                    </div>
                                </IconContext.Provider>
                                <span>Topics</span>
                            </div>
                        </NavLink>
                    </li>
                    <li className="w-auto m-2">
                        <NavLink
                            to={`logout`}
                            className={({ isActive, isPending }) =>
                                isActive
                                    ? `w-full grid grid-cols-5 py-4 bg-indigo-500 rounded-xl shadow-md text-white`
                                    : `w-full grid grid-cols-5 py-4 bg-white rounded-xl shadow-md text-gray-700 hover:bg-indigo-100 transition duration-300`
                            }
                        >
                            <div className="col-start-2 flex">
                                <IconContext.Provider
                                    value={{
                                        size: "1.5em",
                                        // color: "rgb(107 114 128)",
                                    }}
                                >
                                    <div className="mx-2">
                                        <IoLogOutOutline />
                                    </div>
                                </IconContext.Provider>
                                <span>Logout</span>
                            </div>
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default ProfileSideBar;
