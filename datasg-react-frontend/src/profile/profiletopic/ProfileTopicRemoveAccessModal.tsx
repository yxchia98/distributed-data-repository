import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { CgSpinner } from "react-icons/cg";

interface ProfileTopicRemoveAccessModalProps {
    isOpen: boolean;
    isLoading: boolean;
    handleCancelModal: () => void;
    handleConfirmModal: () => void;
}

const ProfileTopicRemoveAccessModal: React.FC<ProfileTopicRemoveAccessModalProps> = (props) => {
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
                                        Confirm Delete?
                                    </Dialog.Title>
                                    <div className="flex flex-col justify-center rounded-md px-6 pt-5 pb-6 transition text-sm">
                                        This action cannot be undone. Proceed with revoking access
                                        rights?
                                    </div>
                                    {!props.isLoading && (
                                        <div className="flex justify-center items-center">
                                            <button
                                                className="mx-2 inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                                                onClick={props.handleCancelModal}
                                            >
                                                Go Back
                                            </button>
                                            <button
                                                className="mx-2 inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-800 focus-visible:ring-offset-2"
                                                onClick={props.handleConfirmModal}
                                            >
                                                Confirm
                                            </button>
                                        </div>
                                    )}
                                    {props.isLoading && (
                                        <div className="flex justify-center items-center">
                                            <button
                                                className="mx-2 inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-800 focus-visible:ring-offset-2"
                                                onClick={props.handleConfirmModal}
                                            >
                                                <div className="mx-2 animate-spin text-white">
                                                    <CgSpinner />
                                                </div>
                                                Confirm
                                            </button>
                                        </div>
                                    )}
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
};
export default ProfileTopicRemoveAccessModal;
