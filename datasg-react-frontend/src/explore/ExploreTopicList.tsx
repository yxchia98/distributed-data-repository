import { useEffect } from "react";
import { IconContext } from "react-icons";
import { BiShareAlt } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { fetchAgencies } from "../redux/agencySlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchTopics } from "../redux/topicSlice";
import ExploreTopicCard from "./ExploreTopicCard";

const ExploreTopicList = () => {
    const navigate = useNavigate();
    const topicsSelector = useAppSelector((state) => state.topics);
    const agenciesSelector = useAppSelector((state) => state.agencies);
    const user = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch();

    const fetchTopicsRedux = () => {
        dispatch(fetchTopics());
    };

    const fetchAgenciesRedux = () => {
        dispatch(fetchAgencies());
    };

    useEffect(() => {
        fetchTopicsRedux();
        fetchAgenciesRedux();
    }, []);

    return (
        <div className="topicList">
            {topicsSelector.topics &&
                agenciesSelector.agencies &&
                topicsSelector.topics
                    .filter((topic) => {
                        const cellTopicName = topicsSelector.search.search
                            ? topicsSelector.search.search
                            : topic.topic_name;
                        const cellAgencyId = topicsSelector.search.agency_id
                            ? topicsSelector.search.agency_id
                            : topic.agency_id;
                        return (
                            topic.topic_name.includes(cellTopicName) &&
                            topic.agency_id.includes(cellAgencyId)
                        );
                    })
                    .map((topic) => {
                        return (
                            <ExploreTopicCard
                                key={topic.topic_id}
                                topic_id={topic.topic_id}
                                topic_name={topic.topic_name}
                                agency_id={topic.agency_id}
                                description={topic.description}
                            />
                        );
                    })}
        </div>
    );
};

export default ExploreTopicList;
