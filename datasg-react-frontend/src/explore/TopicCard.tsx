import { useEffect } from "react";
import { IconContext } from "react-icons";
import { BiShareAlt } from "react-icons/bi";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { fetchAgencies } from "../redux/agenciesSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchTopics } from "../redux/topicsSlice";

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
    const user = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch();
    const fetchAgenciesRedux = () => {
        dispatch(fetchAgencies());
    };
    useEffect(() => {
        fetchAgenciesRedux();
    }, []);

    return (
        <div
            key={props.topic_id}
            onClick={() => console.log(`clicked on ${props.topic_name}, ${props.topic_id}`)}
            className="max-w py-5 px-5 mx-[10%] my-[1%] overflow-hidden bg-white bg-local bg-origin-content rounded-lg hover:shadow hover:cursor-pointer"
        >
            <div className="flex flex-row">
                <div className="font-semibold xl:text-3xl md:text-2xl sm:text-xl text-gray-700">
                    {props.topic_name}
                </div>
                <IconContext.Provider value={{ size: "2em", color: "rgb(88 80 236)" }}>
                    <div className="ml-auto">
                        <BiShareAlt />
                    </div>
                </IconContext.Provider>
            </div>
            <div className="pt-0 pb-2 xl:text-xl md:text-lg sm:text-md text-indigo-600">
                {
                    // filter agency list and get corresponding agency's long description
                    agenciesSelector.agencies
                        .filter((agency) => agency.agency_id == props.agency_id)
                        .map((agency) => agency.long_name)
                }
            </div>
            <div className="xl:text-lg md:text-md sm:text-sm">{props.description}</div>
        </div>
    );
};

export default TopicCard;
