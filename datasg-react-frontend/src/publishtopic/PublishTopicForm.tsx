import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { Fragment, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAccess } from "../redux/accessSlice";
import { fetchAgencies } from "../redux/agencySlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchTopics } from "../redux/topicSlice";
import { fetchUser, UserDetails } from "../redux/userSlice";
import { CgSpinner } from "react-icons/cg";
import { IconContext } from "react-icons";
import { GrClose } from "react-icons/gr";
import PublishTopicModal from "./PublishTopicModal";

interface NewTopicResponse {
    error: boolean;
    message: string;
    topic_id: string;
}

const PublishTopicForm: React.FC = () => {
    const userSelector: UserDetails = useAppSelector((state) => state.user.user);
    const agenciesSelector = useAppSelector((state) => state.agencies);
    const accessSelector = useAppSelector((state) => state.access);
    const topicsSelector = useAppSelector((state) => state.topics);

    const [topicName, setTopicName] = useState<string>("");
    const [topicDesc, setTopicDesc] = useState<string>("");
    const [topicAgencyId, setTopicAgencyId] = useState<string>("");
    const [topicFileList, setTopicFileList] = useState<FileList | null>(null);
    const [formattedTopicFiles, setFormattedTopicFiles] = useState<Array<File>>([]);

    const [isTopicNameValid, setIsTopicNameValid] = useState<boolean>(false);
    const [isTopicDescValid, setIsTopicDescValid] = useState<boolean>(false);
    const [isTopicAgencyValid, setIsTopicAgencyValid] = useState<boolean>(false);
    const [isTopicFileValid, setIsTopicFileValid] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const [topicNameBorderColor, setTopicNameBorderColor] = useState<string>("gray-300");
    const [topicDescBorderColor, setTopicDescBorderColor] = useState<string>("gray-300");
    const [topicAgencyBorderColor, setTopicAgencyBorderColor] = useState<string>("gray-300");
    const [topicFileBorderColor, setTopicFileBorderColor] = useState<string>("gray-300");

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const fetchPublishTopicFormInfoRedux = () => {
        dispatch(fetchUser());
        dispatch(fetchAccess());
        dispatch(fetchAgencies());
        dispatch(fetchTopics());
    };

    // handle drag and drop
    const [dragActive, setDragActive] = useState<boolean>(false);

    // handle drag events
    const drop = useRef<any>(null);
    useEffect(() => {
        console.log(drop);
        drop.current.addEventListener("dragover", handleDragOver);
        drop.current.addEventListener("drop", handleDrop);

        // return () => {
        //     drop.current.removeEventListener("dragover", handleDragOver);
        //     drop.current.removeEventListener("drop", handleDrop);
        // };
    }, []);
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

    // Handle change of input form elements
    const handleTopicNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTopicName(e.target.value);
    };
    const handleTopicDescChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTopicDesc(e.target.value);
    };
    const handleTopicAgencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setTopicAgencyId(e.target.value);
    };
    const handleTopicFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.files);
        setTopicFileList(e.target.files);
    };

    // Handle partial validity checks when users blur fields
    const handleTopicNameBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (
            e.target.value &&
            !topicsSelector.topics.find((topic) => topic.topic_name === e.target.value)
        ) {
            setIsTopicNameValid(true);
            setTopicNameBorderColor("gray-300");
        } else {
            setIsTopicNameValid(false);
            setTopicNameBorderColor("red-500");
        }
    };
    const handleTopicDescBlur = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (e.target.value) {
            setIsTopicDescValid(true);
            setTopicDescBorderColor("gray-300");
        } else {
            setIsTopicDescValid(false);
            setTopicDescBorderColor("red-500");
        }
    };
    const handleTopicAgencyBlur = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (e.target.value) {
            setIsTopicAgencyValid(true);
            setTopicAgencyBorderColor("gray-300");
        } else {
            setIsTopicAgencyValid(false);
            setTopicAgencyBorderColor("red-500");
        }
    };
    const handleTopicFileBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTopicFileList(e.target.files);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // 👈️ prevent page refresh
        setIsSubmitting(true);
        // check for any invalid form inputs and show modal
        if (!(isTopicNameValid || isTopicDescValid || isTopicAgencyValid)) {
            console.log("Not all fields properly filled up!");
            return false;
        }
        console.log("submitting...");
        try {
            const createTopicFormData: FormData = new FormData();

            createTopicFormData.append("topic_name", topicName);
            createTopicFormData.append("user_id", userSelector.user_id);
            createTopicFormData.append("agency_id", topicAgencyId);
            createTopicFormData.append("topic_description", topicDesc);

            // for (var key of Array.from(createTopicFormData.entries())) {
            //     console.log(key[0] + ", " + key[1]);
            // }
            // send POST request to create topic
            const createTopicConfigurationObject: AxiosRequestConfig = {
                method: "post",
                url: `${process.env.REACT_APP_DATA_WRITER_API_URL}topic/create`,
                data: createTopicFormData,
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
            };

            const createTopicResponse: AxiosResponse<NewTopicResponse> = await axios(
                createTopicConfigurationObject
            );

            // get new topic id, and add default write access for owner
            const createWriteAccessFormData: FormData = new FormData();
            createWriteAccessFormData.append("user_id", userSelector.user_id);
            createWriteAccessFormData.append("topic_id", createTopicResponse.data.topic_id);
            const createWriteAccessConfigurationObject: AxiosRequestConfig = {
                method: "post",
                url: `${process.env.REACT_APP_DATA_WRITER_API_URL}auth/write`,
                data: createWriteAccessFormData,
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
            };
            const createWriteAccessResponse = await axios(createWriteAccessConfigurationObject);

            // Uploaded files into newly-created topic, if any
            formattedTopicFiles.forEach(async (file) => {
                const uploadTopicFileFormData: FormData = new FormData();
                uploadTopicFileFormData.append("topic_id", createTopicResponse.data.topic_id);
                uploadTopicFileFormData.append("uploaded_file", file);
                const uploadTopicFileConfigurationObject: AxiosRequestConfig = {
                    method: "post",
                    url: `${process.env.REACT_APP_DATA_WRITER_API_URL}topic/publish`,
                    data: uploadTopicFileFormData,
                    headers: { "Content-Type": "multipart/form-data" },
                };
                const uploadTopicFileResponse = await axios(uploadTopicFileConfigurationObject);
            });
            console.log(createTopicResponse.data);
            console.log(createWriteAccessResponse.data);
            setIsSubmitting(false);
            setIsModalOpen(true);
            return true;
        } catch (error: any) {
            console.log(error.response.data);
            setIsSubmitting(false);
            return false;
        }
    };
    const handleCancel = async () => {
        navigate(-1);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        navigate("/publish");
    };

    useEffect(() => {
        fetchPublishTopicFormInfoRedux();
    }, []);
    useEffect(() => {
        setFormattedTopicFiles(Array.from(topicFileList ? topicFileList : []));
    }, [topicFileList]);
    useEffect(() => {
        setTopicAgencyId(userSelector.agency_id);
    }, [userSelector]);

    const timeout = (ms: number) => {
        return new Promise((resolve) => setTimeout(resolve, ms));
    };

    return (
        <div>
            <PublishTopicModal
                title={`Topic ${topicName} successfully created!`}
                message={`Hooray! Start contributing and sharing data to others!`}
                closeMessage={"Got it, thanks!"}
                isOpen={isModalOpen}
                handleCloseModal={handleModalClose}
            />
            <form onSubmit={handleSubmit}>
                <div className="m-[5%]">
                    <div className="md:grid md:grid-cols-4 md:gap-6">
                        <div className="md:col-span-1">
                            <div className="px-4 sm:px-0">
                                <h3 className="text-lg font-medium leading-6 text-gray-900">
                                    Topic Details
                                </h3>
                                <p className="mt-1 text-sm text-gray-600">
                                    This information will be displayed publicly to readers exploring
                                    different topics
                                </p>
                            </div>
                        </div>
                        <div className="mt-5 md:col-span-3 md:mt-0">
                            <div className="shadow sm:overflow-hidden sm:rounded-md">
                                <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                                    <div className="grid grid-cols-3 gap-6">
                                        <div className="col-span-2 sm:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Topic Name
                                            </label>
                                            <div className="mt-1 col-span-2 flex rounded-md shadow-sm border">
                                                <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500">
                                                    topics/
                                                </span>
                                                <input
                                                    type="text"
                                                    name="company-website"
                                                    id="company-website"
                                                    className={`block w-full flex-1 rounded-none rounded-r-md border-${topicNameBorderColor} focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
                                                    placeholder="example_topic"
                                                    value={topicName}
                                                    onChange={handleTopicNameChange}
                                                    onBlur={handleTopicNameBlur}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-span-1">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Agency
                                            </label>
                                            <select
                                                id="agency"
                                                name="agency"
                                                className={`mt-1 block w-full rounded-md border bg-white border-${topicAgencyBorderColor} py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
                                                value={topicAgencyId}
                                                onChange={handleTopicAgencyChange}
                                                onBlur={handleTopicAgencyBlur}
                                            >
                                                <option value={""} key={""}>
                                                    Select agency
                                                </option>
                                                {agenciesSelector.agencies.map((agency: any) => {
                                                    if (
                                                        agency.agency_id === userSelector.agency_id
                                                    ) {
                                                        return (
                                                            <option
                                                                key={agency.agency_id}
                                                                value={agency.agency_id}
                                                            >
                                                                {agency.short_name}
                                                            </option>
                                                        );
                                                    } else {
                                                        return (
                                                            <option
                                                                key={agency.agency_id}
                                                                value={agency.agency_id}
                                                            >
                                                                {agency.short_name}
                                                            </option>
                                                        );
                                                    }
                                                })}
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Description
                                        </label>
                                        <div className="mt-1">
                                            <textarea
                                                id="about"
                                                name="about"
                                                className={`mt-1 block w-full rounded-md border-${topicDescBorderColor} shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
                                                placeholder="e.g. GovTech's existing catalog of cat image URLs"
                                                value={topicDesc}
                                                onChange={handleTopicDescChange}
                                                onBlur={handleTopicDescBlur}
                                            ></textarea>
                                        </div>
                                        <p className="mt-2 text-sm text-gray-500">
                                            Brief description for your topic. Allows readers to
                                            roughly understand what data your topic is providing.
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Topic File (optional)
                                        </label>
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
                                                            onChange={handleTopicFileChange}
                                                            onBlur={handleTopicFileBlur}
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
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="hidden sm:block" aria-hidden="true">
                    <div className="py-5">
                        <div className="border-t border-gray-200"></div>
                    </div>
                </div>

                <div className="m-[5%] sm:mt-0">
                    <div className="md:grid md:grid-cols-4 md:gap-6">
                        <div className="md:col-span-1">
                            <div className="px-4 sm:px-0">
                                <h3 className="text-lg font-medium leading-6 text-gray-900">
                                    Owner Information
                                </h3>
                                <p className="mt-1 text-sm text-gray-600">
                                    The Publisher of a Topic will automatically be the Owner of it.
                                </p>
                            </div>
                        </div>
                        <div className="mt-5 md:col-span-3 md:mt-0">
                            <div className="overflow-hidden shadow sm:rounded-md">
                                <div className="bg-white px-4 py-5 sm:p-6">
                                    <div className="grid grid-cols-6 gap-6">
                                        <div className="col-span-6 sm:col-span-3">
                                            <label className="block text-sm font-medium text-gray-700">
                                                First name
                                            </label>
                                            <input
                                                type="text"
                                                name="first-name"
                                                id="first-name"
                                                readOnly={true}
                                                value={userSelector.first_name}
                                                className="mt-1 block w-full rounded-md bg-gray-50 border-gray-300 shadow-sm focus:ring-0 focus:border-gray-300 sm:text-sm"
                                            />
                                        </div>

                                        <div className="col-span-6 sm:col-span-3">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Last name
                                            </label>
                                            <input
                                                type="text"
                                                name="last-name"
                                                id="last-name"
                                                readOnly={true}
                                                value={userSelector.last_name}
                                                className="mt-1 block w-full rounded-md bg-gray-50 border-gray-300 shadow-sm focus:ring-0 focus:border-gray-300 sm:text-sm"
                                            />
                                        </div>

                                        <div className="col-span-6 sm:col-span-3">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Contact Information
                                            </label>
                                            <input
                                                type="text"
                                                name="contact-information"
                                                id="contact-information"
                                                readOnly={true}
                                                value={userSelector.contact}
                                                className="mt-1 block w-full rounded-md bg-gray-50 border-gray-300 shadow-sm focus:ring-0 focus:border-gray-300 sm:text-sm"
                                            />
                                        </div>

                                        <div className="col-span-6 sm:col-span-3">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Agency
                                            </label>
                                            <select
                                                id="agency"
                                                name="agency"
                                                disabled={true}
                                                className="mt-1 block w-full rounded-md border bg-gray-50 border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                            >
                                                {agenciesSelector.agencies.map((agency: any) => {
                                                    if (
                                                        agency.agency_id === userSelector.agency_id
                                                    ) {
                                                        return (
                                                            <option
                                                                key={agency.agency_id}
                                                                value={agency.agency_id}
                                                            >
                                                                {agency.short_name}
                                                            </option>
                                                        );
                                                    } else {
                                                        return (
                                                            <option
                                                                key={agency.agency_id}
                                                                value={agency.agency_id}
                                                            >
                                                                {agency.short_name}
                                                            </option>
                                                        );
                                                    }
                                                })}
                                            </select>
                                        </div>

                                        <div className="col-span-6 sm:col-span-4">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Email address
                                            </label>
                                            <input
                                                type="text"
                                                name="email-address"
                                                id="email-address"
                                                readOnly={true}
                                                value={userSelector.email}
                                                className="mt-1 block w-full rounded-md bg-gray-50 border-gray-300 shadow-sm focus:ring-0 focus:border-gray-300 sm:text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-end">
                                <button
                                    type="button"
                                    className="inline-flex items-center justify-center rounded-md border bg-white py-2 px-4 m-2 text-sm font-medium shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-offset-2"
                                    onClick={handleCancel}
                                >
                                    <p>Cancel</p>
                                </button>
                                {isSubmitting ? (
                                    <button
                                        type="submit"
                                        className="inline-flex justify-center items-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 m-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-offset-2"
                                    >
                                        <IconContext.Provider
                                            value={{ size: "1.5em", color: "white" }}
                                        >
                                            <div className="mr-2 animate-spin transition transition-duration-500">
                                                <CgSpinner />
                                            </div>
                                        </IconContext.Provider>
                                        <p>Submit</p>
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        className="inline-flex justify-center items-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 m-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-offset-2"
                                    >
                                        <p>Submit</p>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default PublishTopicForm;
