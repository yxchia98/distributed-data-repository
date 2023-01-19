import { useState, useEffect } from "react";
import axios from "axios";
import NavigationBar from "../common/NavigationBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid, regular, brands, icon } from "@fortawesome/fontawesome-svg-core/import.macro"; // <-- import styles to be used
import MainCard from "./MainCard";
import AgencyCard from "./AgencyCard";
import OfferingCard from "./OfferingCard";
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
            {/* <div className="max-w py-20 px-2 mx-2 my-2 overflow-hidden bg-white flex justify-center bg-local bg-origin-content shadow-lg">
                <div className="px-6 py-2">
                    <div className="font-bold mb-2 pb-4 xl:text-6xl md:text-4xl sm:text-2xl text-gray-700">
                        Efficiently share Data <br /> across Agencies. <br /> Transparently.
                    </div>
                    <div className="">
                        <button className="h-12 self-center text-sm-bold border border-indigo-500 bg-indigo-500 text-white rounded-md px-4 transition duration-300 ease select-none hover:bg-indigo-600 focus:outline-none focus:shadow-outline">
                            Get Started
                            <FontAwesomeIcon
                                className="pl-2.5 ease-in-out"
                                icon={solid("arrow-right")}
                            />{" "}
                        </button>
                    </div>
                </div>
                <div className="xl:w-[50%] xl:-translate-x-20 md:w-[60%] md:-translate-x-12">
                    <img src="/img/DDR-landing-image.png"></img>
                </div>
            </div> */}
            <MainCard />
            <AgencyCard />
            <OfferingCard />
        </div>
    );
};

export default Home;
