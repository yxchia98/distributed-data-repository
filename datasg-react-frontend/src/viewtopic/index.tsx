import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import NavigationBar from "../common/NavigationBar";
import { fetchAgencies } from "../redux/agencySlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchTopics, setCurrentTopic } from "../redux/topicSlice";
import TopicFileBrowser from "./TopicFileBrowser";

const ViewTopic: React.FC = () => {
    const location = useLocation();
    const topicsSelector = useAppSelector((state) => state.topics);
    const agenciesSelector = useAppSelector((state) => state.agencies);
    const dispatch = useAppDispatch();

    useEffect(() => {
        // fetch topics using redux thunk
        const fetchTopicsRedux = () => {
            if (topicsSelector.status === "idle") {
                dispatch(fetchTopics());
            }
        };

        // fetch agencies using redux thunk
        const fetchAgenciesRedux = () => {
            if (agenciesSelector.status === "idle") {
                dispatch(fetchAgencies());
            }
        };
        fetchTopicsRedux();
        fetchAgenciesRedux();
    }, []);
    return (
        <div className="viewTopic bg-gray-100 h-screen overflow-auto">
            <NavigationBar current="explore" />
            <TopicFileBrowser
                topic_id={location.state.topic_id}
                agency_id={location.state.agency_id}
            />
        </div>
    );
};

export default ViewTopic;
