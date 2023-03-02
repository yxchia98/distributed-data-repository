import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { IconContext } from "react-icons";
import { RxEnter } from "react-icons/rx";
import { BiEdit } from "react-icons/bi";
import { HiOutlineKey } from "react-icons/hi";
import { FaUsersCog } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchTopics, TopicDetails } from "../../redux/topicSlice";
import ProfileTopicAPIModal from "./ProfileTopicAPIModal";

interface ProfileTopicCardProps {
    topic: TopicDetails;
    setCurrentTopicDetails: Dispatch<SetStateAction<TopicDetails>>;
    handleOpenTopicAccessModal: () => void;
    handleOpenTopicEditModal: () => void;
    // handleOpenTopicEditModal: (topic: TopicDetails) => (event: React.MouseEvent) => Promise<void>;
}

interface GenerateTopicAPIKeyResponse {
    error: boolean;
    message: string;
    key: string;
}

const ProfileTopicCard: React.FC<ProfileTopicCardProps> = (props) => {
    const navigate = useNavigate();
    const usersSelector = useAppSelector((state) => state.user);
    const agenciesSelector = useAppSelector((state) => state.agencies);
    const [showTopicAPIModal, setShowTopicAPIModal] = useState<boolean>(false);
    const [topicAPIModalLoading, setTopicAPIModalLoading] = useState<boolean>(false);
    const [topicAPIModalSuccess, setTopicAPIModalSuccess] = useState<boolean>(false);
    const [topicAPIModalError, setTopicAPIModalError] = useState<boolean>(false);
    const [topicAPIKey, setTopicAPIKey] = useState<string>("");

    const handleTopicAccessOnClick = () => {
        props.setCurrentTopicDetails(props.topic);
        props.handleOpenTopicAccessModal();
    };
    const handleTopicEditOnClick = () => {
        props.setCurrentTopicDetails(props.topic);
        props.handleOpenTopicEditModal();
    };

    const handleTopicKeyOnClick = () => {
        setTopicAPIModalLoading(false);
        setTopicAPIModalSuccess(false);
        setTopicAPIModalError(false);
        setShowTopicAPIModal(true);
    };

    const handleConfirmTopicKeyModal = async () => {
        setTopicAPIModalLoading(true);

        // structure API call for generating new API Key
        const generateKeyFormData: FormData = new FormData();
        generateKeyFormData.append("user_id", usersSelector.user.user_id);
        generateKeyFormData.append("topic_id", props.topic.topic_id);
        const generateAPIKeyConfigObject: AxiosRequestConfig = {
            method: "post",
            url: `${process.env.REACT_APP_DATA_WRITER_API_URL}auth/apikey`,
            headers: {},
            data: generateKeyFormData,
            withCredentials: true,
        };
        try {
            const res: AxiosResponse<GenerateTopicAPIKeyResponse> = await axios(
                generateAPIKeyConfigObject
            );
            if (res.data.error) {
                setTopicAPIModalLoading(false);
                setTopicAPIModalSuccess(false);
                setTopicAPIModalError(true);
                return;
            }
            setTopicAPIKey(res.data.key);
            setTopicAPIModalLoading(false);
            setTopicAPIModalSuccess(true);
            setTopicAPIModalError(false);
            return;
        } catch (error: any) {
            console.log(error.message);
            setTopicAPIModalLoading(false);
            setTopicAPIModalSuccess(false);
            setTopicAPIModalError(true);
            return;
        }
    };

    const handleCloseTopicKeyModal = () => {
        setShowTopicAPIModal(false);
    };

    const handleToTopicOnClick = () => {
        return navigate("/viewTopic", {
            state: {
                topic_id: props.topic.topic_id,
                topic_name: props.topic.topic_name,
                agency_id: props.topic.agency_id,
                description: props.topic.description,
            },
        });
    };

    return (
        <div className="bg-white mx-[5%] flex flex-row justify-between items-center rounded-xl p-4 shadow my-2">
            <ProfileTopicAPIModal
                isOpen={showTopicAPIModal}
                isLoading={topicAPIModalLoading}
                isSuccess={topicAPIModalSuccess}
                isError={topicAPIModalError}
                handleCancelModal={handleCloseTopicKeyModal}
                handleConfirm={handleConfirmTopicKeyModal}
                topic={props.topic}
                keyString={topicAPIKey}
            />
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
                    onClick={handleTopicKeyOnClick}
                    className="flex flex-row justify-center items-center mx-2 text-gray-500 hover:text-indigo-500 active:text-indigo-700"
                >
                    <IconContext.Provider
                        value={{
                            size: "2em",
                        }}
                    >
                        <div className="px-2">
                            <HiOutlineKey />
                        </div>
                    </IconContext.Provider>
                </button>
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
                <button
                    onClick={handleToTopicOnClick}
                    className="flex flex-row justify-center items-center mx-2 text-gray-500 hover:text-indigo-500 active:text-indigo-700"
                >
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
