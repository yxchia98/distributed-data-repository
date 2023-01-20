import { useState, useEffect } from "react";
import axios from "axios";
import NavigationBar from "../common/NavigationBar";
import MainCard from "./MainCard";
import AgencyCard from "./AgencyCard";
import OfferingCard from "./OfferingCard";
import GetStartedCard from "./GetStartedCard";
import FooterCard from "./FooterCard";
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
            <MainCard login={login} />
            <AgencyCard />
            <OfferingCard />
            <GetStartedCard login={login} />
            <FooterCard />
        </div>
    );
};

export default Home;
