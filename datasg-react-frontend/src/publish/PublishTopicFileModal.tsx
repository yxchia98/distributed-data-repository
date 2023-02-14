import { Dialog, Transition } from "@headlessui/react";
import { Dispatch, Fragment, SetStateAction, useEffect, useRef, useState } from "react";
import { TopicDetails } from "../redux/topicSlice";
import { UserDetails } from "../redux/userSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import dayjs from "dayjs";
import { IconContext } from "react-icons";
import { GrClose } from "react-icons/gr";
import { useNavigate } from "react-router-dom";

interface PublishTopicFileModalProps {
    topicDetails: TopicDetails | undefined;
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const PublishTopicFileModal: React.FC<PublishTopicFileModalProps> = (props) => {
    const agenciesSelector = useAppSelector((state) => state.agencies);
    // for drag and drop into modal
    // handle drag events
    const drop = useRef<any>(null);
    const navigate = useNavigate();
    const [topicFileList, setTopicFileList] = useState<FileList | null>(null);
    const [formattedTopicFiles, setFormattedTopicFiles] = useState<Array<File>>([]);
    const [referencing, setReferencing] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleDragOver = (e: { preventDefault: () => void; stopPropagation: () => void }) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: {
        preventDefault: () => void;
        stopPropagation: () => void;
        dataTransfer: { files: any };
    }) => {
        e.preventDefault();
        e.stopPropagation();

        const { files } = e.dataTransfer;

        if (files && files.length) {
            console.log(files);
            setTopicFileList(files);
        }
    };
    const handleRemoveFile = (file: File) => {
        return (event: React.MouseEvent) => {
            const newFileArray: Array<File> = formattedTopicFiles.filter((currFile) => {
                return currFile.name != file.name;
            });
            setFormattedTopicFiles(newFileArray);
            console.log(newFileArray);
            event.preventDefault();
        };
    };
    const handleCloseModal = () => {
        props.setIsOpen(false);
        setTopicFileList(null);
        setFormattedTopicFiles([]);
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
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // 👈️ prevent page refresh
        setIsSubmitting(true);
        console.log(
            `adding ${formattedTopicFiles.length} files to topic ${props.topicDetails!.topic_id}`
        );
    };

    // utiliastion of 2 useEffects to workaround delayed referencing by useRef
    useEffect(() => {
        setReferencing(!referencing);
    }, [props.isOpen]);
    useEffect(() => {
        if (drop.current) {
            drop.current.addEventListener("dragover", handleDragOver);
            drop.current.addEventListener("drop", handleDrop);
        }
    }, [referencing]);
    useEffect(() => {
        setFormattedTopicFiles(Array.from(topicFileList ? topicFileList : []));
    }, [topicFileList]);
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
                                    <div className="flex flex-row justify-between">
                                        <Dialog.Title
                                            as="h3"
                                            className="flex items-center justify-center text-center text-lg font-medium leading-6 text-gray-900"
                                        >
                                            {props.topicDetails?.topic_name}
                                        </Dialog.Title>
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 mx-1 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none"
                                            onClick={handleToTopicDetails}
                                        >
                                            Topic Details {`>`}
                                        </button>
                                    </div>
                                    <div className="flex justify-between items-center text-center">
                                        <p className="text-sm text-indigo-600">
                                            {agenciesSelector.agencies
                                                .filter(
                                                    (agency) =>
                                                        agency.agency_id ==
                                                        props.topicDetails?.agency_id
                                                )
                                                .map((agency) => agency.long_name)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm truncate text-ellipsis w-full overflow-hidden text-start col-span-4 text-gray-500">
                                            {props.topicDetails?.description}
                                        </p>
                                    </div>
                                    <div className="flex">
                                        <p className="text-sm truncate text-start col-span-1 text-gray-500 mr-1">
                                            Last updated:
                                        </p>
                                        <p className="text-sm truncate text-start col-span-1 text-gray-500">
                                            {dayjs(
                                                props.topicDetails!.last_update,
                                                "YYYY-MM-DD"
                                            ).format("DD/MM/YYYY")}
                                        </p>
                                    </div>
                                    <form onSubmit={handleSubmit}>
                                        <div
                                            ref={drop}
                                            className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6"
                                        >
                                            <div className="space-y-1 text-center">
                                                <svg
                                                    className="mx-auto h-12 w-12 text-gray-400"
                                                    stroke="currentColor"
                                                    fill="none"
                                                    viewBox="0 0 48 48"
                                                    aria-hidden="true"
                                                >
                                                    <path
                                                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                                <div className="flex text-sm text-gray-600">
                                                    <label className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500">
                                                        <span>Upload a file</span>
                                                        <input
                                                            id="file-upload"
                                                            name="file-upload"
                                                            type="file"
                                                            multiple={true}
                                                            className="sr-only"
                                                        />
                                                    </label>
                                                    <p className="pl-1">or drag and drop</p>
                                                </div>
                                                <p className="text-xs text-gray-500">
                                                    CSV files only
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex flex-row overflow-auto">
                                            {formattedTopicFiles &&
                                                formattedTopicFiles.length > 0 &&
                                                formattedTopicFiles.map((file) => {
                                                    return (
                                                        <div
                                                            key={file.name}
                                                            className="flex flex-row justify-between bg-gray-100 rounded m-1 p-1 border border-gray-300"
                                                        >
                                                            <p className="mr-1">{file.name}</p>
                                                            <IconContext.Provider
                                                                value={{
                                                                    size: "0.75em",
                                                                    color: "white",
                                                                }}
                                                            >
                                                                <div
                                                                    onClick={handleRemoveFile(file)}
                                                                    className="hover:cursor-pointer"
                                                                >
                                                                    <GrClose />
                                                                </div>
                                                            </IconContext.Provider>
                                                        </div>
                                                    );
                                                })}
                                        </div>

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
                                                Publish
                                            </button>
                                        </div>
                                    </form>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
};
export default PublishTopicFileModal;
