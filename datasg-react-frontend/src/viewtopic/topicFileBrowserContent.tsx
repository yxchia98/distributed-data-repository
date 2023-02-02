import { useEffect, useState } from "react";
import { IconContext } from "react-icons";
import { BiShareAlt } from "react-icons/bi";
import { IoChevronBackOutline } from "react-icons/io5";
import { FiArrowDownCircle, FiArrowUpCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchSelectedTopicFiles } from "../redux/topicFileSlice";

interface TopicFileBrowserContentProps {
    topic_id: string;
    agency_id: string;
}

const TopicFileBrowserContent: React.FC<TopicFileBrowserContentProps> = (props) => {
    const topicsSelector = useAppSelector((state) => state.topics).topics;
    const agenciesSelector = useAppSelector((state) => state.agencies).agencies;
    const topicFilesSelector = useAppSelector((state) => state.topicFiles);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    // fetch topic files using redux thunk
    const fetchTopicFilesRedux = () => {
        dispatch(fetchSelectedTopicFiles(props.topic_id));
    };

    useEffect(() => {
        fetchTopicFilesRedux();
    }, []);
    return (
        <div className="max-w mx-[10%] overflow-hidden bg-white bg-local bg-origin-content rounded-b-xl">
            <div className="max-w mx-[5%] overflow-hidden bg-white bg-local bg-origin-content border-2 rounded">
                <div className="flex flex-row justify-center items-center">
                    <div className="w-1/12 text-center border-r-2">heading 1</div>
                    <div className="w-5/12 text-center border-r-2">heading 2</div>
                    <div className="w-5/12 text-center border-r-2">heading 3</div>
                    <div className="w-1/12 text-center ">heading 4</div>
                </div>
            </div>

            {loading && (
                <div className="flex justify-center items-center">
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
