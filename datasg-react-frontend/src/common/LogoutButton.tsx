import axios from "axios";

const googleLogout = async () => {
    window.open(`${process.env.REACT_APP_DATA_WRITER_API_URL}auth/logout`, "_self");
};
const LogoutButton: React.FC = () => {
    return (
        <button
            className="h-8 w-16 self-center text-xs text-center border border-red-500 bg-red-500 text-white rounded-md px-2 transition duration-300 ease select-none hover:bg-red-600 focus:outline-none focus:shadow-outline"
            onClick={googleLogout}
        >
            Logout
        </button>
    );
};

export default LogoutButton;
