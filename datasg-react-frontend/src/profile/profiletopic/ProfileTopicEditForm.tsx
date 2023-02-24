import { Dialog, Tab, Transition } from "@headlessui/react";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { Dispatch, Fragment, SetStateAction, useEffect, useState } from "react";
import { IconContext } from "react-icons";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";
import { CgSpinner } from "react-icons/cg";
import { FaRegSave } from "react-icons/fa";
import { FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import { AccessDetail } from "../../redux/accessSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchCurrentTopicAccess, TopicDetails } from "../../redux/topicSlice";
import ProfileTopicEditFailureModal from "./ProfileTopicEditFailureModal";
import ProfileTopicEditSuccessModal from "./ProfileTopicEditSuccessModal";
import ProfileTopicRemoveAccessModal from "./ProfileTopicRemoveAccessModal";

interface ProfileTopicEditFormProps {
    currentTopic: TopicDetails;
    handleCloseModal: () => void;
    setCurrentTopicDetails: React.Dispatch<React.SetStateAction<TopicDetails>>;
}

interface UpdateTopicResponseType {
    error: boolean;
    message: string;
}

const ProfileTopicEditForm: React.FC<ProfileTopicEditFormProps> = (props) => {
    const dispatch = useAppDispatch();
    const agenciesSelector = useAppSelector((state) => state.agencies);
    const topicsSelector = useAppSelector((state) => state.topics);
    const userSelector = useAppSelector((state) => state.user);

    // loading states
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSubmittable, setIsSubmittable] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [showSubmitError, setShowSubmitError] = useState<boolean>(false);
    const [showSubmitSuccess, setShowSubmitSuccess] = useState<boolean>(false);

    // data states
    const [topicName, setTopicName] = useState<string>("");
    const [agencyId, setAgencyId] = useState<string>("");
    const [topicDesc, setTopicDesc] = useState<string>("");
    const [topicNameError, setTopicNameError] = useState<boolean>(false);
    const [agencyIdError, setAgencyIdError] = useState<boolean>(false);
    const [topicDescError, setTopicDescError] = useState<boolean>(false);
    const [submitModalTitle, setSubmitModalTitle] = useState<string>("");
    const [submitModalMessage, setSubmitModalMessage] = useState<string>("");
    const [submitModalCloseMessage, setSubmitModalCloseMessage] = useState<string>("");

    const validifyForm = () => {
        // check topic name field
        const isTopicNameValid = /^[\w\-\s]+$/.test(topicName);
        isTopicNameValid ? setTopicNameError(false) : setTopicNameError(true);
        agencyId.length > 0 ? setAgencyIdError(false) : setAgencyIdError(true);
        if (
            isTopicNameValid &&
            agencyId.length > 0 &&
            (topicName != topicsSelector.currentTopic.topic_name ||
                agencyId != topicsSelector.currentTopic.agency_id ||
                topicDesc != topicsSelector.currentTopic.description)
        ) {
            setIsSubmittable(true);
            return true;
        }
        setIsSubmittable(false);
        return false;
    };

    const handleTopicNameOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTopicName(e.target.value);
    };

    const handleAgencyOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setAgencyId(e.target.value);
    };

    const handleTopicDescOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTopicDesc(e.target.value);
    };

    const closeSubmitSuccessModal = () => {
        setShowSubmitSuccess(false);
        validifyForm();
        return;
    };

    const closeSubmitErrorModal = () => {
        setShowSubmitError(false);
    };

    // sends PUT request to data writer API to update topic
    const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // 👈️ prevent page refresh
        setIsSubmitting(true);
        console.log("submitting...");
        const updateTopicFormData: FormData = new FormData();
        updateTopicFormData.append("topic_id", topicsSelector.currentTopic.topic_id);
        updateTopicFormData.append("user_id", topicsSelector.currentTopic.user_id);
        updateTopicFormData.append("agency_id", agencyId);
        updateTopicFormData.append("topic_name", topicName);
        updateTopicFormData.append("description", topicDesc);

        // check for form data
        // for (var key of Array.from(updateTopicFormData.entries())) {
        //     console.log(key[0] + ", " + key[1]);
        // }

        // construct API request
        const updateTopicConfigObject: AxiosRequestConfig = {
            method: "put",
            url: `${process.env.REACT_APP_DATA_WRITER_API_URL}topic/update`,
            data: updateTopicFormData,
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        };
        try {
            // send request
            const updateTopicResponse: AxiosResponse<UpdateTopicResponseType> = await axios(
                updateTopicConfigObject
            );
            setIsSubmitting(false);
            if (updateTopicResponse.data.error) {
                // format error modal
                setSubmitModalTitle(`Error`);
                setSubmitModalMessage(
                    `Oops, there was an error updating  ${props.currentTopic.topic_name}...`
                );
                setSubmitModalCloseMessage(`Got it`);
                setShowSubmitSuccess(false);
                setShowSubmitError(true);
                return false;
            }
            // format success modal
            setSubmitModalTitle(`Success`);
            setSubmitModalMessage(
                `Hooray! your topic details for ${props.currentTopic.topic_name} has been successfully updated and saved`
            );
            setSubmitModalCloseMessage(`yay!`);
            setShowSubmitSuccess(true);
            setShowSubmitError(false);
            props.setCurrentTopicDetails({
                ...props.currentTopic,
                topic_name: topicName,
                description: topicDesc,
                agency_id: agencyId,
            });
            return true;
        } catch (error: any) {
            // format error modal
            setSubmitModalTitle(`Error`);
            setSubmitModalMessage(
                `Oops, there was an error updating  ${props.currentTopic.topic_name}...`
            );
            setSubmitModalCloseMessage(`Got it`);
            setIsSubmitting(false);
            setShowSubmitSuccess(false);
            setShowSubmitError(true);
            return;
        }
    };

    useEffect(() => {
        setTopicName(topicsSelector.currentTopic.topic_name);
        setAgencyId(topicsSelector.currentTopic.agency_id);
        setTopicDesc(topicsSelector.currentTopic.description);
    }, [topicsSelector.currentTopic]);

    return (
        <div className="h-full w-full justify-center items-center">
            <ProfileTopicEditSuccessModal
                title={submitModalTitle}
                message={submitModalMessage}
                closeMessage={submitModalCloseMessage}
                isOpen={showSubmitSuccess}
                handleCloseModal={closeSubmitSuccessModal}
            />
            <ProfileTopicEditFailureModal
                title={submitModalTitle}
                message={submitModalMessage}
                closeMessage={submitModalCloseMessage}
                isOpen={showSubmitError}
                handleCloseModal={closeSubmitErrorModal}
            />
            <form className="w-full h-full" onSubmit={handleOnSubmit}>
                <div className="w-full h-full grid grid-cols-6 grid-rows-3 gap-2">
                    <div className="col-span-2 p-4">
                        <label className="block font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            name="first-name"
                            id="first-name"
                            value={topicName}
                            onChange={handleTopicNameOnChange}
                            onBlur={validifyForm}
                            className={`mt-1 block w-full rounded-md bg-white ${
                                topicNameError ? "border-red-500" : "border-gray-300"
                            } shadow-sm focus:ring-0 disabled:text-gray-500`}
                        />
                    </div>
                    <div className="col-span-4 p-4">
                        <label className="block font-medium text-gray-700">Agency</label>
                        <select
                            name="first-name"
                            id="first-name"
                            value={agencyId}
                            onChange={handleAgencyOnChange}
                            onBlur={validifyForm}
                            className={`mt-1 block w-full rounded-md bg-white ${
                                agencyIdError ? "border-red-500" : "border-gray-300"
                            } shadow-sm focus:ring-0 disabled:text-gray-500`}
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
                    <div className="col-span-6 p-4 row-span-2">
                        <label className="block font-medium text-gray-700">Description</label>
                        <textarea
                            name="first-name"
                            id="first-name"
                            value={topicDesc}
                            onChange={handleTopicDescOnChange}
                            onBlur={validifyForm}
                            rows={2}
                            className={`mt-1 block w-full rounded-md bg-white ${
                                topicDescError ? "border-red-500" : "border-gray-300"
                            } shadow-sm focus:ring-0 disabled:text-gray-500`}
                        />
                    </div>
                </div>
                <div className="flex justify-center items-center">
                    <button
                        type="button"
                        className="m-2 inline-flex justify-center items-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                        onClick={props.handleCloseModal}
                    >
                        Cancel
                    </button>
                    {!isSubmitting && (
                        <button
                            type="submit"
                            disabled={!isSubmittable}
                            className="m-2 inline-flex justify-center items-center gap-2 rounded-md border border-transparent bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-600 active:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 disabled:bg-indigo-300"
                        >
                            <IconContext.Provider
                                value={{
                                    size: "1.5em",
                                    // color: "rgb(107 114 128)",
                                }}
                            >
                                <div className="">
                                    <FaRegSave />
                                </div>
                            </IconContext.Provider>
                            Save
                        </button>
                    )}
                    {isSubmitting && (
                        <button
                            type="submit"
                            disabled={!isSubmittable}
                            className="m-2 inline-flex justify-center items-center gap-2 rounded-md border border-transparent bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-600 active:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 disabled:bg-indigo-300"
                        >
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
                            Save
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};
export default ProfileTopicEditForm;
