export const googleLogout = async () => {
    window.open(`${process.env.REACT_APP_DATA_WRITER_API_URL}auth/logout`, "_self");
};
export const googleAuth = async () => {
    window.open(`${process.env.REACT_APP_DATA_WRITER_API_URL}auth/google`, "_self");
};
