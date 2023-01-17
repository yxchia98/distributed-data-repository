import { useState, useEffect } from "react";
import axios from "axios";
// axios.defaults.withCredentials = true;

interface currentUser {
    error: boolean;
    message: string;
    user_id: string;
}

const Home = () => {
    const [user, setUser] = useState("");
    const [login, setLogin] = useState(false);
    const fetchUser = async () => {
        const configurationObject = {
            method: "get",
            url: `${process.env.REACT_APP_DATA_WRITER_API_URL}auth/login/success`,
            headers: {},
            withCredentials: true,
        };
        let response: currentUser = { error: false, message: "", user_id: "" };
        try {
            response = await axios(configurationObject);
            console.log(response);
            if (!response.error) {
                setUser(response.user_id);
                setLogin(true);
            }
            return;
        } catch (err: any) {
            console.log(err.response.data);
            return false;
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const googleAuth = async () => {
        window.open(`${process.env.REACT_APP_DATA_WRITER_API_URL}auth/google`, "_self");
        // const configurationObject = {
        //     method: "get",
        //     url: `${process.env.REACT_APP_DATA_WRITER_API_URL}auth/google`,
        //     headers: {},
        // };
        // try {
        //     await axios(configurationObject);
        //     return;
        // } catch (err: any) {
        //     console.log(err.response.data);
        //     return false;
        // }
    };

    const googleLogout = async () => {
        window.open(`${process.env.REACT_APP_DATA_WRITER_API_URL}auth/logout`, "_self");
    };

    return (
        <div className="columns">
            <div className="column">
                <h1>HOME PAGE</h1>
                {!login && (
                    <button
                        className="border border-indigo-500 bg-indigo-500 text-white rounded-md px-4 py-2 m-2 transition duration-500 ease select-none hover:bg-indigo-600 focus:outline-none focus:shadow-outline"
                        onClick={googleAuth}
                    >
                        Sign in with google
                    </button>
                )}
                {login && (
                    <button
                        className="border border-red-500 bg-red-500 text-white rounded-md px-4 py-2 m-2 transition duration-500 ease select-none hover:bg-red-600 focus:outline-none focus:shadow-outline"
                        onClick={googleLogout}
                    >
                        Logout
                    </button>
                )}
                <button
                    className="border border-gray-200 bg-gray-200 text-gray-700 rounded-md px-4 py-2 m-2 transition duration-500 ease select-none hover:bg-gray-300 focus:outline-none focus:shadow-outline"
                    onClick={fetchUser}
                >
                    Check!
                </button>
            </div>
        </div>
    );
};

export default Home;
