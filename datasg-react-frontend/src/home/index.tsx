import { useState, useEffect } from "react";
import axios from "axios";
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
interface ResponseData {
    error: boolean;
    message: string;
}

const Home = () => {
    const [user, setUser] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [login, setLogin] = useState(false);
    const [isRegistered, setIsRegistered] = useState<boolean>(false);

    const fetchUser = async () => {
        // check if user is logged in
        const configurationObject = {
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
        } catch (err: any) {
            console.log(err.response.data);
            return false;
        }
    };
    const checkRegistered = async () => {
        // check if user is already registered in db
        try {
        } catch (error: any) {
            console.log(error);
            return false;
        }
        console.log("firing after fetching user");
        return;
    };

    useEffect(() => {
        fetchUser();
    }, []);

    useEffect(() => {
        checkRegistered();
    }, [user]);

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
