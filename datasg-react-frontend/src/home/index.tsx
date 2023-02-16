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
    const [message, setMessage] = useState<string>("HI LIONEL");

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
