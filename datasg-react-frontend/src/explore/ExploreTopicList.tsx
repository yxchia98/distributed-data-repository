import { useEffect } from "react";
import { IconContext } from "react-icons";
import { BiShareAlt } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { fetchAgencies } from "../redux/agencySlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchTopics } from "../redux/topicSlice";
import ExploreTopicCard from "./ExploreTopicCard";
import ExploreTopicEmptyPage from "./ExploreTopicEmptyPage";

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
        <div className="topicList h-[86%] w-full">
            <div className="flex justify-between max-w mx-[10%] my-[1%] overflow-auto bg-local bg-origin-content">
                <div className="text-3xl font-semibold px-5">Explore Topics</div>
            </div>
            {topicsSelector.topics &&
                topicsSelector.topics.length > 0 &&
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
            {topicsSelector && topicsSelector.topics.length <= 0 && <ExploreTopicEmptyPage />}
        </div>
    );
};

export default ExploreTopicList;
