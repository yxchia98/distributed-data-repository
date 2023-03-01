import { Dialog, RadioGroup, Transition } from "@headlessui/react";
import { Dispatch, Fragment, SetStateAction, useEffect, useRef, useState } from "react";
import { TopicDetails } from "../redux/topicSlice";
import { UserDetails } from "../redux/userSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import dayjs from "dayjs";
import { IconContext } from "react-icons";
import { GrClose } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { CgSpinner } from "react-icons/cg";
import { FiAlertCircle, FiCheckCircle } from "react-icons/fi";

interface RequestAccessModalProps {
    topicDetails: TopicDetails | undefined;
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
}

interface RequestAccessResponse {
    error: boolean;
    message: string;
}

const RequestAccessModal: React.FC<RequestAccessModalProps> = (props) => {
    const agenciesSelector = useAppSelector((state) => state.agencies);
    const userselector = useAppSelector((state) => state.user);
    const topicsSelector = useAppSelector((state) => state.topics);
    const topicFileSelector = useAppSelector((state) => state.topicFiles);
    // for drag and drop into modal
    // handle drag events
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
    const [errorSubmitting, setErrorSubmitting] = useState<boolean>(false);
    const [responseMessage, setResponseMessage] = useState<string>("No response from server");

    const accessTypes = [
        {
            name: "Read Access",
            description: `Browse and download files in ${topicsSelector.currentTopic.topic_name}`,
            value: "READ",
        },
        {
            name: "Write Access",
            description: `Publish files to ${topicsSelector.currentTopic.topic_name}`,
            value: "WRITE",
        },
    ];
    const [selectedAccessType, setSelectedAccessType] = useState<string>(accessTypes[0].value);
    const [description, setDescription] = useState<string>("");

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(e.target.value);
    };

    const handleCloseModal = () => {
        props.setIsOpen(false);
        setErrorSubmitting(false);
        setIsSubmitting(false);
        setIsSubmitted(false);
    };

    // subit request
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        setIsSubmitting(true);

        e.preventDefault(); // 👈️ prevent page refresh
        const accessFormData: FormData = new FormData();
        accessFormData.append("requestor_id", userselector.user.user_id);
        accessFormData.append("approver_id", topicsSelector.currentTopic.user_id);
        accessFormData.append("topic_id", topicsSelector.currentTopic.topic_id);
        accessFormData.append("access_type", selectedAccessType);
        accessFormData.append("description", description);

        try {
            const requestAccessConfigurationObject: AxiosRequestConfig = {
                method: "post",
                url: `${process.env.REACT_APP_DATA_WRITER_API_URL}auth/accessrequest`,
                data: accessFormData,
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
            };
            const requestAccessResponse: AxiosResponse<RequestAccessResponse> = await axios(
                requestAccessConfigurationObject
            );
            setResponseMessage(requestAccessResponse.data.message);
            setIsSubmitting(false);
            if (requestAccessResponse.data.error) {
                console.log(requestAccessResponse.data);
                setErrorSubmitting(true);
                return false;
            }
            setIsSubmitted(true);
        } catch (error: any) {
            setResponseMessage(error.message);
            setIsSubmitting(false);
            setErrorSubmitting(true);
            console.log("error creating request");
            return false;
        }
    };

    const handleToTopicDetails = () => {
        return navigate("/viewTopic", {
            state: {
                topic_id: props.topicDetails!.topic_id,
                topic_name: props.topicDetails!.topic_name,
                agency_id: props.topicDetails!.agency_id,
                description: props.topicDetails!.description,
            },
        });
    };

    return (
        <>
            <Transition appear show={props.isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => {}}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-150"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-150"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        {/* backdrop */}
                        <div className="fixed inset-0 bg-black bg-opacity-50" />
                    </Transition.Child>
                    {!isSubmitted && !errorSubmitting && (
                        <div className="fixed inset-0 overflow-y-auto">
                            <div className="flex min-h-full min-w-full items-center justify-center p-4 text-center">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 scale-95"
                                    enterTo="opacity-100 scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 scale-100"
                                    leaveTo="opacity-0 scale-95"
                                >
                                    <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                        <div className="flex flex-row justify-center">
                                            <Dialog.Title className="flex items-center justify-center text-center text-xl font-medium leading-6 text-gray-900 mb-8">
                                                {`Request Access to ${props.topicDetails?.topic_name}`}
                                            </Dialog.Title>
                                        </div>
                                        <form onSubmit={handleSubmit}>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Requesting to
                                                </label>
                                                <div className="flex flex-row items-center justify-center">
                                                    <input
                                                        type="text"
                                                        value={`${topicsSelector.currentTopicOwner.first_name} ${topicsSelector.currentTopicOwner.last_name}`}
                                                        disabled={true}
                                                        className={`m-1 p-2 block w-full bg-gray-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
                                                    />
                                                    <input
                                                        type="text"
                                                        value={
                                                            topicsSelector.currentTopicOwner.email
                                                        }
                                                        disabled={true}
                                                        className={`m-1 p-2 block w-full bg-gray-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <input
                                                    type="text"
                                                    value={
                                                        agenciesSelector.agencies.find(
                                                            (agency) =>
                                                                agency.agency_id ===
                                                                topicsSelector.currentTopicOwner
                                                                    .agency_id
                                                        )?.long_name
                                                    }
                                                    disabled={true}
                                                    className={`m-1 p-2 block w-full bg-gray-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mt-4">
                                                    Request Description
                                                </label>
                                                <div className="mt-1">
                                                    <textarea
                                                        id="about"
                                                        name="about"
                                                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
                                                        placeholder="e.g. Data required for report generation"
                                                        value={description}
                                                        onChange={handleDescriptionChange}
                                                    />
                                                </div>
                                            </div>
                                            <div className="mx-auto w-full max-w-md mt-4">
                                                <RadioGroup
                                                    value={selectedAccessType}
                                                    onChange={setSelectedAccessType}
                                                >
                                                    <RadioGroup.Label className="sr-only">
                                                        Access Type
                                                    </RadioGroup.Label>
                                                    <div className="space-y-2">
                                                        {accessTypes.map((accessType) => (
                                                            <RadioGroup.Option
                                                                key={accessType.name}
                                                                value={accessType.value}
                                                                className={({ active, checked }) =>
                                                                    `${
                                                                        active
                                                                            ? "ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-indigo-300"
                                                                            : ""
                                                                    }
                  ${checked ? "bg-indigo-700 bg-opacity-75 text-white" : "bg-white"}
                    relative flex cursor-pointer rounded-lg px-5 py-4 shadow-lg focus:outline-none`
                                                                }
                                                            >
                                                                {({ active, checked }) => (
                                                                    <>
                                                                        <div className="flex w-full items-center justify-between">
                                                                            <div className="flex items-center">
                                                                                <div className="text-sm">
                                                                                    <RadioGroup.Label
                                                                                        as="p"
                                                                                        className={`font-medium  ${
                                                                                            checked
                                                                                                ? "text-white"
                                                                                                : "text-gray-900"
                                                                                        }`}
                                                                                    >
                                                                                        {
                                                                                            accessType.name
                                                                                        }
                                                                                    </RadioGroup.Label>
                                                                                    <RadioGroup.Description
                                                                                        as="span"
                                                                                        className={`inline ${
                                                                                            checked
                                                                                                ? "text-sky-100"
                                                                                                : "text-gray-500"
                                                                                        }`}
                                                                                    >
                                                                                        <span>
                                                                                            {
                                                                                                accessType.description
                                                                                            }
                                                                                        </span>
                                                                                    </RadioGroup.Description>
                                                                                </div>
                                                                            </div>
                                                                            {checked && (
                                                                                <div className="shrink-0 text-white">
                                                                                    <CheckIcon className="h-6 w-6" />
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </>
                                                                )}
                                                            </RadioGroup.Option>
                                                        ))}
                                                    </div>
                                                </RadioGroup>
                                            </div>
                                            {isSubmitting ? (
                                                <div className="mt-4 flex justify-center items-center">
                                                    <button
                                                        type="submit"
                                                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 mx-1 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none"
                                                    >
                                                        <IconContext.Provider
                                                            value={{
                                                                size: "1.5em",
                                                                color: "rgb(30 58 138)",
                                                            }}
                                                        >
                                                            <div className="mr-2 animate-spin transition transition-duration-500">
                                                                <CgSpinner />
                                                            </div>
                                                        </IconContext.Provider>
                                                        Publishing...
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="mt-4 flex justify-center items-center">
                                                    <button
                                                        type="button"
                                                        className="inline-flex justify-center rounded-md border border-transparent bg-red-100 mx-1 px-4 py-2 text-sm font-medium text-red-900 hover:bg-blue-200 focus:outline-none"
                                                        onClick={handleCloseModal}
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 mx-1 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none"
                                                    >
                                                        Send Request
                                                    </button>
                                                </div>
                                            )}
                                        </form>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    )}
                    {isSubmitted && (
                        // Success Modal
                        <div className="fixed inset-0 overflow-y-auto">
                            <div className="flex min-h-full min-w-full items-center justify-center p-4 text-center">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 scale-95"
                                    enterTo="opacity-100 scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 scale-100"
                                    leaveTo="opacity-0 scale-95"
                                >
                                    <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                        <div className="m-12 flex flex-col justify-center rounded-md px-6 pt-5 pb-6 transition">
                                            <div className="flex justify-center items-center space-y-1 text-center">
                                                <IconContext.Provider
                                                    value={{
                                                        size: "4em",
                                                        color: "rgb(21 128 61)",
                                                    }}
                                                >
                                                    <div className="transition transition-duration-500">
                                                        <FiCheckCircle />
                                                    </div>
                                                </IconContext.Provider>
                                            </div>
                                            <p className="text-center mt-2">Access Request Sent!</p>
                                        </div>

                                        <div className="mt-4 flex justify-center items-center">
                                            <button
                                                onClick={handleCloseModal}
                                                className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 mx-1 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none"
                                            >
                                                Yay!
                                            </button>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    )}
                    {errorSubmitting && (
                        // Success Modal
                        <div className="fixed inset-0 overflow-y-auto">
                            <div className="flex min-h-full min-w-full items-center justify-center p-4 text-center">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 scale-95"
                                    enterTo="opacity-100 scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 scale-100"
                                    leaveTo="opacity-0 scale-95"
                                >
                                    <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                        <div className="m-8 flex flex-col justify-center rounded-md px-6 pt-5 pb-6 transition">
                                            <div className="flex justify-center items-center space-y-1 text-center">
                                                <IconContext.Provider
                                                    value={{
                                                        size: "4em",
                                                        color: "rgb(185 28 28)",
                                                    }}
                                                >
                                                    <div className="transition transition-duration-500 ">
                                                        <FiAlertCircle />
                                                    </div>
                                                </IconContext.Provider>
                                            </div>
                                            <Dialog.Title className="flex mt-4 items-center justify-center text-center text-lg font-medium leading-6 text-gray-900">
                                                Error sending request
                                            </Dialog.Title>
                                            <div className="flex mt-2 justify-center items-center text-center">
                                                <p className="text-sm text-gray-500">
                                                    {responseMessage}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-4 flex justify-center items-center">
                                            <button
                                                onClick={handleCloseModal}
                                                className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 mx-1 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none"
                                            >
                                                Close
                                            </button>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    )}
                </Dialog>
            </Transition>
        </>
    );
};

function CheckIcon(props: any) {
    return (
        <svg viewBox="0 0 24 24" fill="none" {...props}>
            <circle cx={12} cy={12} r={12} fill="#fff" opacity="0.2" />
            <path
                d="M7 13l3 3 7-7"
                stroke="#fff"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
export default RequestAccessModal;
