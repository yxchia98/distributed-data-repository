import axios, { AxiosRequestConfig } from "axios";
import { useEffect, useState } from "react";

interface RegisterFormProps {
    userId: string;
    email: string;
}

interface RegisterUser {
    user_id: string;
    first_name: string;
    last_name: string;
    email: string;
    contact: string;
    agency_id: string;
}

interface AgencyDetailsResponse {
    error: boolean;
    message: string;
    data: Array<any>;
}

interface AgencyDetails {
    agency_id: string;
    short_name: string;
    long_name: string;
}

const RegisterForm: React.FC<RegisterFormProps> = (props) => {
    const [firstName, setFirstName] = useState<string>("");
    const [firstNameError, setFirstNameError] = useState<boolean>(false);
    const [lastName, setLastName] = useState<string>("");
    const [lastNameError, setLastNameError] = useState<boolean>(false);
    const [contact, setContact] = useState<string>("");
    const [contactError, setContactError] = useState<boolean>(false);
    const [agency, setAgency] = useState<string>("");
    const [agencyError, setAgencyError] = useState<boolean>(false);
    const [agencies, setAgencies] = useState<Array<any> | Array<null>>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const retrieveAgencyDetails = async () => {
        console.log("retrieving agency details...");
        let response: AgencyDetailsResponse = { error: false, message: "", data: [] };
        try {
            const configurationObject: AxiosRequestConfig = {
                method: "get",
                url: `${process.env.REACT_APP_DATA_READER_API_URL}profile/agencies`,
                headers: {},
                withCredentials: true,
            };
            response = (await axios(configurationObject)).data;
            setAgencies(response.data);
            return;
        } catch (error: any) {
            console.log(error.response.data);
            return false;
        }
    };

    const handleFirstNameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setFirstName(e.target.value);
        return;
    };

    const handleLastNameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setLastName(e.target.value);
        return;
    };

    const handleContactChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setContact(e.target.value);
        return;
    };

    const handleAgencyChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        setAgency(e.target.value);
        return;
    };

    const handleFirstNameBlur = async () => {
        if (firstName) {
            setFirstNameError(false);
        } else {
            setFirstNameError(true);
        }
        return;
    };

    const handleLastNameBlur = async () => {
        if (lastName) {
            setLastNameError(false);
        } else {
            setLastNameError(true);
        }
        return;
    };

    const handleContactBlur = async () => {
        if (contact.length >= 8 && !isNaN(parseFloat(contact))) {
            setContactError(false);
        } else {
            setContactError(true);
        }
        return;
    };

    const handleAgencyBlur = async () => {
        if (agency) {
            setAgencyError(false);
        } else {
            setAgencyError(true);
        }
        return;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        setLoading(true);
        console.log("checking form...");
        e.preventDefault(); // 👈️ prevent page refresh

        const user: RegisterUser = {
            user_id: props.userId,
            first_name: firstName,
            last_name: lastName,
            contact: contact,
            email: props.email,
            agency_id: agency,
        };

        console.log(user);

        if (
            user.user_id &&
            user.first_name &&
            user.last_name &&
            user.contact &&
            user.email &&
            user.agency_id
        ) {
            // register user using POST request
            console.log("submitting...");
            try {
                const configurationObject: AxiosRequestConfig = {
                    method: "POST",
                    url: `${process.env.REACT_APP_DATA_WRITER_API_URL}profile/user`,
                    headers: {},
                    data: user,
                    withCredentials: true,
                };
                const response = await axios(configurationObject);
                console.log(response.data);
            } catch (error: any) {
                console.log(error.response.data);
                return false;
            }
        } else {
            // dont submit and recheck all fields for errors
            setLastNameError(lastName ? false : true);
            setFirstNameError(firstName ? false : true);
            setAgencyError(agency ? false : true);
            setContactError(contact.length >= 8 && !isNaN(parseFloat(contact)) ? false : true);
        }
        setLoading(false);
        return;
    };
    // @ts-ignore
    const delay = (ms) => new Promise((res) => setTimeout(res, ms));

    useEffect(() => {
        retrieveAgencyDetails();
    }, []);
    return (
        <div className="p-[2.5%] mx-[15%] my-[2%] flex flex-col overflow-hidden bg-white items-center bg-local bg-origin-content shadow-lg">
            <div className="font-semibold text-3xl pb-8"> Register for an Account </div>
            <form className="w-full max-w-lg" onSubmit={handleSubmit}>
                <div className="flex flex-wrap -mx-3 mb-6">
                    {/* First Name input field */}
                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                            First Name *
                        </label>
                        {!firstNameError && (
                            <input
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white transition duration-300"
                                id="grid-first-name"
                                type="text"
                                placeholder="Jane"
                                value={firstName}
                                onBlur={handleFirstNameBlur}
                                onChange={handleFirstNameChange}
                            />
                        )}
                        {firstNameError && (
                            <input
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 outline-red-500 focus:ring-red-500 focus:border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white transition duration-300"
                                id="grid-first-name"
                                type="text"
                                placeholder="Jane"
                                value={firstName}
                                onBlur={handleFirstNameBlur}
                                onChange={handleFirstNameChange}
                            />
                        )}
                        {/* <p className="text-red-500 text-xs italic">Please fill out this field.</p> */}
                    </div>
                    {/* last name input field */}
                    <div className="w-full md:w-1/2 px-3">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                            Last Name *
                        </label>
                        {!lastNameError && (
                            <input
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 transition duration-300"
                                id="grid-last-name"
                                type="text"
                                placeholder="Doe"
                                value={lastName}
                                onBlur={handleLastNameBlur}
                                onChange={handleLastNameChange}
                            />
                        )}
                        {lastNameError && (
                            <input
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 outline-red-500 focus:ring-red-500 focus:border-red-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white transition duration-300"
                                id="grid-last-name"
                                type="text"
                                placeholder="Doe"
                                value={lastName}
                                onBlur={handleLastNameBlur}
                                onChange={handleLastNameChange}
                            />
                        )}
                    </div>
                </div>
                <div className="flex flex-wrap -mx-3 mb-6">
                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                            Contact Information *
                        </label>
                        {!contactError && (
                            <input
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white transition duration-300 invalid:border-red-500"
                                id="grid-first-name"
                                type="text"
                                inputMode="numeric"
                                placeholder="8-digit mobile number"
                                value={contact}
                                onBlur={handleContactBlur}
                                onChange={handleContactChange}
                            />
                        )}
                        {contactError && (
                            <input
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 outline-red-500 focus:ring-red-500 focus:border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white transition duration-300 invalid:border-red-500"
                                id="grid-first-name"
                                type="text"
                                inputMode="numeric"
                                placeholder="8-digit mobile number"
                                value={contact}
                                onBlur={handleContactBlur}
                                onChange={handleContactChange}
                            />
                        )}
                    </div>
                    <div className="w-full md:w-1/2 px-3">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                            Agency *
                        </label>
                        <div className="relative">
                            {!agencyError && (
                                <select
                                    className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 transition duration-300"
                                    value={agency}
                                    onChange={handleAgencyChange}
                                    onBlur={handleAgencyBlur}
                                >
                                    <option key="" value="">
                                        select an option
                                    </option>
                                    {agencies.map((agency: any) => (
                                        <option key={agency.agency_id} value={agency.agency_id}>
                                            {agency.short_name}
                                        </option>
                                    ))}
                                </select>
                            )}
                            {agencyError && (
                                <select
                                    className="block appearance-none w-full bg-gray-200 border border-red-500 outline-red-500 focus:ring-red-500 focus:border-red-500 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white transition duration-300"
                                    value={agency}
                                    onChange={handleAgencyChange}
                                    onBlur={handleAgencyBlur}
                                >
                                    <option key="" value="">
                                        select an option
                                    </option>
                                    {agencies.map((agency: any) => (
                                        <option key={agency.agency_id} value={agency.agency_id}>
                                            {agency.short_name}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex flex-wrap -mx-3 mb-3">
                    <div className="w-full px-3">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                            Email *
                        </label>
                        {props.email && (
                            <input
                                className="appearance-none block w-full bg-gray-200 text-gray-600 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 transition duration-300"
                                type="text"
                                value={props.email}
                                placeholder="Please login with work email"
                                disabled={true}
                            />
                        )}
                        {!props.email && (
                            <input
                                className="appearance-none block w-full bg-gray-200 text-gray-600 border  border-red-500 outline-red-500 focus:ring-red-500 focus:border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white transition duration-300"
                                type="text"
                                value={props.email}
                                placeholder="Please login with work email"
                                disabled={true}
                            />
                        )}
                    </div>
                </div>
                <p className="text-red-500 text-xs italic mb-3">* indicates a required field.</p>
                <div className="flex flex-wrap -mx-3 mb-6">
                    {loading && (
                        <button
                            type="submit"
                            className=" w-full h-12 px-3 border flex flex-row justify-center items-center border-indigo-500 bg-indigo-500 text-white text-lg text-center rounded-md transition duration-300 ease select-none hover:bg-indigo-600 focus:outline-none focus:shadow-outline"
                        >
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                                className="animate-spin fill-white mr-2"
                            >
                                <path
                                    d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
                                    opacity=".25"
                                />
                                <path d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z" />
                            </svg>
                            Registering...
                        </button>
                    )}
                    {!loading && (
                        <button
                            type="submit"
                            className="w-full h-12 px-3 border flex flex-row justify-center items-center border-indigo-500 bg-indigo-500 text-white text-lg text-center rounded-md transition duration-300 ease select-none hover:bg-indigo-600 focus:outline-none focus:shadow-outline"
                        >
                            Register
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default RegisterForm;