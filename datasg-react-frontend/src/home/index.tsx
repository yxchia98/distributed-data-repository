import { useState, useEffect } from "react";
import axios, { AxiosRequestConfig } from "axios";
import NavigationBar from "../common/NavigationBar";
import MainCard from "./MainCard";
import AgencyCard from "./AgencyCard";
import OfferingCard from "./OfferingCard";
import GetStartedCard from "./GetStartedCard";
import FooterCard from "./FooterCard";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";

// axios.defaults.withCredentials = true;

interface CurrentUserResponse {
    error: boolean;
    message: string;
    userId: string;
    email: string;
}

interface RegisteredUserResponse {
    error: boolean;
    message: string;
    data: userData | null;
}
interface ResponseData {
    error: boolean;
    message: string;
}

interface userData {
    user_id: string;
    first_name: string;
    last_name: string;
    email: string;
    contact: string;
    agency_id: string;
}

const Home = () => {
    let navigate = useNavigate();
    // const [user, setUser] = useState("");
    // const [userEmail, setUserEmail] = useState("");
    // const [login, setLogin] = useState(false);
    const user = useAppSelector((state) => state.user);
    const loginStatus = useAppSelector((state) => state.user.user.loggedIn);
    const registeredStatus = useAppSelector((state) => state.user.user.registered);

    // const fetchUser = async () => {
    //     // check if user is logged in
    //     const configurationObject: AxiosRequestConfig = {
    //         method: "get",
    //         url: `${process.env.REACT_APP_DATA_WRITER_API_URL}auth/login/success`,
    //         headers: {},
    //         withCredentials: true,
    //     };
    //     let response: CurrentUserResponse = { error: false, message: "", userId: "", email: "" };
    //     try {
    //         response = (await axios(configurationObject)).data;
    //         console.log(response);
    //         if (!response.error) {
    //             console.log(response.userId);
    //             console.log(response.email);
    //             setUser(response.userId);
    //             setUserEmail(response.email);
    //             setLogin(true);
    //         }
    //         return;
    //     } catch (error: any) {
    //         console.log(error.message);
    //         return false;
    //     }
    // };
    // const checkRegistered = async () => {
    //     // check if user is already registered in db
    //     let response: RegisteredUserResponse = { error: false, message: "", data: null };
    //     if (!user) {
    //         return false;
    //     }
    //     try {
    //         const configurationObject: AxiosRequestConfig = {
    //             method: "get",
    //             url: `${process.env.REACT_APP_DATA_READER_API_URL}profile/user`,
    //             headers: {},
    //             params: { user_id: user },
    //             withCredentials: true,
    //         };
    //         // send get request to check if user is alreaady registered
    //         response = await axios(configurationObject);

    //         // redirect to register page if user not found
    //         if (!response.data && user) {
    //             return navigate("/register");
    //         }
    //         return true;
    //     } catch (error: any) {
    //         console.log(error.message);
    //         // redirect to register page if user not found
    //         if (user) {
    //             return navigate("/register");
    //         }
    //         return false;
    //     }
    // };

    // useEffect(() => {
    //     fetchUser();
    // }, []);

    // useEffect(() => {
    //     checkRegistered();
    // }, [user]);

    const googleAuth = async () => {
        window.open(`${process.env.REACT_APP_DATA_WRITER_API_URL}auth/google`, "_self");
    };

    const googleLogout = async () => {
        window.open(`${process.env.REACT_APP_DATA_WRITER_API_URL}auth/logout`, "_self");
    };

    return (
        <div className="home bg-gray-100 overflow-auto h-screen">
            {/* <NavigationBar login={googleAuth} logout={googleLogout} /> */}
            <NavigationBar current="home" />
            <MainCard login={loginStatus} />
            <AgencyCard />
            <OfferingCard />
            <GetStartedCard login={loginStatus} />
            <FooterCard />
        </div>
    );
};

export default Home;
