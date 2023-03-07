import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { IconContext } from "react-icons";
import { BiCopy, BiError } from "react-icons/bi";
import { CgSpinner } from "react-icons/cg";
import { FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import { TopicDetails } from "../../redux/topicSlice";

interface ProfileTopicAPIModalProps {
    keyString: string;
    isOpen: boolean;
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
    topic: TopicDetails;
    handleCancelModal: () => void;
    handleConfirm: () => void;
}

const ProfileTopicAPIModal: React.FC<ProfileTopicAPIModalProps> = (props) => {
    const [isCopied, setIsCopied] = useState<boolean>(false);
    const handleCopyOnClick = () => {
        navigator.clipboard.writeText(props.keyString);
        setIsCopied(true);
    };
    useEffect(() => {
        if (props.isOpen) {
            setIsCopied(false);
        }
    }, [props.isOpen]);
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
                                        {`Generate API Key for ${props.topic.topic_name}`}
                                    </Dialog.Title>
                                    {!props.isSuccess && !props.isError && (
                                        <div className="flex flex-col items-center justify-center rounded-md px-6 py-4 transition text-sm">
                                            <div className="mb-2 text-amber-500">
                                                <IconContext.Provider
                                                    value={{
                                                        size: "3em",
                                                    }}
                                                >
                                                    <div className="">
                                                        <BiError />
                                                    </div>
                                                </IconContext.Provider>
                                            </div>
                                            <span>
                                                Any previously generated API key for this topic
                                            </span>
                                            <span className="font-bold">will be invalidated.</span>
                                            <span>continue?</span>
                                        </div>
                                    )}
                                    {props.isSuccess && (
                                        <div className="flex flex-col items-center justify-center rounded-md px-6 py-4 transition text-sm">
                                            <div className="mb-2 text-emerald-500">
                                                <IconContext.Provider
                                                    value={{
                                                        size: "3em",
                                                    }}
                                                >
                                                    <div className="">
                                                        <FiCheckCircle />
                                                    </div>
                                                </IconContext.Provider>
                                            </div>
                                            <div className="grid grid-rows-1 grid-cols-8 rounded-lg border border-gray-500 items-center justify-center">
                                                <div className="col-span-6 col-start-1 p-2 flex justify-center items-center">
                                                    <span>{props.keyString}</span>
                                                </div>
                                                <button
                                                    onClick={handleCopyOnClick}
                                                    className="col-start-7 col-span-2 w-full h-full flex justify-center items-center p-2 rounded-r-lg border-l bg-gray-100 hover:bg-gray-200 active:bg-gray-300"
                                                >
                                                    <div className="pr-1">
                                                        <IconContext.Provider
                                                            value={{
                                                                size: "1.25em",
                                                            }}
                                                        >
                                                            <div className="">
                                                                <BiCopy />
                                                            </div>
                                                        </IconContext.Provider>
                                                    </div>
                                                    <span>{`${
                                                        isCopied ? "copied!" : "copy"
                                                    }`}</span>
                                                </button>
                                            </div>
                                            <span>Please take note of the above API Key.</span>
                                            <span>
                                                You'll need it to publish topics directly to our
                                                APIs.
                                            </span>
                                        </div>
                                    )}
                                    {props.isError && (
                                        <div className="flex flex-col items-center justify-center rounded-md px-6 py-4 transition text-sm">
                                            <div className="mx-2 text-indigo-500">
                                                <IconContext.Provider
                                                    value={{
                                                        size: "3em",
                                                    }}
                                                >
                                                    <div className="">
                                                        <FiAlertCircle />
                                                    </div>
                                                </IconContext.Provider>
                                            </div>
                                            <span>
                                                Oops! There seem to be a problem generating the
                                                key...
                                            </span>
                                            <span>Please try again later.</span>
                                        </div>
                                    )}

                                    {!props.isLoading && !props.isSuccess && !props.isError && (
                                        <div className="flex justify-center items-center">
                                            <button
                                                className="mx-2 inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                                                onClick={props.handleCancelModal}
                                            >
                                                Go Back
                                            </button>
                                            <button
                                                className="mx-2 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-800 focus-visible:ring-offset-2"
                                                onClick={props.handleConfirm}
                                            >
                                                Generate
                                            </button>
                                        </div>
                                    )}
                                    {props.isLoading && !props.isSuccess && !props.isError && (
                                        <div className="flex justify-center items-center">
                                            <button
                                                className="mx-2 inline-flex justify-center items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white"
                                                onClick={props.handleConfirm}
                                                disabled={true}
                                            >
                                                <div className="mr-2 animate-spin text-white">
                                                    <IconContext.Provider
                                                        value={{
                                                            size: "1.5em",
                                                        }}
                                                    >
                                                        <div className="">
                                                            <CgSpinner />
                                                        </div>
                                                    </IconContext.Provider>
                                                </div>
                                                Generating...
                                            </button>
                                        </div>
                                    )}
                                    {!props.isLoading && (props.isError || props.isSuccess) && (
                                        <div className="flex justify-center items-center">
                                            <button
                                                className="mx-2 inline-flex justify-center items-center rounded-md border border-transparent bg-gray-200 px-4 py-2 text-sm font-medium"
                                                onClick={props.handleCancelModal}
                                            >
                                                Got it
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
export default ProfileTopicAPIModal;
