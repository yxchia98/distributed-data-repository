import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { IconContext } from "react-icons";
import { BiError } from "react-icons/bi";
import { CgSpinner } from "react-icons/cg";
import { FiCheckCircle } from "react-icons/fi";
import { TopicDetails } from "../../redux/topicSlice";

interface ProfileTopicDeleteSuccessModalProps {
    isOpen: boolean;
    isLoading: boolean;
    topic: TopicDetails;
    handleConfirmModal: () => void;
}

const ProfileTopicDeleteSuccessModal: React.FC<ProfileTopicDeleteSuccessModalProps> = (props) => {
    return (
        <>
            <Transition appear show={props.isOpen} as={Fragment}>
                <Dialog as="div" className="h-full w-full relative z-10" onClose={() => {}}>
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

                    <div className="fixed w-full h-full inset-0 overflow-y-auto">
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
                                <Dialog.Panel className="transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h3"
                                        className="flex items-center justify-center text-center text-lg font-medium leading-6 text-gray-900"
                                    >
                                        {`Successfully Deleted ${props.topic.topic_name}`}
                                    </Dialog.Title>
                                    <div className="flex flex-col items-center justify-center rounded-md px-6 pt-5 pb-6 transition text-sm">
                                        <span>
                                            All related accesses, files and keys have been
                                            successfully revoked and deleted.
                                        </span>
                                        <div className="mx-2 text-emerald-500">
                                            <IconContext.Provider
                                                value={{
                                                    size: "1.75em",
                                                }}
                                            >
                                                <div className="">
                                                    <FiCheckCircle />
                                                </div>
                                            </IconContext.Provider>
                                        </div>
                                    </div>
                                    <div className="flex justify-center items-center">
                                        <button
                                            className="mx-2 inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                                            onClick={props.handleConfirmModal}
                                        >
                                            Got it
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
export default ProfileTopicDeleteSuccessModal;
