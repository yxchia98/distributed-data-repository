import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { useState, useEffect } from "react";
import { IconContext } from "react-icons";
import { BiEdit } from "react-icons/bi";
import { FaRegSave } from "react-icons/fa";
import { CgSpinner } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import { fetchAgencies } from "../../redux/agencySlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchTopics } from "../../redux/topicSlice";
import ProfileDetailSuccessModal from "./ProfileDetailSuccessModal";
import ProfileDetailFailureModal from "./ProfileDetailFailureModal";
import { setDetails } from "../../redux/userSlice";

interface UpdateProfileResponseType {
    error: boolean;
    message: string;
}

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
    const [errorMessage, setErrorMessage] = useState<string>("Error updating profile...");
    const [successMessage, setSuccessMessage] = useState<string>("Successfully updated profile!");

    // field error states
    const [firstNameError, setFirstNameError] = useState<boolean>(false);
    const [lastNameError, setLastNameError] = useState<boolean>(false);
    const [emailError, setEmailError] = useState<boolean>(false);
    const [contactError, setContactError] = useState<boolean>(false);
    const [agencyError, setAgencyError] = useState<boolean>(false);

    const fetchProfileDataRedux = () => {
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

    const closeSuccessModal = () => {
        fetchProfileDataRedux();
        setIsSubmitted(false);
    };

    const closeFailureModal = () => {
        setIsErrorSubmitting(false);
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
        const isFormValid = validifyForm();
        console.log(isFormValid);
        if (!isFormValid) {
            setIsErrorSubmitting(true);
            setErrorMessage("Please ensure all fields are filled up correctly.");
            return;
        }
        // update values and send post request
        const updateProfileFormData: FormData = new FormData();
        updateProfileFormData.append("user_id", userSelector.user.user_id);
        updateProfileFormData.append("first_name", firstName);
        updateProfileFormData.append("last_name", lastName);
        updateProfileFormData.append("email", email);
        updateProfileFormData.append("contact", contact);
        updateProfileFormData.append("agency_id", agency);

        const updateProfileConfigurationObject: AxiosRequestConfig = {
            method: "put",
            url: `${process.env.REACT_APP_DATA_WRITER_API_URL}profile/user`,
            data: updateProfileFormData,
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        };
        try {
            const updateProfileResponse: AxiosResponse<UpdateProfileResponseType> = await axios(
                updateProfileConfigurationObject
            );
            if (updateProfileResponse.data.error) {
                setErrorMessage(updateProfileResponse.data.message);
                setIsSubmitting(false);
                setIsErrorSubmitting(true);
                return;
            }
            console.log(updateProfileResponse);
            setSuccessMessage(updateProfileResponse.data.message);
            setIsSubmitting(false);
            setIsEditing(false);
            setIsSubmitted(true);
            // dispatch(setDetails({}))
        } catch (error: any) {
            setErrorMessage(error.message);
            setIsSubmitting(false);
            setIsErrorSubmitting(true);
            return;
        }
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

    // validify form's select dropdown list, as there are no onblur functionality for it
    useEffect(() => {
        validifyForm();
    }, [agency]);

    useEffect(() => {
        if (userSelector.status === "loading" || agenciesSelector.status === "loading") {
            setIsLoading(true);
            return;
        }
        setIsLoading(false);
        return;
    }, [userSelector, agenciesSelector]);

    useEffect(() => {
        fetchProfileDataRedux();
        resetFormFields();
    }, []);

    // fetch essential data
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
                                value={email}
                                className={`mt-1 block w-full rounded-md bg-gray-50 ${
                                    emailError ? "border-red-500" : "border-gray-300"
                                }  shadow-sm focus:ring-0 focus:border-gray-300 disabled:text-gray-500`}
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
                                className="mt-1 block w-full rounded-md bg-gray-50 border-gray-300 shadow-sm focus:ring-0 focus:border-gray-300 disabled:text-gray-500"
                            >
                                {agenciesSelector.agencies.map((agency: any) => {
                                    return (
                                        <option key={agency.agency_id} value={agency.agency_id}>
                                            {`${agency.long_name} (${agency.short_name})`}
                                        </option>
                                    );
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
                                    {isSubmitting && (
                                        <div className="pl-2">
                                            <IconContext.Provider
                                                value={{
                                                    size: "1.5em",
                                                    // color: "rgb(107 114 128)",
                                                }}
                                            >
                                                <div className="animate-spin">
                                                    <CgSpinner />
                                                </div>
                                            </IconContext.Provider>
                                        </div>
                                    )}
                                    {!isSubmitting && (
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
                                    )}

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
            <ProfileDetailSuccessModal
                title={"Successfully Updated!"}
                message={successMessage}
                closeMessage={`Yay!`}
                isOpen={isSubmitted}
                handleCloseModal={closeSuccessModal}
            />
            <ProfileDetailFailureModal
                title={"Whoops, something went wrong..."}
                message={errorMessage}
                closeMessage={`Got it`}
                isOpen={isErrorSubmitting}
                handleCloseModal={closeFailureModal}
            />
        </div>
    );
};

export default ProfileDetail;
