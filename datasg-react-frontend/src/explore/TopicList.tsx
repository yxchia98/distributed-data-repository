import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAgencies } from "../redux/agencySlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchTopics } from "../redux/topicSlice";

const TopicList = () => {
    const navigate = useNavigate();
    const topicsSelector = useAppSelector((state) => state.topics);
    const agenciesSelector = useAppSelector((state) => state.agencies);
    const user = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch();
    const fetchTopicsRedux = () => {
        if (agenciesSelector.status == "idle") {
            console.log("fetching...");
            dispatch(fetchTopics());
        }
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
            <p>{JSON.stringify(agenciesSelector.agencies)}</p>
            {topicsSelector.topics.map((topic) => {
                return (
                    <div
                        key={topic.topic_id}
                        className="max-w py-5 px-5 mx-[10%] my-[1%] overflow-hidden bg-white bg-local bg-origin-content rounded-lg"
                    >
                        <div className="text-left">
                            <div className="font-semibold xl:text-3xl md:text-2xl sm:text-xl text-gray-700">
                                {topic.topic_name}
                            </div>
                            <div className="flex"></div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default TopicList;
