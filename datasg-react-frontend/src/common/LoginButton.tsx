import axios from "axios";

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
