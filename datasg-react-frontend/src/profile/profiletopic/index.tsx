import axios from "axios";
import { useState, useEffect } from "react";
import { IconContext } from "react-icons";
import { CgSpinner } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import { fetchAgencies } from "../../redux/agencySlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchTopics, TopicDetails } from "../../redux/topicSlice";
import ProfileTopicCard from "./ProfileTopicCard";
import ProfileTopicAccessModal from "./ProfileTopicAccessModal";
import ProfileTopicEditModal from "./ProfileTopicEditModal";

const ProfileTopic: React.FC = (props) => {
    const dispatch = useAppDispatch();
    const userSelector = useAppSelector((state) => state.user);
    const topicsSelector = useAppSelector((state) => state.topics);
    const agenciesSelector = useAppSelector((state) => state.agencies);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [ownedTopics, setOwnedTopics] = useState<Array<TopicDetails>>([]);
    const [showTopicAccessModal, setShowTopicAccessModal] = useState<boolean>(false);
    const [showTopicEditModal, setShowTopicEditModal] = useState<boolean>(false);
    const initialTopicDetails: TopicDetails = {
        topic_id: "",
        user_id: "",
        agency_id: "",
        topic_name: "",
        topic_url: "",
        description: "",
        last_update: "",
    };
    const [currentTopicDetails, setCurrentTopicDetails] =
        useState<TopicDetails>(initialTopicDetails);

    // fetch essential data
    const fetchRequiredTopicsData = () => {
        dispatch(fetchTopics());
        dispatch(fetchAgencies());
    };

    const openTopicAccessModal = () => {
        setShowTopicAccessModal(true);
        return;
    };

    const closeTopicAccessModal = () => {
        setShowTopicAccessModal(false);
        return;
    };

    const openTopicEditModal = () => {
        setShowTopicEditModal(true);
        return;
    };

    const closeTopicEditModal = () => {
        setShowTopicEditModal(false);
        setIsLoading(true);
        fetchRequiredTopicsData();
        return;
    };

    useEffect(() => {
        if (topicsSelector.status != "loading" && agenciesSelector.status != "loading") {
            setIsLoading(false);
            setOwnedTopics(
                topicsSelector.topics.filter(
                    (element) => element.user_id === userSelector.user.user_id
                )
            );
        }
    }, [topicsSelector]);

    useEffect(() => {
        setIsLoading(true);
        fetchRequiredTopicsData();
    }, []);
    return (
        <div className="bg-gray-100 w-full h-full">
            {!isLoading && (
                <div className="w-full h-full">
                    <div className="w-full flex justify-center p-8">
                        <span className="text-3xl font-semibold">My Topics</span>
                    </div>
                    <div className="w-full">
                        {ownedTopics.map((element) => (
                            <ProfileTopicCard
                                key={element.topic_id}
                                topic={element}
                                setCurrentTopicDetails={setCurrentTopicDetails}
                                handleOpenTopicAccessModal={openTopicAccessModal}
                                handleOpenTopicEditModal={openTopicEditModal}
                            />
                        ))}
                    </div>
                    <ProfileTopicAccessModal
                        currentTopic={currentTopicDetails}
                        isOpen={showTopicAccessModal}
                        handleCloseModal={closeTopicAccessModal}
                    />
                    <ProfileTopicEditModal
                        currentTopic={currentTopicDetails}
                        isOpen={showTopicEditModal}
                        handleCloseModal={closeTopicEditModal}
                        setCurrentTopicDetails={setCurrentTopicDetails}
                    />
                </div>
            )}
            {isLoading && (
                <div className="w-full h-full flex justify-center items-center">
                    <IconContext.Provider
                        value={{
                            size: "5em",
                        }}
                    >
                        <div className="mx-2 animate-spin text-indigo-700">
                            <CgSpinner />
                        </div>
                    </IconContext.Provider>
                </div>
            )}
        </div>
    );
};

export default ProfileTopic;
