import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { IconContext } from "react-icons";
import { BiError } from "react-icons/bi";
import { CgSpinner } from "react-icons/cg";
import { FiAlertCircle, FiCheckCircle } from "react-icons/fi";

interface TopicDescModalProps {
    isOpen: boolean;
    content: string;
    handleCloseModal: () => void;
}

const TopicDescModal: React.FC<TopicDescModalProps> = (props) => {
    return (
        <>
            <Transition appear show={props.isOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="h-full w-full relative z-10"
                    onClose={props.handleCloseModal}
                >
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
                                        {`Topic Description`}
                                    </Dialog.Title>
                                    <div className="w-full h-full flex flex-col items-center justify-center rounded-md px-6 py-4 transition text-sm">
                                        <span>{props.content}</span>
                                    </div>
                                    <div className="flex justify-center items-center">
                                        <button
                                            className="mx-2 inline-flex justify-center items-center rounded-md border border-transparent bg-gray-200 px-4 py-2 text-sm font-medium"
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
export default TopicDescModal;
