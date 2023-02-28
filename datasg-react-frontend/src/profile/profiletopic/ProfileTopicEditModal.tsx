import { Dialog, Transition } from "@headlessui/react";
import { Dispatch, Fragment, SetStateAction, useEffect, useState } from "react";
import { IconContext } from "react-icons";
import { BiTrash } from "react-icons/bi";
import { CgSpinner } from "react-icons/cg";
import { FaRegSave } from "react-icons/fa";
import { FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import { fetchAgencies } from "../../redux/agencySlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setCurrentTopicWithDetails, TopicDetails } from "../../redux/topicSlice";
import ProfileTopicDeleteModal from "./ProfileTopicDeleteModal";
import ProfileTopicEditForm from "./ProfileTopicEditForm";

interface ProfileTopicEditModalProps {
    currentTopic: TopicDetails;
    isOpen: boolean;
    handleCloseModal: () => void;
    setCurrentTopicDetails: React.Dispatch<React.SetStateAction<TopicDetails>>;
}

const ProfileTopicEditModal: React.FC<ProfileTopicEditModalProps> = (props) => {
    const dispatch = useAppDispatch();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const agenciesSelector = useAppSelector((state) => state.agencies);
    const topicsSelector = useAppSelector((state) => state.topics);
    const userSelector = useAppSelector((state) => state.user);

    const fetchRequiredDataRedux = () => {
        dispatch(setCurrentTopicWithDetails(props.currentTopic));
        dispatch(fetchAgencies());
    };

    const cancelDeleteModal = () => {
        setShowDeleteModal(false);
        return;
    };

    const confirmDeleteModal = () => {
        setShowDeleteModal(false);
        return;
    };

    const handleDeleteOnClick = () => {
        setShowDeleteModal(true);
    };

    useEffect(() => {
        if (
            agenciesSelector.status != "loading" &&
            topicsSelector.status != "loading" &&
            userSelector.status != "loading"
        ) {
            setIsLoading(false);
        }
    }, [agenciesSelector, topicsSelector, userSelector]);
    useEffect(() => {
        if (props.isOpen) {
            setIsLoading(true);
            fetchRequiredDataRedux();
        }
    }, [props.isOpen]);
    return (
        <div className="w-full h-full">
            <ProfileTopicDeleteModal
                topic={props.currentTopic}
                isLoading={false}
                isOpen={showDeleteModal}
                handleCancelModal={cancelDeleteModal}
                handleConfirmModal={confirmDeleteModal}
            />
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
                                <Dialog.Panel className="w-3/5 transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    {/* <Dialog.Title
                                        as="h3"
                                        className="flex items-center justify-center text-center text-lg font-medium leading-6 text-gray-900"
                                    > */}
                                    <Dialog.Title as="h3" className="grid grid-cols-6 grid-rows-1">
                                        <div className="col-start-2 col-span-4 row-span-1 flex items-center justify-center text-center text-lg font-medium text-gray-900">
                                            {`Editing ${topicsSelector.topics
                                                .filter(
                                                    (topic) =>
                                                        topic.topic_id ===
                                                        props.currentTopic.topic_id
                                                )
                                                .map((topic) => topic.topic_name)} Topic`}
                                        </div>
                                        <div className="col-start-6 col-span-1 row-span-1 flex justify-end">
                                            <button
                                                className="p-2 rounded-lg bg-red-300 hover:bg-red-400 active:bg-red-500"
                                                onClick={handleDeleteOnClick}
                                            >
                                                <IconContext.Provider
                                                    value={{
                                                        size: "1.5em",
                                                    }}
                                                >
                                                    <div className="text-gray-900">
                                                        <BiTrash />
                                                    </div>
                                                </IconContext.Provider>{" "}
                                            </button>
                                        </div>
                                    </Dialog.Title>
                                    <div className="flex flex-col justify-center rounded-md px-4 py-2 transition">
                                        {!isLoading && (
                                            <ProfileTopicEditForm
                                                currentTopic={props.currentTopic}
                                                handleCloseModal={props.handleCloseModal}
                                                setCurrentTopicDetails={
                                                    props.setCurrentTopicDetails
                                                }
                                            />
                                        )}
                                        {isLoading && (
                                            <div className="w-full h-full">
                                                <div className="flex justify-center items-center text-red-500">
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
                                                <div className="flex justify-center items-center">
                                                    <button
                                                        type="button"
                                                        className="m-2 inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                                                        onClick={props.handleCloseModal}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};
export default ProfileTopicEditModal;
