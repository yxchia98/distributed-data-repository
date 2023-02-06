import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchSelectedTopicFiles } from "../redux/topicFileSlice";
import TopicFileBrowserHeader from "./TopicFileBrowserHeader";
import TopicFileBrowserContent from "./TopicFileBrowserContent";

interface TopicFileBrowserProps {
    topic_id: string;
    agency_id: string;
}

const TopicFileBrowser: React.FC<TopicFileBrowserProps> = (props) => {
    const dispatch = useAppDispatch();

    // fetch topic files using redux thunk
    const fetchTopicFilesRedux = () => {
        dispatch(fetchSelectedTopicFiles(props.topic_id));
    };

    useEffect(() => {
        fetchTopicFilesRedux();
    }, []);

    return (
        <div className="w-screen overflow-hidden">
            <div className="max-w h-full py-2.5 px-2.5 mt-[2.5%] overflow-hidden bg-white bg-local bg-origin-content rounded-xl">
                <TopicFileBrowserHeader topic_id={props.topic_id} agency_id={props.agency_id} />
                <TopicFileBrowserContent topic_id={props.topic_id} agency_id={props.agency_id} />
            </div>
        </div>
    );
};

export default TopicFileBrowser;
