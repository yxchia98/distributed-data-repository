import { useEffect } from "react";
import LoginButton from "./NavLoginButton";
import LogoutButton from "./NavLogoutButton";
import { fetchUser } from "../redux/userSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { Link, useNavigate } from "react-router-dom";

interface CurrentUser {
    error: boolean;
    message: string;
    userId: string;
    email: string;
}

interface NavigationBarProps {
    current: string;
}

const NavigationBar: React.FC<NavigationBarProps> = (props) => {
    const navigate = useNavigate();
    const userSelector = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch();

    // request for user credentials in redux
    const fetchUserRedux = () => {
        // dispatch redux thunk to fetch session and
        // chain mandatory redirect to register page if not registered
        dispatch(fetchUser()).then((action: any) => {
            // console.log(action);
            if (action.payload.data.loggedIn && !action.payload.data.registered) {
                return navigate("/register");
            }
            return;
        });
        return;
    };

    useEffect(() => {
        fetchUserRedux();
    }, []);

    return (
        <header className="h-[7.5%] flex items-center justify-between bg-white px-4">
            <div>
                <Link to="/" className="flex items-center">
                    <img src="/gvt-logo.png" className="h-8" alt="DDR" />
                    <span className="self-center text-xl font-semibold text-gray-700 py-1">
                        Distributed Data Repository
                    </span>{" "}
                </Link>
            </div>
            <div className="flex bg-white">
                <ul className="flex flex-col items-center mx-16 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white">
                    <li>
                        {props.current == "home" && (
                            <Link
                                to="/"
                                className="block py-2 pl-3 pr-4 text-white bg-indigo-700 rounded md:bg-transparent md:text-indigo-700 md:p-0 dark:bg-indigo-600 md:dark:bg-transparent transition duration-200 ease"
                                aria-current="page"
                            >
                                Home
                            </Link>
                        )}
                        {props.current != "home" && (
                            <Link
                                to="/"
                                className="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-indigo-700 md:p-0 transition duration-200 ease"
                                aria-current="page"
                            >
                                Home
                            </Link>
                        )}
                    </li>
                    <li>
                        {props.current == "explore" && (
                            <Link
                                to="/explore"
                                className="block py-2 pl-3 pr-4 text-white bg-indigo-700 rounded md:bg-transparent md:text-indigo-700 md:p-0 dark:bg-indigo-600 md:dark:bg-transparent transition duration-200 ease"
                                aria-current="page"
                            >
                                Explore
                            </Link>
                        )}
                        {props.current != "explore" && (
                            <Link
                                to="/explore"
                                className="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-indigo-700 md:p-0 transition duration-200 ease"
                                aria-current="page"
                            >
                                Explore
                            </Link>
                        )}
                    </li>
                    <li>
                        {props.current == "publish" && (
                            <Link
                                to="/publish"
                                className="block py-2 pl-3 pr-4 text-white bg-indigo-700 rounded md:bg-transparent md:text-indigo-700 md:p-0 dark:bg-indigo-600 md:dark:bg-transparent transition duration-200 ease"
                                aria-current="page"
                            >
                                Publish
                            </Link>
                        )}
                        {props.current != "publish" && (
                            <Link
                                to="/publish"
                                className="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-indigo-700 md:p-0 transition duration-200 ease"
                                aria-current="page"
                            >
                                Publish
                            </Link>
                        )}
                    </li>
                    <li>
                        {!userSelector.user.loggedIn && <LoginButton />}
                        {userSelector.user.loggedIn && <LogoutButton />}
                    </li>
                </ul>
            </div>
        </header>
    );
};

export default NavigationBar;
