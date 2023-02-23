import { Dialog, Transition } from "@headlessui/react";
import { Dispatch, Fragment, SetStateAction, useState } from "react";
import { IconContext } from "react-icons";
import { CgSpinner } from "react-icons/cg";
import { FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import { TopicDetails } from "../../redux/topicSlice";
import ProfielTopicAccessContent from "./ProfileTopicAccessContent";

interface ProfileTopicEditModalProps {
    currentTopic: TopicDetails;
    isOpen: boolean;
    handleCloseModal: () => void;
}

const ProfileTopicEditModal: React.FC<ProfileTopicEditModalProps> = (props) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
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
                                    <Dialog.Title
                                        as="h3"
                                        className="flex items-center justify-center text-center text-lg font-medium leading-6 text-gray-900"
                                    >
                                        Edit Topic
                                    </Dialog.Title>
                                    <div className="flex flex-col justify-center rounded-md px-6 pt-5 pb-6 transition">
                                        {!isLoading && <ProfielTopicAccessContent />}
                                        {isLoading && (
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
                                        )}
                                    </div>
                                    <div className="flex justify-center items-center">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                                            onClick={props.handleCloseModal}
                                        >
                                            Close
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
};
export default ProfileTopicEditModal;
