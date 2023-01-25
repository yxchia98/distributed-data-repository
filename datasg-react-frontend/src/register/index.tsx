import axios from "axios";
import { useState, useEffect } from "react";
import NavigationBar from "../common/NavigationBar";
import RegisterForm from "./RegisterForm";

interface CurrentUserResponse {
    error: boolean;
    message: string;
    userId: string;
    email: string;
}

const Register: React.FC = (props) => {
    const [user, setUser] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [login, setLogin] = useState(false);
    const fetchUser = async () => {
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
                setUser(response.userId);
                setUserEmail(response.email);
                setLogin(true);
            }
            return;
        } catch (error: any) {
            console.log(error.response.data);
            return false;
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);
    const onClick = () => {
        console.log("button clicked!");
    };
    const googleAuth = async () => {
        window.open(`${process.env.REACT_APP_DATA_WRITER_API_URL}auth/google`, "_self");
    };

    const googleLogout = async () => {
        window.open(`${process.env.REACT_APP_DATA_WRITER_API_URL}auth/logout`, "_self");
    };
    return (
        <div className="register">
            <NavigationBar login={googleAuth} logout={googleLogout} />
            <RegisterForm userId={user} email={userEmail} />
            <p>{user}</p>
        </div>
    );
};

export default Register;
