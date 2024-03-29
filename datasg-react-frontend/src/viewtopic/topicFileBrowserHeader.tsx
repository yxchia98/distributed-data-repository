import { IconContext } from "react-icons";
import { BiShareAlt } from "react-icons/bi";
import { IoChevronBackOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import saveAs from "file-saver";
import { clearChecked } from "../redux/topicFileSlice";
import JSZip from "jszip";
import { useEffect, useState } from "react";
import HeaderDownloadButton from "./HeaderDownloadButton";
import HeaderPublishButton from "./HeaderPublishButton";
import PublishTopicFileModal from "./PublishTopicFileModal";
import Datepicker from "react-tailwindcss-datepicker";
import { SelectedDateRange } from "./TopicFileBrowser";
import { DateValueType } from "react-tailwindcss-datepicker/dist/types";
import dayjs from "dayjs";
import { FetchUserDetailsData } from "../redux/userSlice";
import TopicDescModal from "./TopicDescModal";

interface TopicFileBrowserHeaderProps {
    topic_id: string;
    agency_id: string;
    readAccess: boolean;
    writeAccess: boolean;
    datePickerValue: SelectedDateRange | null;
    setDatePickerValue: React.Dispatch<React.SetStateAction<SelectedDateRange | null>>;
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

const TopicFileBrowserHeader: React.FC<TopicFileBrowserHeaderProps> = (props) => {
    const dispatch = useAppDispatch();

    const userSelector = useAppSelector((state) => state.user);
    const topicsSelector = useAppSelector((state) => state.topics);
    const agenciesSelector = useAppSelector((state) => state.agencies).agencies;
    const topicFileSelector = useAppSelector((state) => state.topicFiles);
    const [isDownloading, setIsDownloading] = useState<boolean>(false);
    const [isPublishing, setIsPublishing] = useState<boolean>(false);
    const [showDescModal, setShowDescModal] = useState<boolean>(false);
    const [isPublishModalOpen, setIsPublishModalOpen] = useState<boolean>(false);
    const [topicOwner, setTopicOwner] = useState<FetchUserDetailsData | null>(null);
    const navigate = useNavigate();

    const handleDatePickerValueChange = (
        newValue: DateValueType,
        e?: HTMLInputElement | null | undefined
    ) => {
        console.log("newValue:", newValue);
        props.setDatePickerValue(newValue);
    };

    const handleDescOnClick = () => {
        setShowDescModal(true);
    };

    const handleCloseDescModal = () => {
        setShowDescModal(false);
    };

    const handleDownloadOnClick = async () => {
        setIsDownloading(true);
        const downloadList = topicFileSelector.checked;
        if (downloadList.length <= 0) {
            console.log("no files selected!");
            setIsDownloading(false);
            return false;
        }
        // fetch blobs of files and zip them
        var zip = new JSZip();

        // get current topic name to set in downloaded file
        const topicName = topicsSelector.topics
            .filter((topic) => topic.topic_id === props.topic_id)
            .map((topic) => topic.topic_name);

        // iterate and consolidate files
        await Promise.all(
            downloadList.map(async (file_id) => {
                const downloadTopicFileConfigurationObject: AxiosRequestConfig = {
                    method: "get",
                    url: `${process.env.REACT_APP_DATA_READER_API_URL}topic/downloadSingleFile`,
                    headers: {},
                    params: {
                        file_id: file_id,
                    },
                };
                const downloadTopicFileResponse: AxiosResponse<DownloadTopicFileResponse> =
                    await axios(downloadTopicFileConfigurationObject);
                if (downloadTopicFileResponse.data.data) {
                    zip.file(
                        downloadTopicFileResponse.data.data.fileName,
                        downloadTopicFileResponse.data.data.blobString
                    );
                }
            })
        );

        zip.generateAsync({ type: "blob" }).then((blob) => {
            saveAs(blob, `${topicName}.zip`);
        });
        setIsDownloading(false);
        return true;
    };

    const handlePublishOnClick = () => {
        setIsPublishing(true);
        setIsPublishModalOpen(true);
        return true;
    };

    const handleBackOnClick = () => {
        dispatch(clearChecked());
        navigate(-1);
    };
    useEffect(() => {
        if (!isPublishModalOpen) {
            setIsPublishing(false);
        }
    }, [isPublishModalOpen]);
    useEffect(() => {
        // setTopicOwner(user);
    }, [props.topic_id]);
    return (
        <div id="fileBrowserHeader" className="py-5 px-5 h-[30%]">
            <PublishTopicFileModal
                topicDetails={topicsSelector.topics.find(
                    (topic) => topic.topic_id === props.topic_id
                )}
                isOpen={isPublishModalOpen}
                setIsOpen={setIsPublishModalOpen}
            />
            <TopicDescModal
                isOpen={showDescModal}
                content={topicsSelector.currentTopic.description}
                handleCloseModal={handleCloseDescModal}
            />
            <div className="flow-root mb-2">
                <div className="float-left">
                    <button
                        onClick={handleBackOnClick}
                        className="flex flex-row items-center py-2 border border-gray-300 bg-white text-gray-700 shadow-sm rounded-md hover:bg-gray-50 transition"
                    >
                        <IconContext.Provider value={{ size: "1.5em", color: "rgb(156 163 175)" }}>
                            <div className="">
                                <IoChevronBackOutline />
                            </div>
                            <div className=" pr-3">Back</div>
                        </IconContext.Provider>
                    </button>
                </div>
            </div>
            <div className="flex flex-row">
                <div className="font-semibold xl:text-3xl md:text-2xl sm:text-xl text-gray-700">
                    {
                        // filter topics in redux store and retrieve topic name
                        // topicsSelector.topics
                        //     .filter((topic) => topic.topic_id === props.topic_id)
                        //     .map((topic) => topic.topic_name)
                        topicsSelector.currentTopic.topic_name
                    }
                </div>
            </div>
            <div className="grid grid-rows-2 grid-cols-3 h-[35%]">
                <div className="row-start-1 col-span-2 row-span-1 flex items-center xl:text-xl md:text-lg sm:text-md text-indigo-600">
                    {
                        // filter agency list and get corresponding agency's long description
                        agenciesSelector
                            .filter((agency) => agency.agency_id === props.agency_id)
                            .map((agency) => agency.long_name)
                    }
                </div>
                <div className="row-start-2 row-span-1 col-span-2 w-full flex items-center justify-between whitespace-nowrap">
                    <div
                        onClick={handleDescOnClick}
                        className="w-full h-full xl:text-lg md:text-md sm:text-sm text-gray-700 overflow-x-hidden text-ellipsis overflow-y-hidden inline-block"
                    >
                        {
                            // filter topics in redux store and get corresponding topics's long description
                            topicsSelector.topics
                                .filter((topic) => topic.topic_id === props.topic_id)
                                .map((topic) => topic.description)
                        }
                    </div>
                </div>
                <div className="row-start-1 col-start-3 row-span-2 flex items-center justify-self-end mr-[2%]">
                    <div>
                        <Datepicker
                            placeholder="Select date"
                            value={props.datePickerValue}
                            onChange={handleDatePickerValueChange}
                            primaryColor={"indigo"}
                            displayFormat={"DD/MM/YY"}
                            startFrom={dayjs().subtract(1, "month").toDate()}
                            showShortcuts={true}
                            readOnly={true}
                            disabled={!props.readAccess}
                        />
                    </div>
                </div>
            </div>
            <div className="w-full grid grid-cols-6 justify-between items-center">
                <div className="col-span-2 col-start-1 flex flex-row items-center text-gray-500">{`Topic Owner: ${topicsSelector.currentTopicOwner.first_name} ${topicsSelector.currentTopicOwner.last_name} (${topicsSelector.currentTopicOwner.email})`}</div>
                <div className="col-span-2 col-start-3 flex flex-row justify-center items-center">
                    {/* group by tab */}
                </div>
                <div className="flex flex-row justify-self-end mr-[2%] col-start-5 col-span-2 ">
                    {/* <select className="m-1 inline-flex justify-center rounded-md border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50">
                        <option>Action</option>
                        <option>option2</option>
                        <option>option3</option>
                    </select> */}
                    <HeaderDownloadButton
                        isDownloading={isDownloading}
                        setIsDownloading={setIsDownloading}
                        handleOnClick={handleDownloadOnClick}
                        disabled={!props.readAccess}
                    />
                    <HeaderPublishButton
                        isPublishing={isPublishing}
                        setIsPublishing={setIsPublishing}
                        handleOnClick={handlePublishOnClick}
                        disabled={!props.writeAccess}
                    />
                </div>
            </div>
        </div>
    );
};

export default TopicFileBrowserHeader;
