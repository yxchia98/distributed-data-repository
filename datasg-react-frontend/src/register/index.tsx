import axios from "axios";

const Register = () => {
    const fetchUser = async () => {
        // const configurationObject = {
        //     method: "post",
        //     url: `${baseURL}employees/login`,
        //     headers: {},
        //     data: {
        //         empEmail: email,
        //         empPassword: password,
        //     },
        // };
        let response = false;
    };
    const onClick = () => {
        console.log("button clicked!");
    };
    return (
        <div>
            <form>
                <div>
                    <label>email</label>
                    <input type="text" id="emailtextfield" />
                </div>
                <div>
                    <label>password</label>
                    <input type="text" id="passwordtextfield" />
                </div>
            </form>
            <button className="oauth-google-button" onClick={onClick}>
                Sign in with Google
            </button>
        </div>
    );
};

export default Register;
