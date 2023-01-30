import { useState, useEffect } from "react";
import axios, { AxiosResponse } from "axios";
import { Button, Navbar } from "flowbite-react";
import LoginButton from "./NavLoginButton";
import LogoutButton from "./NavLogoutButton";
import { fetchUser, FetchUserResponseType, setStatus, UserState } from "../redux/userSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

interface CurrentUser {
    error: boolean;
    message: string;
    userId: string;
    email: string;
}
// interface NavigationBarProps {
//     login: () => {};
//     logout: () => {};
// }

const NavigationBar: React.FC = () => {
    // const [user, setUser] = useState("");
    // const [login, setLogin] = useState(false);
    const user = useAppSelector((state) => state.user.user);
    const loginStatus = useAppSelector((state) => state.user.user.loggedIn);
    const registeredStatus = useAppSelector((state) => state.user.user.registered);
    const userStatus = useAppSelector((state) => state.user.status);
    const dispatch = useAppDispatch();

    // const fetchUser = async () => {
    //     console.log(login);
    //     const configurationObject = {
    //         method: "get",
    //         url: `${process.env.REACT_APP_DATA_WRITER_API_URL}auth/login/success`,
    //         headers: {},
    //         withCredentials: true,
    //     };
    //     let response: CurrentUser = { error: false, message: "", user_id: "" };
    //     try {
    //         response = await axios(configurationObject);
    //         console.log(response);
    //         if (!response.error) {
    //             setUser(response.user_id);
    //             setLogin(true);
    //         }
    //         return;
    //     } catch (err: any) {
    //         console.log(err.response.data);
    //         return false;
    //     }
    // };

    // const fetchUser = async () => {
    //     console.log(loginStatus);
    //     const configurationObject = {
    //         method: "get",
    //         url: `${process.env.REACT_APP_DATA_WRITER_API_URL}auth/login/success`,
    //         headers: {},
    //         withCredentials: true,
    //     };
    //     try {
    //         const response: AxiosResponse<FetchUserResponseType> = await axios(configurationObject);
    //         console.log(response.data);
    //         if (!response.data.error) {
    //             dispatch(setStatus(response.data));
    //         }
    //         return;
    //     } catch (error: any) {
    //         console.log(error.message);
    //         return false;
    //     }
    // };

    const fetchUserRedux = () => {
        if (userStatus == "idle") {
            dispatch(fetchUser());
        }
        return;
    };

    useEffect(() => {
        fetchUserRedux();
    }, []);

    return (
        <header className="flex items-center justify-between px-4 py-1 bg-white">
            <div>
                <p>{JSON.stringify(user)}</p>
                <a href={process.env.REACT_APP_PUBLIC_URL} className="flex items-center">
                    <img src="/gvt-logo.png" className="h-8" alt="DDR" />
                    <span className="self-center text-xl font-semibold text-gray-700 py-1">
                        Distributed Data Repository
                    </span>
                </a>
            </div>
            {/* <div className="hidden w-full md:block md:w-auto" id="navbar-multi-level"></div> */}
            <div className="flex">
                <ul className="flex flex-col p-4 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                    <li>
                        <a
                            href={process.env.REACT_APP_PUBLIC_URL}
                            className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-white dark:bg-blue-600 md:dark:bg-transparent transition duration-300 ease"
                            aria-current="page"
                        >
                            Home
                        </a>
                    </li>
                    <li>
                        <a
                            href="#"
                            className="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent transition duration-300 ease"
                        >
                            Explore
                        </a>
                    </li>
                    <li>
                        <a
                            href="#"
                            className="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent transition duration-300 ease"
                        >
                            Publish
                        </a>
                    </li>
                    <li>
                        <button
                            id="dropdownNavbarLink"
                            data-dropdown-toggle="dropdownNavbar"
                            className="flex items-center justify-between w-full py-2 pl-3 pr-4 font-medium text-gray-700 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:w-auto dark:text-gray-400 dark:hover:text-white dark:focus:text-white dark:border-gray-700 dark:hover:bg-gray-700 md:dark:hover:bg-transparent transition duration-300 ease"
                        >
                            Services{" "}
                            <svg
                                className="w-4 h-4 ml-1"
                                aria-hidden="true"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                ></path>
                            </svg>
                        </button>
                        <div
                            id="dropdownNavbar"
                            className="z-10 hidden font-normal bg-white divide-y divide-gray-100 rounded shadow w-44 dark:bg-gray-700 dark:divide-gray-600"
                        >
                            <ul
                                className="py-1 text-sm text-gray-700 dark:text-gray-400"
                                aria-labelledby="dropdownLargeButton"
                            >
                                <li>
                                    <a
                                        href="#"
                                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                    >
                                        Dashboard
                                    </a>
                                </li>
                                <li aria-labelledby="dropdownNavbarLink">
                                    <button
                                        id="doubleDropdownButton"
                                        data-dropdown-toggle="doubleDropdown"
                                        data-dropdown-placement="right-start"
                                        type="button"
                                        className="flex items-center justify-between w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                    >
                                        Services
                                        <svg
                                            aria-hidden="true"
                                            className="w-5 h-5"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                                clipRule="evenodd"
                                            ></path>
                                        </svg>
                                    </button>
                                    <div
                                        id="doubleDropdown"
                                        className="z-10 hidden bg-white divide-y divide-gray-100 rounded shadow w-44 dark:bg-gray-700"
                                    >
                                        <ul
                                            className="py-1 text-sm text-gray-700 dark:text-gray-200"
                                            aria-labelledby="doubleDropdownButton"
                                        >
                                            <li>
                                                <a
                                                    href="#"
                                                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-400 dark:hover:text-white"
                                                >
                                                    Overview
                                                </a>
                                            </li>
                                            <li>
                                                <a
                                                    href="#"
                                                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-400 dark:hover:text-white"
                                                >
                                                    My downloads
                                                </a>
                                            </li>
                                            <li>
                                                <a
                                                    href="#"
                                                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-400 dark:hover:text-white"
                                                >
                                                    Billing
                                                </a>
                                            </li>
                                            <li>
                                                <a
                                                    href="#"
                                                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-400 dark:hover:text-white"
                                                >
                                                    Rewards
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                    >
                                        Earnings
                                    </a>
                                </li>
                            </ul>
                            <div className="py-1">
                                <a
                                    href="#"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-400 dark:hover:text-white"
                                >
                                    Sign out
                                </a>
                            </div>
                        </div>
                    </li>
                </ul>
                {loginStatus && <LogoutButton />}
                {!loginStatus && <LoginButton />}
                <button
                    className="text-xs h-8 w-16 border border-gray-200 bg-gray-200 text-gray-700 rounded-md px-2 py-2 m-2 transition duration-300 ease select-none hover:bg-gray-300 focus:outline-none focus:shadow-outline"
                    onClick={fetchUser}
                >
                    Check!
                </button>
            </div>
        </header>
    );
};

export default NavigationBar;
