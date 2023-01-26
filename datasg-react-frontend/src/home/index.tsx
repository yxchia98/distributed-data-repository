import { useState, useEffect } from "react";
import axios, { AxiosRequestConfig } from "axios";
import NavigationBar from "../common/NavigationBar";
import MainCard from "./MainCard";
import AgencyCard from "./AgencyCard";
import OfferingCard from "./OfferingCard";
import GetStartedCard from "./GetStartedCard";
import FooterCard from "./FooterCard";
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
    const [user, setUser] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [login, setLogin] = useState(false);
    const [isRegistered, setIsRegistered] = useState<boolean>(false);

    const fetchUser = async () => {
        // check if user is logged in
        const configurationObject: AxiosRequestConfig = {
            method: "get",
            url: `${process.env.REACT_APP_DATA_WRITER_API_URL}auth/login/success`,
            headers: {},
            withCredentials: true,
        };
        let response: CurrentUserResponse = { error: false, message: "", userId: "", email: "" };
        try {
            response = (await axios(configurationObject)).data;
            console.log(response);
            if (!response.error) {
                console.log(response.userId);
                console.log(response.email);
                setUser(response.userId);
                setUserEmail(response.email);
                setLogin(true);
            }
            return;
        } catch (error: any) {
            console.log(error.message);
            return false;
        }
    };
    const checkRegistered = async () => {
        // check if user is already registered in db
        let response: RegisteredUserResponse = { error: false, message: "", data: null };
        try {
            const configurationObject: AxiosRequestConfig = {
                method: "get",
                url: `${process.env.REACT_APP_DATA_READER_API_URL}profile/user`,
                headers: {},
                params: { user_id: user },
                withCredentials: true,
            };
            response = await axios(configurationObject);
            console.log(response.data);
            setIsRegistered(response.data ? true : false);
            return;
        } catch (error: any) {
            setIsRegistered(false);
            console.log(error.message);
            return false;
        }
    };

    const checkLoginAndRegistered = async () => {
        if (user && isRegistered) {
            console.log("logged in and registered");
        } else if (user && !isRegistered) {
            console.log("logged in but not registered yet. Redirecting to register page...");
        } else {
            console.log("not logged in nor registered");
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    useEffect(() => {
        checkRegistered();
    }, [user]);

    useEffect(() => {
        checkLoginAndRegistered();
    }, [checkRegistered]);

    const googleAuth = async () => {
        window.open(`${process.env.REACT_APP_DATA_WRITER_API_URL}auth/google`, "_self");
    };

    const googleLogout = async () => {
        window.open(`${process.env.REACT_APP_DATA_WRITER_API_URL}auth/logout`, "_self");
    };

    return (
        <div className="home">
            <NavigationBar login={googleAuth} logout={googleLogout} />
            <MainCard login={login} />
            <AgencyCard />
            <OfferingCard />
            <GetStartedCard login={login} />
            <FooterCard />
        </div>
    );
};

export default Home;
