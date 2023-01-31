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
    return (
        <div className="register bg-gray-100 h-screen">
            <NavigationBar current="register" />
            <RegisterForm />
        </div>
    );
};

export default Register;
