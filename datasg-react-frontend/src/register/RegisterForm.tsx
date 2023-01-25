import axios from "axios";
import { useEffect, useState } from "react";

interface RegisterFormProps {
    userId: string;
    email: string;
}

interface RegisterUser {
    userId: string;
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
    const [firstNameError, setFirstNameError] = useState<boolean>(true);
    const [lastName, setLastName] = useState<string>("");
    const [lastNameError, setLastNameError] = useState<boolean>(false);
    const [contact, setContact] = useState<string>("");
    const [contactError, setContactError] = useState<boolean>(false);
    const [agency, setAgency] = useState<string>("");
    const [agencyError, setAgencyError] = useState<boolean>(false);
    const [agencies, setAgencies] = useState<Array<any> | Array<null>>([]);

    const googleAuth = async () => {
        window.open(`${process.env.REACT_APP_DATA_WRITER_API_URL}auth/google`, "_self");
    };

    const toExplorePage = async () => {
        console.log("navigating to explore data page");
    };

    const retrieveAgencyDetails = async () => {
        console.log("retrieving agency details...");
        let response: AgencyDetailsResponse = { error: false, message: "", data: [] };
        try {
            const configurationObject = {
                method: "get",
                url: `${process.env.REACT_APP_DATA_READER_API_URL}profile/agencies`,
                headers: {},
                withCredentials: true,
            };
            response = (await axios(configurationObject)).data;
            setAgencies(response.data);
        } catch (error: any) {
            console.log(error.response.data);
            return false;
        }
    };

    const handleFirstNameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setFirstName(e.target.value);
    };

    const handleLastNameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setLastName(e.target.value);
    };

    const handleContactChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setContact(e.target.value);
    };

    const handleAgencyChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        setAgency(e.target.value);
    };

    const handleFirstNameBlur = async () => {
        console.log("blurred!");
        if (firstName) {
            setFirstNameError(false);
        } else {
            setFirstNameError(true);
        }
        return;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        console.log("submitting...");
        e.preventDefault(); // 👈️ prevent page refresh

        const user: RegisterUser = {
            userId: props.userId,
            first_name: firstName,
            last_name: lastName,
            contact: contact,
            email: props.email,
            agency_id: agency,
        };

        console.log(user);

        if (
            user.userId &&
            user.first_name &&
            user.last_name &&
            user.contact &&
            user.email &&
            user.agency_id
        ) {
            // register user using POST request
        }

        const configurationObject = {
            method: "get",
            url: `${process.env.REACT_APP_DATA_READER_API_URL}/URLHERE`,
            headers: {},
            withCredentials: true,
        };
        return;
    };

    useEffect(() => {
        retrieveAgencyDetails();
    }, []);
    return (
        <div className="p-[2.5%] mx-[15%] my-[2%] flex flex-col overflow-hidden bg-white items-center bg-local bg-origin-content shadow-lg">
            <div className="font-semibold text-3xl pb-8"> Register for an Account </div>
            <form className="w-full max-w-lg" onSubmit={handleSubmit}>
                <div className="flex flex-wrap -mx-3 mb-6">
                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                            First Name *
                        </label>
                        {!firstNameError && (
                            <input
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white transition duration-250"
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
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 outline-red-500 focus:ring-red-500 focus:border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white transition duration-250"
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
                    <div className="w-full md:w-1/2 px-3">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                            Last Name *
                        </label>
                        <input
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 transition duration-250"
                            id="grid-last-name"
                            type="text"
                            placeholder="Doe"
                            onChange={handleLastNameChange}
                        />
                    </div>
                </div>
                <div className="flex flex-wrap -mx-3 mb-6">
                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                            Contact Information *
                        </label>
                        <input
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white transition duration-250 invalid:border-red-500"
                            id="grid-first-name"
                            type="text"
                            inputMode="numeric"
                            placeholder="8-digit mobile number"
                            onChange={handleContactChange}
                        />
                    </div>
                    <div className="w-full md:w-1/2 px-3">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                            Agency *
                        </label>
                        <div className="relative">
                            <select
                                className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 transition duration-250"
                                onChange={handleAgencyChange}
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
                        </div>
                    </div>
                </div>
                <div className="flex flex-wrap -mx-3 mb-3">
                    <div className="w-full px-3">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                            Email *
                        </label>
                        <input
                            className="appearance-none block w-full bg-gray-200 text-gray-600 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 transition duration-250"
                            type="text"
                            value={props.email}
                            placeholder="Agency Work Email"
                            disabled={true}
                        />
                    </div>
                </div>
                <p className="text-red-500 text-xs italic mb-3">* indicates a required field.</p>
                <div className="flex flex-wrap -mx-3 mb-6">
                    <button
                        type="submit"
                        className="w-full h-12 px-3 border border-indigo-500 bg-indigo-500 text-white rounded-md transition duration-300 ease select-none hover:bg-indigo-600 focus:outline-none focus:shadow-outline"
                    >
                        <p className="pr-1.5 text-lg"> Register </p>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RegisterForm;
