import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchSelectedTopicFiles } from "../redux/topicFileSlice";
import { fetchAccess } from "../redux/accessSlice";
import dayjs, { Dayjs } from "dayjs";
import TopicFileActionMenu from "./TopicFileActionMenu";

var customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);

interface TopicFileBrowserContentProps {
    topic_id: string;
    agency_id: string;
}

export interface TopicFileType {
    file_id: string;
    topic_id: string;
    agency_id: string;
    file_url: string;
    file_date: Dayjs;
}

const TopicFileBrowserContent: React.FC<TopicFileBrowserContentProps> = (props) => {
    const topicFilesSelector = useAppSelector((state) => state.topicFiles);
    const accessSelector = useAppSelector((state) => state.access);
    const [loading, setLoading] = useState<boolean>(true);
    const dispatch = useAppDispatch();
    const [formattedTopicFiles, setFormattedTopicFiles] = useState<Array<TopicFileType>>([]);
    // fetch topic files using redux thunk
    const fetchTopicFilesRedux = () => {
        dispatch(fetchSelectedTopicFiles(props.topic_id));
    };
    const fetchAccessRedux = () => {
        dispatch(fetchAccess());
    };

    useEffect(() => {
        topicFilesSelector.status === "loading" ? setLoading(true) : setLoading(false);
        let topicFiles: Array<TopicFileType> = [];
        topicFilesSelector.topicFiles.forEach((topicFile) => {
            topicFiles.push({
                file_id: topicFile.file_id,
                topic_id: topicFile.topic_id,
                agency_id: topicFile.agency_id,
                file_url: topicFile.file_url,
                file_date: dayjs(topicFile.file_date, "YYYY-MM-DD"),
            });
        });
        topicFiles.sort((a: TopicFileType, b: TopicFileType) =>
            a.file_date > b.file_date ? 1 : -1
        );
        setFormattedTopicFiles(topicFiles);
    }, [topicFilesSelector]);
    useEffect(() => {
        fetchTopicFilesRedux();
        fetchAccessRedux();
    }, []);

    return (
        <div id="fileBrowserContent" className="h-[70%] p-4">
            <p>{JSON.stringify(accessSelector)}</p>
            <div className="max-w h-full flex flex-col bg-white bg-local bg-origin-content border-[1px] border-gray-400 rounded">
                <div id="browsertContentTableHeader" className="flex flex-row border bg-gray-100">
                    <div className="w-1/12 flex items-center justify-center border-r-2">
                        <input
                            type="checkbox"
                            className="rounded border-2 checked:bg-gray-500 focus:outline-none focus:ring-0 hover:outline-none transition duration-300"
                        />
                    </div>
                    <div className="w-5/12 py-2 px-4 border-r-2 font-semibold">File Name</div>
                    <div className="w-5/12 py-2 px-4 border-r-2 font-semibold">Date </div>
                    <div className="w-1/12 py-2 text-center font-semibold">Action</div>
                </div>
                <div className="overflow-auto flex-1 items-center justify-center">
                    {!loading &&
                        // rendering table rows for each topic file item
                        formattedTopicFiles.map((topicFile) => {
                            return (
                                <div
                                    id="browserContentTableRow"
                                    key={topicFile.file_id}
                                    className="flex flex-row border"
                                >
                                    <div className="w-1/12 flex items-center justify-center border-r-2">
                                        <input
                                            type="checkbox"
                                            className="rounded border-2 checked:bg-gray-500 focus:outline-none focus:ring-0 hover:outline-none transition duration-300"
                                        />
                                    </div>
                                    <div className="w-5/12 py-2 px-4 border-r-2">
                                        {/* get file name, which is the last element of the file url */}
                                        {topicFile.file_url.split("/").slice(-1)}
                                    </div>
                                    <div className="w-5/12 py-2 px-4 border-r-2">{`${topicFile.file_date.format(
                                        "DD/MM/YYYY"
                                    )}`}</div>
                                    <TopicFileActionMenu file={topicFile} setLoading={setLoading} />
                                </div>
                            );
                        })}
                    {loading && (
                        // show loading indicator if it is still loading
                        <div className="flex z-10 h-full items-center justify-center ">
                            <svg
                                width="40"
                                height="40"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                                className="animate-spin fill-black"
                            >
                                <path
                                    d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
                                    opacity=".25"
                                />
                                <path d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z" />
                            </svg>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TopicFileBrowserContent;
