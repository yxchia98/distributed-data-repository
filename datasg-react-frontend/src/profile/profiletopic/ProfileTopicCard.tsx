import axios from "axios";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { IconContext } from "react-icons";
import { RxEnter } from "react-icons/rx";
import { BiEdit } from "react-icons/bi";
import { FaUsersCog } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchTopics, TopicDetails } from "../../redux/topicSlice";

interface ProfileTopicCardProps {
    topic: TopicDetails;
    setCurrentTopicDetails: Dispatch<SetStateAction<TopicDetails>>;
    handleOpenTopicAccessModal: () => void;
    handleOpenTopicEditModal: () => void;
    // handleOpenTopicEditModal: (topic: TopicDetails) => (event: React.MouseEvent) => Promise<void>;
}

const ProfileTopicCard: React.FC<ProfileTopicCardProps> = (props) => {
    const agenciesSelector = useAppSelector((state) => state.agencies);
    const handleTopicAccessOnClick = () => {
        props.setCurrentTopicDetails(props.topic);
        props.handleOpenTopicAccessModal();
    };
    const handleTopicEditOnClick = () => {
        props.setCurrentTopicDetails(props.topic);
        props.handleOpenTopicEditModal();
    };
    return (
        <div className="bg-white mx-[5%] flex flex-row justify-between items-center rounded-xl p-4 shadow my-2">
            <div className="flex flex-col">
                <span className="text-xl font-medium">{props.topic.topic_name}</span>
                {agenciesSelector.agencies
                    .filter((element) => element.agency_id === props.topic.agency_id)
                    .map((element) => (
                        <span key={element.agency_id} className="text-indigo-700">
                            {element.long_name}
                        </span>
                    ))}
                <span className="text-s text-gray-700">{props.topic.description}</span>
            </div>
            <div className="flex flex-row items-center">
                <button
                    onClick={handleTopicAccessOnClick}
                    className="flex flex-row justify-center items-center mx-2 text-gray-500 hover:text-indigo-500 active:text-indigo-700"
                >
                    <IconContext.Provider
                        value={{
                            size: "2em",
                        }}
                    >
                        <div className="px-2">
                            <FaUsersCog />
                        </div>
                    </IconContext.Provider>
                </button>
                <button
                    onClick={handleTopicEditOnClick}
                    className="flex flex-row justify-center items-center mx-2 text-gray-500 hover:text-indigo-500 active:text-indigo-700"
                >
                    <IconContext.Provider
                        value={{
                            size: "2em",
                        }}
                    >
                        <div className="px-2">
                            <BiEdit />
                        </div>
                    </IconContext.Provider>
                </button>
                <button className="flex flex-row justify-center items-center mx-2 text-gray-500 hover:text-indigo-500 active:text-indigo-700">
                    <IconContext.Provider
                        value={{
                            size: "2em",
                        }}
                    >
                        <div className="px-2">
                            <RxEnter />
                        </div>
                    </IconContext.Provider>
                    <span className="text-xs">To topic</span>
                </button>
            </div>
        </div>
    );
};

export default ProfileTopicCard;
