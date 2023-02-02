import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import NavigationBar from "../common/NavigationBar";
import { fetchAgencies } from "../redux/agencySlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchSelectedTopicFiles } from "../redux/topicFileSlice";
import { fetchTopics } from "../redux/topicSlice";
import TopicFileBrowser from "./topicFileBrowser";

const ViewTopic: React.FC = () => {
    const location = useLocation();
    const topicsSelector = useAppSelector((state) => state.topics);
    const agenciesSelector = useAppSelector((state) => state.agencies);
    const topicFilesSelector = useAppSelector((state) => state.topicFiles);
    const dispatch = useAppDispatch();

    // fetch topics using redux thunk
    const fetchTopicsRedux = () => {
        if (topicsSelector.status == "idle") {
            dispatch(fetchTopics());
        }
    };

    // fetch agencies using redux thunk
    const fetchAgenciesRedux = () => {
        if (agenciesSelector.status == "idle") {
            dispatch(fetchAgencies());
        }
    };

    useEffect(() => {
        fetchTopicsRedux();
        fetchAgenciesRedux();
    }, []);
    return (
        <div className="viewTopic bg-gray-100 h-screen overflow-auto">
            <NavigationBar current="explore" />
            <p>{JSON.stringify(topicsSelector)}</p>
            <p>{JSON.stringify(topicFilesSelector)}</p>
            <p>{JSON.stringify(location.state)}</p>
            <TopicFileBrowser
                topic_id={location.state.topic_id}
                agency_id={location.state.agency_id}
            />
        </div>
    );
};

export default ViewTopic;
