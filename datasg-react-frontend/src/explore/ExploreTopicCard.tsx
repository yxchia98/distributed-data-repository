import { useEffect } from "react";
import { IconContext } from "react-icons";
import { BiShareAlt } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { fetchAgencies } from "../redux/agencySlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
    fetchTopics,
    setCurrentTopicWithDetails,
    setCurrentTopicWithId,
    TopicDetails,
} from "../redux/topicSlice";

interface TopicCardProps {
    key: string;
    topic_id: string;
    topic_name: string;
    agency_id: string;
    description: string;
}

const TopicCard: React.FC<TopicCardProps> = (props) => {
    const navigate = useNavigate();
    const agenciesSelector = useAppSelector((state) => state.agencies);
    const topicsSelector = useAppSelector((state) => state.topics);
    const dispatch = useAppDispatch();

    const fetchAgenciesRedux = () => {
        dispatch(fetchAgencies());
    };

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
        const foundTopic = topicsSelector.topics.find((topic) => topic.topic_id === props.topic_id);
        selectedTopic = foundTopic ? foundTopic : selectedTopic;
        dispatch(setCurrentTopicWithDetails(selectedTopic));
    };
    useEffect(() => {
        fetchAgenciesRedux();
    }, []);
    const handleCardOnClick = () => {
        // pre-emptively fetch necessary information via redux
        // console.log(`clicked on ${e.target.value.topic_name}, ${e.target.value.topic_id}`);
        fetchDataOnCardClickRedux();
        return navigate("/viewTopic", {
            state: {
                topic_id: props.topic_id,
                topic_name: props.topic_name,
                agency_id: props.agency_id,
                description: props.description,
            },
        });
    };

    return (
        <div
            key={props.topic_id}
            onClick={handleCardOnClick}
            className="max-w py-5 px-5 mx-[10%] my-[1%] overflow-hidden bg-white bg-local bg-origin-content rounded-lg hover:shadow hover:cursor-pointer"
        >
            <div className="flex flex-row">
                <div className="font-semibold xl:text-3xl md:text-2xl sm:text-xl text-gray-700">
                    {props.topic_name}
                </div>
            </div>
            <div className="pt-0 pb-2 xl:text-xl md:text-lg sm:text-md text-indigo-600">
                {
                    // filter agency list and get corresponding agency's long description
                    agenciesSelector.agencies
                        .filter((agency) => agency.agency_id == props.agency_id)
                        .map((agency) => agency.long_name)
                }
            </div>
            <div className="xl:text-lg md:text-md sm:text-sm whitespace-nowrap overflow-x-hidden text-ellipsis">
                {props.description}
            </div>
        </div>
    );
};

export default TopicCard;
