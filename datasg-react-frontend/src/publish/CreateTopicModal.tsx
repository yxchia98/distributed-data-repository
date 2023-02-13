import { Dialog, Transition } from "@headlessui/react";
import { Dispatch, Fragment, SetStateAction, useState } from "react";
import { IconContext } from "react-icons";
import { IoCloseCircleOutline, IoCloseOutline } from "react-icons/io5";
import { UserDetails } from "../redux/userSlice";

interface CreateTopicModalProps {
    user: UserDetails;

    isOpen: boolean;
    handleCloseModal: () => void;
}

const CreateTopicModal: React.FC<CreateTopicModalProps> = (props) => {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // 👈️ prevent page refresh

        console.log("clicked on submit!");
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
                                    <IconContext.Provider value={{ size: "1.5em", color: "gray" }}>
                                        <div className="absolute ">
                                            <IoCloseCircleOutline />
                                        </div>
                                    </IconContext.Provider>
                                    <Dialog.Title
                                        as="h3"
                                        className="flex items-center justify-center text-center text-3xl font-medium leading-6 text-gray-900"
                                    >
                                        Create a new Topic
                                    </Dialog.Title>
                                    <form className="w-full max-w-lg" onSubmit={handleSubmit}>
                                        <div className="mt-4 flex justify-center items-center">
                                            <button
                                                type="submit"
                                                className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                            >
                                                Got it, thanks!
                                            </button>
                                        </div>
                                    </form>
                                    <div className="mt-2 flex justify-center items-center text-center">
                                        <p className="text-sm text-gray-500">
                                            Hooray! Your account has been successfully registered on
                                            the platform. Start sharing data today!
                                        </p>
                                    </div>

                                    <div className="mt-4 flex justify-center items-center">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                            onClick={props.handleCloseModal}
                                        >
                                            Got it, thanks!
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
export default CreateTopicModal;
