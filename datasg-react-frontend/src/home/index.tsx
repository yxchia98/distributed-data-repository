import { useState, useEffect } from "react";
import axios from "axios";
import NavigationBar from "../common/NavigationBar";
// axios.defaults.withCredentials = true;

interface CurrentUser {
    error: boolean;
    message: string;
    user_id: string;
}
interface ResponseData {
    error: boolean;
    message: string;
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
        let response: CurrentUser = { error: false, message: "", user_id: "" };
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
        <div className="home">
            <NavigationBar login={googleAuth} logout={googleLogout} />
            <div
                className="max-w px-2 mx-2 my-2 overflow-hidden bg-white flex bg-local bg-origin-content p-12"
                style={{
                    backgroundImage: `url(${
                        process.env.REACT_APP_PUBLIC_URL + "/img/DDR-landing-image.png"
                    })`,
                    backgroundRepeat: `no-repeat`,
                    backgroundSize: `contain`,
                    backgroundPositionX: `right`,
                }}
            >
                <div className="px-6 py-4">
                    <div className="font-bold text-5xl mb-2 pt-24 pb-48">
                        Efficiently share Data <br /> across Agencies. <br /> Transparently.
                    </div>
                    {/* <img
                        className="w-full"
                        src="/img/DDR-landing-image.png"
                        alt="landing page image"
                    /> */}
                </div>
            </div>
        </div>
    );
};

export default Home;
