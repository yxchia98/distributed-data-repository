import axios from "axios";
import { useState, useEffect } from "react";
import { IconContext } from "react-icons";
import { BiEdit } from "react-icons/bi";
import { FaRegSave } from "react-icons/fa";
import { CgSpinner } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import { fetchAgencies } from "../../redux/agencySlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchTopics } from "../../redux/topicSlice";

const ProfileDetail: React.FC = (props) => {
    const dispatch = useAppDispatch();
    const userSelector = useAppSelector((state) => state.user);
    const agenciesSelector = useAppSelector((state) => state.agencies);
    // form input states
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [contact, setContact] = useState<string>("");
    const [agency, setAgency] = useState<string>("");

    // loading states
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isSubmittable, setIsSubmittable] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
    const [isErrorSubmitting, setIsErrorSubmitting] = useState<boolean>(false);

    // field error states
    const [firstNameError, setFirstNameError] = useState<boolean>(false);
    const [lastNameError, setLastNameError] = useState<boolean>(false);
    const [emailError, setEmailError] = useState<boolean>(false);
    const [contactError, setContactError] = useState<boolean>(false);
    const [agencyError, setAgencyError] = useState<boolean>(false);

    const fetchProfileDataRedux = () => {
        dispatch(fetchTopics());
        dispatch(fetchAgencies());
    };

    // change handlers
    const handleFirstNameOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFirstName(e.target.value);
    };

    const handleLastNameOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLastName(e.target.value);
    };

    const handleContactOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setContact(e.target.value);
    };

    const handleAgencyOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setAgency(e.target.value);
    };

    // button click handlers
    const handleEditButtonClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        validifyForm();
        setIsEditing(true);
    };
    const handleCancelButtonClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setIsEditing(false);
        resetFormFields();
    };
    const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // 👈️ prevent page refresh
        setIsSubmitting(true);

        // validify form
        validifyForm();
        if (firstNameError || lastNameError || contactError || emailError || agencyError) {
            setIsSubmitting(false);
            return;
        }
        // update values and send post request
    };

    const validifyForm = () => {
        // checks and set error states
        const isFirstNameValid = /^[\w\-\s]+$/.test(firstName);
        const isLastNameValid = /^[\w\-\s]+$/.test(lastName);
        const isContactValid = /^\d+$/.test(contact) && contact.length >= 8;
        isFirstNameValid ? setFirstNameError(false) : setFirstNameError(true);
        isLastNameValid ? setLastNameError(false) : setLastNameError(true);
        isContactValid ? setContactError(false) : setContactError(true);
        agency.length ? setAgencyError(false) : setAgencyError(true);
        email.length ? setEmailError(false) : setEmailError(true);
        const isValid = !(
            (firstName === userSelector.user.first_name &&
                lastName === userSelector.user.last_name &&
                contact === userSelector.user.contact &&
                email === userSelector.user.email &&
                agency === userSelector.user.agency_id) ||
            !isFirstNameValid ||
            !isLastNameValid ||
            !isContactValid
        );
        isValid ? setIsSubmittable(true) : setIsSubmittable(false);
        return isValid;
    };

    const resetFormFields = () => {
        setFirstName(userSelector.user.first_name);
        setLastName(userSelector.user.last_name);
        setEmail(userSelector.user.email);
        setContact(userSelector.user.contact);
        setAgency(userSelector.user.agency_id);
    };

    useEffect(() => {
        if (userSelector.status === "loading" || agenciesSelector.status === "loading") {
            setIsLoading(true);
            return;
        }
        setIsLoading(false);
        // set initial user details
        resetFormFields();

        return;
    }, [userSelector, agenciesSelector]);

    useEffect(() => {
        fetchProfileDataRedux();
    }, []);
    return (
        <div className="bg-gray-100 w-full h-full">
            {!isLoading && (
                <div className="w-full h-full">
                    <div className="w-full flex justify-center p-8">
                        <span className="text-3xl font-semibold">Profile Details</span>
                    </div>
                    {/* <span className="w-full">{JSON.stringify(userSelector)}</span> */}
                    <form className="grid grid-cols-6" onSubmit={handleOnSubmit}>
                        <div className="col-span-3 p-4">
                            <label className="block font-medium text-gray-700">First name</label>
                            <input
                                type="text"
                                name="first-name"
                                id="first-name"
                                disabled={!isEditing}
                                value={firstName}
                                onChange={handleFirstNameOnChange}
                                onBlur={validifyForm}
                                className={`mt-1 block w-full rounded-md bg-gray-50 ${
                                    firstNameError ? "border-red-500" : "border-gray-300"
                                } shadow-sm focus:ring-0 disabled:text-gray-500`}
                            />
                        </div>
                        <div className="col-span-3 p-4">
                            <label className="block font-medium text-gray-700">Last name</label>
                            <input
                                type="text"
                                name="last-name"
                                id="last-name"
                                disabled={!isEditing}
                                value={lastName}
                                onChange={handleLastNameOnChange}
                                onBlur={validifyForm}
                                className={`mt-1 block w-full rounded-md bg-gray-50 ${
                                    lastNameError ? "border-red-500" : "border-gray-300"
                                } shadow-sm focus:ring-0 disabled:text-gray-500`}
                            />
                        </div>
                        <div className="col-span-3 p-4">
                            <label className="block font-medium text-gray-700">Contact</label>
                            <input
                                type="text"
                                name="contact"
                                id="contact"
                                disabled={!isEditing}
                                value={contact}
                                onChange={handleContactOnChange}
                                onBlur={validifyForm}
                                className={`mt-1 block w-full rounded-md bg-gray-50 ${
                                    contactError ? "border-red-500" : "border-gray-300"
                                } shadow-sm focus:ring-0 disabled:text-gray-500`}
                            />
                        </div>
                        <div className="col-span-3 p-4">
                            <label className="block font-medium text-gray-700">Email</label>
                            <input
                                type="text"
                                name="email"
                                id="email"
                                disabled={true}
                                value={userSelector.user.email}
                                className="mt-1 block w-full rounded-md bg-gray-50 border-gray-300 shadow-sm focus:ring-0 focus:border-gray-300 disabled:text-gray-500"
                            />
                        </div>

                        <div className="col-span-6 p-4">
                            <label className="block font-medium text-gray-700">Agency</label>
                            <select
                                id="agency"
                                name="agency"
                                disabled={!isEditing}
                                value={agency}
                                onChange={handleAgencyOnChange}
                                onSelect={validifyForm}
                                onBlur={validifyForm}
                                className="mt-1 block w-full rounded-md bg-gray-50 border-gray-300 shadow-sm focus:ring-0 focus:border-gray-300 disabled:text-gray-500"
                            >
                                {agenciesSelector.agencies.map((agency: any) => {
                                    return (
                                        <option key={agency.agency_id} value={agency.agency_id}>
                                            {`${agency.long_name} (${agency.short_name})`}
                                        </option>
                                    );
                                    //                                     if (agency.agency_id === userSelector.user.agency_id) {
                                    // ;
                                    //                                     } else {
                                    //                                         return (
                                    //                                             <option key={agency.agency_id} value={agency.agency_id}>
                                    //                                                 {`${agency.long_name} (${agency.short_name})`}
                                    //                                             </option>
                                    //                                         );
                                    //                                     }
                                })}
                            </select>
                        </div>
                        {/* button behaviours */}
                        {!isEditing && (
                            <div className="col-span-6 p-12 flex justify-center items-center">
                                <button
                                    className="flex justify-center items-center p-4 bg-indigo-500 text-white rounded-lg shadow hover:bg-indigo-600 active:bg-indigo-700 transition"
                                    type="button"
                                    onClick={handleEditButtonClick}
                                >
                                    <IconContext.Provider
                                        value={{
                                            size: "1.5em",
                                            // color: "rgb(107 114 128)",
                                        }}
                                    >
                                        <div className="pl-2">
                                            <BiEdit />
                                        </div>
                                    </IconContext.Provider>

                                    <span className="px-2">Edit Details</span>
                                </button>
                            </div>
                        )}
                        {isEditing && (
                            <div className="col-span-6 p-12 flex justify-center items-center">
                                <button
                                    className="mx-2 flex justify-center items-center p-4 bg-white text-gray-700 rounded-lg shadow hover:bg-gray-100 active:bg-gray-200 transition"
                                    type="button"
                                    onClick={handleCancelButtonClick}
                                >
                                    <span className="px-2">Cancel</span>
                                </button>
                                <button
                                    className="mx-2 flex justify-center items-center p-4 bg-indigo-500 text-white rounded-lg shadow hover:bg-indigo-600 active:bg-indigo-700 transition disabled:bg-indigo-300"
                                    disabled={!isSubmittable}
                                    type="submit"
                                >
                                    <IconContext.Provider
                                        value={{
                                            size: "1.5em",
                                            // color: "rgb(107 114 128)",
                                        }}
                                    >
                                        <div className="pl-2">
                                            <FaRegSave />
                                        </div>
                                    </IconContext.Provider>

                                    <span className="px-2">Update Details</span>
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            )}
            {isLoading && (
                <div className="w-full h-full flex justify-center items-center">
                    <IconContext.Provider
                        value={{
                            size: "5em",
                        }}
                    >
                        <div className="mx-2 animate-spin text-indigo-700">
                            <CgSpinner />
                        </div>
                    </IconContext.Provider>
                </div>
            )}
        </div>
    );
};

export default ProfileDetail;
