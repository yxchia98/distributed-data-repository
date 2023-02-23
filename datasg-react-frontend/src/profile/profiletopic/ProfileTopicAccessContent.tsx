import { Dialog, Tab, Transition } from "@headlessui/react";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { Dispatch, Fragment, SetStateAction, useEffect, useState } from "react";
import { IconContext } from "react-icons";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";
import { CgSpinner } from "react-icons/cg";
import { FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import { AccessDetail } from "../../redux/accessSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchCurrentTopicAccess } from "../../redux/topicSlice";
import ProfileTopicRemoveAccessModal from "./ProfileTopicRemoveAccessModal";

interface TopicAccessCategoriesState {
    Read: Array<AccessDetail>;
    Write: Array<AccessDetail>;
}

interface RemoveAccessResponseType {
    error: boolean;
    meesage: string;
}

const ProfileTopicAccessContent: React.FC = (props) => {
    const dispatch = useAppDispatch();
    const agenciesSelector = useAppSelector((state) => state.agencies);
    const topicsSelector = useAppSelector((state) => state.topics);
    const userSelector = useAppSelector((state) => state.user);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
    const [selectedCategory, setSelectedCategory] = useState<string>("Read");
    const [categories, setCategories] = useState<TopicAccessCategoriesState>({
        Read: [],
        Write: [],
    });
    const [revokeDetails, setRevokeDetails] = useState<AccessDetail>({
        user_id: "",
        topic_id: "",
        last_access: "",
    });

    const handleTabOnClick = (category: string) => {
        return (event: React.MouseEvent) => {
            setSelectedCategory(category);
        };
    };

    // function to open confirmation modal on revoke button click
    const openConfirmationModal = (accessDetails: AccessDetail) => {
        return (event: React.MouseEvent) => {
            setRevokeDetails(accessDetails);
            setShowConfirmation(true);
        };
    };

    // function to close modal if user cancels confirmation
    const cancelConfirmationModal = () => {
        setShowConfirmation(false);
    };

    // function to run on confirm revoking of access
    const submitConfirmationModal = async () => {
        setIsLoading(true);
        const isSuccess = await revokeAccess();
        setShowConfirmation(false);
    };

    // method to delete access from db
    const revokeAccess = async () => {
        // return async (event: React.MouseEvent) => {
        const removeAccessUrl =
            selectedCategory === "Read"
                ? `${process.env.REACT_APP_DATA_WRITER_API_URL}auth/read`
                : `${process.env.REACT_APP_DATA_WRITER_API_URL}auth/write`;
        const removeAccessFormData: FormData = new FormData();
        removeAccessFormData.append("user_id", revokeDetails.user_id);
        removeAccessFormData.append("topic_id", revokeDetails.topic_id);
        const removeAccessConfigObject: AxiosRequestConfig = {
            method: "delete",
            url: removeAccessUrl,
            data: removeAccessFormData,
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        };
        try {
            const removeAccessResponse: AxiosResponse<RemoveAccessResponseType> = await axios(
                removeAccessConfigObject
            );
            setIsLoading(false);
            if (removeAccessResponse.data.error) {
                return false;
            }
            dispatch(fetchCurrentTopicAccess(topicsSelector.currentTopic.topic_id));
            return true;
        } catch (error: any) {
            return false;
        }
        // };
    };

    function classNames(...classes: any[]) {
        return classes.filter(Boolean).join(" ");
    }
    useEffect(() => {
        setCategories({
            Read: topicsSelector.currentTopicAccess.read,
            Write: topicsSelector.currentTopicAccess.write,
        });
    }, [topicsSelector.currentTopicAccess]);
    return (
        <div className="h-full w-full justify-center items-center">
            <ProfileTopicRemoveAccessModal
                isOpen={showConfirmation}
                isLoading={isLoading}
                handleCancelModal={cancelConfirmationModal}
                handleConfirmModal={submitConfirmationModal}
            />
            <Tab.Group>
                <div className="w-full h-full">
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
                    <div className="w-full h-full px-[10%] overflow-auto">
                        <Tab.Panels className="my-2 p-1 w-full h-full border bg-gray-50 rounded-xl">
                            {Object.values(categories).map((access: any, idx: number) => (
                                <Tab.Panel
                                    key={idx}
                                    className={classNames("px-2", "focus:outline-none")}
                                >
                                    <ul>
                                        {access.map((accessDetails: AccessDetail, idx: number) => (
                                            <div
                                                key={`${accessDetails.user_id}${accessDetails.topic_id}`}
                                                className={`flex p-2 justify-between items-center ${
                                                    idx > 0 ? "border-t-[1px]" : ""
                                                }`}
                                            >
                                                <li
                                                    key={`${accessDetails.user_id}${accessDetails.topic_id}`}
                                                    className="relative"
                                                >
                                                    <div className="mt-1 flex items-center">
                                                        <div className="mx-1">&middot;</div>
                                                        {userSelector.allUsers
                                                            .filter(
                                                                (user) =>
                                                                    user.user_id ===
                                                                    accessDetails.user_id
                                                            )
                                                            .map((user) => (
                                                                <h3
                                                                    className="font-medium leading-5"
                                                                    key={user.user_id}
                                                                >
                                                                    {`${user.first_name} ${user.last_name}`}
                                                                </h3>
                                                            ))}
                                                        <div className="mx-1">&middot;</div>
                                                        {userSelector.allUsers
                                                            .filter(
                                                                (user) =>
                                                                    user.user_id ===
                                                                    accessDetails.user_id
                                                            )
                                                            .map((user) => (
                                                                <div
                                                                    className="text-xs text-gray-500"
                                                                    key={user.user_id}
                                                                >
                                                                    {user.email}
                                                                </div>
                                                            ))}
                                                        <div className="mx-1">&middot;</div>
                                                    </div>
                                                    <div className="mt-1 flex space-x-1 text-xs font-normal items-center leading-4 text-gray-500">
                                                        <div className="mx-1">&middot;</div>
                                                        {userSelector.allUsers
                                                            .filter(
                                                                (user) =>
                                                                    user.user_id ===
                                                                    accessDetails.user_id
                                                            )
                                                            .map((user) => (
                                                                <div
                                                                    className="text-xs text-gray-500"
                                                                    key={user.user_id}
                                                                >
                                                                    {agenciesSelector.agencies
                                                                        .filter(
                                                                            (agency) =>
                                                                                agency.agency_id ===
                                                                                user.agency_id
                                                                        )
                                                                        .map(
                                                                            (agency) =>
                                                                                `${agency.long_name} (${agency.short_name})`
                                                                        )}
                                                                </div>
                                                            ))}{" "}
                                                        <div className="mx-1">&middot;</div>
                                                    </div>
                                                </li>
                                                <div className="relative flex flex-row">
                                                    {accessDetails.user_id !=
                                                        userSelector.user.user_id && (
                                                        <button
                                                            onClick={openConfirmationModal(
                                                                accessDetails
                                                            )}
                                                            className="text-gray-500 hover:text-red-500 active:text-red-700"
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
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </ul>
                                </Tab.Panel>
                            ))}
                        </Tab.Panels>
                    </div>
                </div>
            </Tab.Group>
        </div>
    );
};
export default ProfileTopicAccessContent;
