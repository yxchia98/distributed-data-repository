import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import NavigationBar from "../common/NavigationBar";
import { fetchAgencies } from "../redux/agencySlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
    fetchTopics,
    setCurrentTopicWithDetails,
    setCurrentTopicWithId,
    TopicDetails,
} from "../redux/topicSlice";
import TopicFileBrowser from "./TopicFileBrowser";

const ViewTopic: React.FC = () => {
    const location = useLocation();
    const topicsSelector = useAppSelector((state) => state.topics);
    const agenciesSelector = useAppSelector((state) => state.agencies);
    const dispatch = useAppDispatch();

    const fetchDataOnCardClickRedux = async () => {
        let selectedTopic: TopicDetails = {
            topic_id: "",
            user_id: "",
            agency_id: "",
            topic_name: "",
            topic_url: "",
            description: "",
            last_update: "",
        };
        const foundTopic = topicsSelector.topics.find(
            (topic) => topic.topic_id === location.state.topic_id
        );
        selectedTopic = foundTopic ? foundTopic : selectedTopic;
        dispatch(setCurrentTopicWithDetails(selectedTopic));
    };

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
        fetchDataOnCardClickRedux();
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
