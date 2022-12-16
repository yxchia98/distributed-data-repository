import { useState, useEffect } from "react";
import axios from "axios";
import "bulma/css/bulma.min.css";

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
        window.open(
            `${process.env.REACT_APP_DATA_WRITER_API_URL}auth/google`,
            "_self"
        );
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
        window.open(
            `${process.env.REACT_APP_DATA_WRITER_API_URL}auth/logout`,
            "_self"
        );
    };

    return (
        <div className="columns">
            <div className="column">
                <h1>HOME PAGE</h1>
                {!login && (
                    <button className="button is-primary" onClick={googleAuth}>
                        Sign in with google
                    </button>
                )}
                {login && (
                    <button className="button is-danger" onClick={googleLogout}>
                        Logout
                    </button>
                )}
                <button className="button is-info" onClick={fetchUser}>
                    Check!
                </button>
            </div>
        </div>
    );
};

export default Home;
