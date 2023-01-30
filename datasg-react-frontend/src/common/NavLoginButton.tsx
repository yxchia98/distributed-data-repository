import axios from "axios";
import { googleAuth } from "./googleAuth";

interface LoginButtonProps {
    buttonFunction: () => {};
}

interface UserProps {
    setUser: React.Dispatch<React.SetStateAction<string>>;
    setLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

interface CurrentUser {
    error: boolean;
    message: string;
    user_id: string;
}
const LoginButton: React.FC = () => {
    return (
        <button
            className="h-8 w-16 self-center text-xs border border-indigo-500 bg-indigo-500 text-white rounded-md px-4 transition duration-300 ease select-none hover:bg-indigo-600 focus:outline-none focus:shadow-outline"
            onClick={googleAuth}
        >
            Login
        </button>
    );
};

export default LoginButton;
