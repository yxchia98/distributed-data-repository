import { Tab } from "@headlessui/react";
import axios from "axios";
import dayjs from "dayjs";
import { useState, useEffect } from "react";
import { IconContext } from "react-icons";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";
import { CgSpinner } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import { AccessRequestDetail, fetchAccessRequests } from "../../redux/accessSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchTopics } from "../../redux/topicSlice";
import { fetchAllUsers, FetchUserResponseType } from "../../redux/userSlice";
import ProfileRequestAccessModal from "./ProfileRequestAccessModal";

interface RequestAccessCategoriesState {
    Approvable: Array<AccessRequestDetail>;
    Submitted: Array<AccessRequestDetail>;
}

interface SubmitProfileRequestResponse {
    error: boolean;
    message: string;
}

const ProfileRequest: React.FC = (props) => {
    const userSelector = useAppSelector((state) => state.user);
    const accessSelector = useAppSelector((state) => state.access);
    const topicsSelector = useAppSelector((state) => state.topics);
    const [categories, setCategories] = useState<RequestAccessCategoriesState>({
        Approvable: [],
        Submitted: [],
    });
    const [selectedCategory, setSelectedCategory] = useState<string>("Approvable");
    const [modalTitle, setModalTitle] = useState<string>("Loading...");
    const [modalMessage, setModalMessage] = useState<string>("modifying access request...");

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
    const [isErrorSubmitting, setIsErrorSubmitting] = useState<boolean>(true);

    const dispatch = useAppDispatch();

    const fetchRequiredRequestData = () => {
        dispatch(fetchAllUsers());
        dispatch(fetchTopics());
        dispatch(fetchAccessRequests(userSelector.user.user_id));
    };

    const handleTabOnClick = (category: string) => {
        return (event: React.MouseEvent) => {
            setSelectedCategory(category);
        };
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const handleApproveRequestOnClick = (requestId: string) => {
        return (event: React.MouseEvent) => {
            setIsSubmitting(true);
            setModalTitle("Approving access request...");
            setModalMessage("hang on tight...");
            setShowModal(true);
            try {
            } catch (error) {}
        };
    };

    const handleRejectRequestOnClick = (requestId: string) => {
        return (event: React.MouseEvent) => {
            setIsSubmitting(true);
            setModalTitle("Rejecting access request...");
            setModalMessage("hang on tight...");
            setShowModal(true);
            try {
            } catch (error) {}
        };
    };

    useEffect(() => {
        if (
            accessSelector.status === "loading" ||
            userSelector.fetchAllUsersStatus === "loading" ||
            topicsSelector.status === "loading"
        ) {
            setIsLoading(true);
            return;
        }
        setIsLoading(false);
        // set state data
        setCategories({
            Approvable: accessSelector.approvable,
            Submitted: accessSelector.requested,
        });
    }, [accessSelector, userSelector, topicsSelector]);

    useEffect(() => {
        fetchRequiredRequestData();
    }, []);

    function classNames(...classes: any[]) {
        return classes.filter(Boolean).join(" ");
    }

    return (
        <div className="w-full h-full bg-gray-100">
            {!isLoading && (
                <div className="w-full h-full bg-gray-100">
                    <div className="w-full flex justify-center">
                        <div className="w-full flex justify-center p-8">
                            <span className="text-3xl font-semibold">My Requests</span>
                        </div>
                    </div>
                    <Tab.Group>
                        <div className="w-full flex justify-center">
                            <Tab.List className="flex space-x-1 rounded-xl w-1/2 bg-indigo-900/10 p-1">
                                {Object.keys(categories).map((category) => (
                                    <Tab
                                        key={category}
                                        onClick={handleTabOnClick(category)}
                                        className={({ selected }) =>
                                            classNames(
                                                "w-full rounded-lg py-2.5 text-sm font-medium leading-5",
                                                "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none ",
                                                selected
                                                    ? "bg-indigo-500 text-white shadow"
                                                    : "text-gray-500 hover:bg-white/[0.12]"
                                            )
                                        }
                                    >
                                        {category}
                                    </Tab>
                                ))}
                            </Tab.List>
                        </div>
                        <div className="w-full h-full px-[10%]">
                            <Tab.Panels className="mt-2">
                                {Object.values(categories).map((request, idx) => (
                                    <Tab.Panel
                                        key={idx}
                                        className={classNames(
                                            "rounded-xl p-1",
                                            "focus:outline-none"
                                        )}
                                    >
                                        <ul>
                                            {request.map((requestDetails: AccessRequestDetail) => (
                                                <div
                                                    key={requestDetails.request_id}
                                                    className="flex m-2 p-3 justify-between items-center rounded-md bg-white"
                                                >
                                                    <li
                                                        key={requestDetails.request_id}
                                                        className="relative"
                                                    >
                                                        <div className="mt-1 flex items-center">
                                                            {topicsSelector.topics
                                                                .filter(
                                                                    (topic) =>
                                                                        topic.topic_id ===
                                                                        requestDetails.topic_id
                                                                )
                                                                .map((topic) => (
                                                                    <h3
                                                                        className="font-medium leading-5"
                                                                        key={topic.topic_id}
                                                                    >
                                                                        {topic.topic_name}
                                                                    </h3>
                                                                ))}
                                                            <div className="mx-1">&middot;</div>
                                                            <span className="bg-gray-200 rounded-lg shadow text-xs px-2 py-1 lowercase">
                                                                {requestDetails.access_type}
                                                            </span>
                                                        </div>
                                                        <div className="mt-1 flex space-x-1 text-xs font-normal items-center leading-4 text-gray-500">
                                                            <div>
                                                                {dayjs(
                                                                    requestDetails.request_date,
                                                                    "YYYY-MM-DD"
                                                                ).format("DD/MM/YYYY")}
                                                            </div>
                                                            <div>&middot;</div>
                                                            {selectedCategory === "Submitted" &&
                                                                userSelector.allUsers
                                                                    .filter(
                                                                        (user) =>
                                                                            user.user_id ===
                                                                            requestDetails.approver_id
                                                                    )
                                                                    .map((user) => (
                                                                        <div
                                                                            key={user.user_id}
                                                                        >{`${user.first_name} ${user.last_name}`}</div>
                                                                    ))}
                                                            {selectedCategory === "Approvable" &&
                                                                userSelector.allUsers
                                                                    .filter(
                                                                        (user) =>
                                                                            user.user_id ===
                                                                            requestDetails.requestor_id
                                                                    )
                                                                    .map((user) => (
                                                                        <div
                                                                            key={user.user_id}
                                                                        >{`${user.first_name} ${user.last_name}`}</div>
                                                                    ))}
                                                            <div>&middot;</div>
                                                            {requestDetails.status ===
                                                                "PENDING" && (
                                                                <div className="bg-orange-300 text-black mx-2 rounded-lg shadow text-xs px-2 py-1 lowercase">
                                                                    {requestDetails.status}
                                                                </div>
                                                            )}
                                                            {requestDetails.status ===
                                                                "APPROVED" && (
                                                                <div className="bg-green-300 text-black mx-2 rounded-lg shadow text-xs px-2 py-1 lowercase">
                                                                    {requestDetails.status}
                                                                </div>
                                                            )}
                                                            {requestDetails.status ===
                                                                "REJECTED" && (
                                                                <div className="bg-red-300 text-black mx-2 rounded-lg shadow text-xs px-2 py-1 lowercase">
                                                                    {requestDetails.status}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="mt-1 flex space-x-1 text-xs font-normal leading-4 text-gray-500">
                                                            <span>
                                                                {requestDetails.description}
                                                            </span>
                                                        </div>
                                                    </li>
                                                    {selectedCategory === "Approvable" && (
                                                        <div className="relative flex flex-row">
                                                            <button
                                                                className="text-gray-500 hover:text-green-500 active:text-green-700"
                                                                onClick={handleApproveRequestOnClick(
                                                                    requestDetails.request_id
                                                                )}
                                                            >
                                                                <IconContext.Provider
                                                                    value={{
                                                                        size: "2em",
                                                                    }}
                                                                >
                                                                    <div className="px-2">
                                                                        <AiOutlineCheckCircle />
                                                                    </div>
                                                                </IconContext.Provider>
                                                            </button>

                                                            <button
                                                                className="text-gray-500 hover:text-red-500 active:text-red-700"
                                                                onClick={handleRejectRequestOnClick(
                                                                    requestDetails.request_id
                                                                )}
                                                            >
                                                                <IconContext.Provider
                                                                    value={{
                                                                        size: "2em",
                                                                    }}
                                                                >
                                                                    <div className="px-2">
                                                                        <AiOutlineCloseCircle />
                                                                    </div>
                                                                </IconContext.Provider>
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </ul>
                                    </Tab.Panel>
                                ))}
                            </Tab.Panels>
                        </div>
                    </Tab.Group>
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
            <ProfileRequestAccessModal
                title={modalTitle}
                message={modalMessage}
                closeMessage={"Got it"}
                isOpen={showModal}
                loading={isSubmitting}
                success={isSubmitted}
                error={isErrorSubmitting}
                handleCloseModal={closeModal}
            />
        </div>
    );
};

export default ProfileRequest;
