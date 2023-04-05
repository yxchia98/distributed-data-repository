import { Menu, Transition } from "@headlessui/react";
import { Dispatch, Fragment, SetStateAction } from "react";
import { IconContext } from "react-icons";
import { SlOptionsVertical } from "react-icons/sl";
import { BiDownload, BiEdit, BiTrash } from "react-icons/bi";
import { TopicFileType } from "./TopicFileBrowserContent";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import saveAs from "file-saver";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setRefresh } from "../redux/topicFileSlice";

interface TopicFileActionMenuProps {
    file: TopicFileType;
    downloadable: boolean;
    deletable: boolean;
    setLoading: Dispatch<SetStateAction<boolean>>;
}

interface DownloadTopicFileResponse {
    error: boolean;
    message: string;
    data: FileDataResponse;
}

interface FileDataResponse {
    fileName: string;
    blobString: string;
}

interface DeleteFileResponse {
    error: boolean;
    message: string;
}

const TopicFileActionMenu: React.FC<TopicFileActionMenuProps> = (props) => {
    const dispatch = useAppDispatch();
    const handleDownloadSingleFile = async (e: any) => {
        // fetch blob of single respective file
        const downloadTopicFileConfigurationObject: AxiosRequestConfig = {
            method: "get",
            url: `${process.env.REACT_APP_DATA_READER_API_URL}topic/downloadSingleFile`,
            headers: {},
            params: {
                file_id: e.target.value,
            },
        };
        const downloadTopicFileResponse: AxiosResponse<DownloadTopicFileResponse> = await axios(
            downloadTopicFileConfigurationObject
        );
        console.log(downloadTopicFileResponse.data);
        if (downloadTopicFileResponse.data.data) {
            const blob = new Blob([downloadTopicFileResponse.data.data.blobString], {
                type: 'text/csv;charset=utf-8"',
            });
            saveAs(blob, downloadTopicFileResponse.data.data.fileName);
        }
        return true;
    };
    // const handleDownload = () => {
    //     console.log(`downloading file for file_id: ${props.file.file_id}`);
    //     window.open(props.file.file_url);
    // };

    const deleteFile = async () => {
        console.log(`deleting file:`);
        console.log(props.file);
        let res: DeleteFileResponse = {
            error: true,
            message: "",
        };
        // structure and send delete API request
        const deleteFileFormData: FormData = new FormData();
        deleteFileFormData.append("file_id", props.file.file_id);
        const deleteFileConfigObject: AxiosRequestConfig = {
            method: "delete",
            url: `${process.env.REACT_APP_DATA_WRITER_API_URL}topic/deletefile`,
            data: deleteFileFormData,
            withCredentials: true,
        };
        try {
            const deleteFileResponse: AxiosResponse<DeleteFileResponse> = await axios(
                deleteFileConfigObject
            );
            console.log(deleteFileResponse.data);
            res.error = deleteFileResponse.data.error;
            res.message = deleteFileResponse.data.message;
            if (res.error) {
                res.message = "Error deleting file";
                return false;
            }
            return true;
        } catch (error: any) {
            console.log(error.message);
            res.message = error.message;
            return false;
        }
    };
    const handleDeleteOnClick = async () => {
        const deleteSuccess = await deleteFile();
        if (deleteSuccess) {
            dispatch(setRefresh(true));
        }
    };

    // const handleEdit = () => {
    //     console.log(`editing file for file_id: ${props.file.file_id}`);
    // };
    return (
        <div className="w-1/12 py-2 flex items-center justify-center">
            {/* <Menu as="div" className="absolute inline-block text-left"> */}
            <Menu as="div" className="relative text-left">
                <div>
                    <Menu.Button className="inline-flex w-full justify-center px-4 py-2 text-sm">
                        <IconContext.Provider value={{ size: "1em", color: "rgb(107 114 128)" }}>
                            <SlOptionsVertical />
                        </IconContext.Provider>
                    </Menu.Button>
                </div>
                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Menu.Items className="absolute right-0 z-10 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="px-1 py-1 ">
                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        value={props.file.file_id}
                                        onClick={handleDownloadSingleFile}
                                        className={`${
                                            active ? "bg-indigo-500 text-white" : "text-gray-900"
                                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                    >
                                        {active ? (
                                            <IconContext.Provider
                                                value={{
                                                    size: "1.5em",
                                                }}
                                            >
                                                <div className="mr-2 h-5 w-5 flex items-center justify-center">
                                                    <BiDownload />
                                                </div>
                                            </IconContext.Provider>
                                        ) : (
                                            <IconContext.Provider
                                                value={{
                                                    size: "1.5em",
                                                }}
                                            >
                                                <div className="mr-2 h-5 w-5 flex items-center text-indigo-500 justify-center">
                                                    <BiDownload />
                                                </div>
                                            </IconContext.Provider>
                                        )}
                                        Download
                                    </button>
                                )}
                            </Menu.Item>
                            {/* <Menu.Item>
                                {({ active }) => (
                                    <button
                                        onClick={handleEdit}
                                        className={`${
                                            active ? "bg-indigo-500 text-white" : "text-gray-900"
                                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                    >
                                        {active ? (
                                            <IconContext.Provider
                                                value={{
                                                    size: "1.5em",
                                                }}
                                            >
                                                <div className="mr-2 h-5 w-5 flex items-center justify-center">
                                                    <BiEdit />
                                                </div>
                                            </IconContext.Provider>
                                        ) : (
                                            <IconContext.Provider
                                                value={{
                                                    size: "1.5em",
                                                }}
                                            >
                                                <div className="mr-2 h-5 w-5 flex items-center text-indigo-500 justify-center">
                                                    <BiEdit />
                                                </div>
                                            </IconContext.Provider>
                                        )}
                                        Edit
                                    </button>
                                )}
                            </Menu.Item> */}
                        </div>
                        {props.deletable && (
                            <div className="px-1 py-1">
                                <Menu.Item>
                                    {({ active }) => (
                                        <button
                                            onClick={handleDeleteOnClick}
                                            className={`${
                                                active
                                                    ? "bg-indigo-500 text-white"
                                                    : "text-gray-900"
                                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                        >
                                            {active ? (
                                                <IconContext.Provider
                                                    value={{
                                                        size: "1.5em",
                                                    }}
                                                >
                                                    <BiTrash className="mr-2 h-5 w-5 flex items-centerjustify-center" />
                                                </IconContext.Provider>
                                            ) : (
                                                <IconContext.Provider
                                                    value={{
                                                        size: "1.5em",
                                                    }}
                                                >
                                                    <BiTrash className="mr-2 h-5 w-5 flex items-center text-indigo-500 justify-center" />
                                                </IconContext.Provider>
                                            )}
                                            Delete
                                        </button>
                                    )}
                                </Menu.Item>
                            </div>
                        )}
                    </Menu.Items>
                </Transition>
            </Menu>
        </div>
    );
};

const DownloadActive = () => {};

export default TopicFileActionMenu;
