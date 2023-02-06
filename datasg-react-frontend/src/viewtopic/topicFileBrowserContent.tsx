import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchSelectedTopicFiles } from "../redux/topicFileSlice";
import dayjs from "dayjs";
import TopicFileActionMenu from "./TopicFileActionMenu";

var customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);

interface TopicFileBrowserContentProps {
    topic_id: string;
    agency_id: string;
}

const TopicFileBrowserContent: React.FC<TopicFileBrowserContentProps> = (props) => {
    const topicFilesSelector = useAppSelector((state) => state.topicFiles);
    const [loading, setLoading] = useState<boolean>(true);
    const dispatch = useAppDispatch();

    // fetch topic files using redux thunk
    const fetchTopicFilesRedux = () => {
        dispatch(fetchSelectedTopicFiles(props.topic_id));
    };

    useEffect(() => {
        topicFilesSelector.status === "loading" ? setLoading(true) : setLoading(false);
    }, [topicFilesSelector]);

    useEffect(() => {
        fetchTopicFilesRedux();
    }, []);
    return (
        <div id="fileBrowserContent" className="">
            <div className="max-w mx-[5%] h-full overflow-auto bg-white bg-local bg-origin-content border-[1px] border-gray-400 rounded">
                <div
                    id="browsertContentTableHeader"
                    className="flex flex-row border-b-[1px] bg-gray-100"
                >
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
                {!loading &&
                    topicFilesSelector.topicFiles.map((topicFile) => {
                        let topicDate = dayjs(topicFile.file_date, "YYYY-MM-DD");
                        return (
                            <div
                                id="browserContentTableRow"
                                key={topicFile.file_id}
                                className="flex flex-row"
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
                                <div className="w-5/12 py-2 px-4 border-r-2">{`${topicDate.format(
                                    "DD/MM/YYYY"
                                )}`}</div>
                                <TopicFileActionMenu file_id={topicFile.file_id} />
                            </div>
                        );
                    })}
            </div>
            {loading && (
                // loading indicator
                <div className="flex justify-center items-center ">
                    <svg
                        width="40"
                        height="40"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        className="animate-spin fill-black mr-2"
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
    );
};

export default TopicFileBrowserContent;
