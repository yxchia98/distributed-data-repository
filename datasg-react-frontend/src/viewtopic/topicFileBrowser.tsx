import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchSelectedTopicFiles } from "../redux/topicFileSlice";
import TopicFileBrowserHeader from "./topicFileBrowserHeader";
import TopicFileBrowserContent from "./topicFileBrowserContent";

interface TopicFileBrowserProps {
    topic_id: string;
    agency_id: string;
}

const TopicFileBrowser: React.FC<TopicFileBrowserProps> = (props) => {
    const topicsSelector = useAppSelector((state) => state.topics).topics;
    const agenciesSelector = useAppSelector((state) => state.agencies).agencies;
    const topicFilesSelector = useAppSelector((state) => state.topicFiles);
    const navigate = useNavigate();
    const user = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch();

    // fetch topic files using redux thunk
    const fetchTopicFilesRedux = () => {
        dispatch(fetchSelectedTopicFiles(props.topic_id));
    };

    useEffect(() => {
        fetchTopicFilesRedux();
    }, []);

    const handleBackOnClick = () => {
        console.log(`clicked!`);
        navigate(-1);
    };

    return (
        <div>
            <TopicFileBrowserHeader topic_id={props.topic_id} agency_id={props.agency_id} />
            <TopicFileBrowserContent topic_id={props.topic_id} agency_id={props.agency_id} />
        </div>
    );
};

export default TopicFileBrowser;
