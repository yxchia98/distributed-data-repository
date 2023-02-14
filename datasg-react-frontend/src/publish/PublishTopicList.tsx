import { useEffect, useState } from "react";
import { IconContext } from "react-icons";
import { BiShareAlt } from "react-icons/bi";
import { MdOutlineCreateNewFolder } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { fetchAccess } from "../redux/accessSlice";
import { fetchAgencies } from "../redux/agencySlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchTopics, TopicDetails } from "../redux/topicSlice";
import CreateTopicModal from "./CreateTopicModal";
import PublishTopicCard from "./PublishTopicCard";
import PublishTopicFileModal from "./PublishTopicFileModal";

const PublishTopicList = () => {
    const navigate = useNavigate();
    const topicsSelector = useAppSelector((state) => state.topics);
    const agenciesSelector = useAppSelector((state) => state.agencies);
    const accessSelector = useAppSelector((state) => state.access);
    const userSelector = useAppSelector((state) => state.user);
    const [writeableTopics, setWriteableTopics] = useState<Array<TopicDetails>>([]);
    const [showPublishNewTopicFile, setShowPublishNewTopicFile] = useState<boolean>(false);
    const [selectedTopic, setSelectedTopic] = useState<TopicDetails>({
        topic_id: "",
        user_id: "",
        agency_id: "",
        topic_name: "",
        topic_url: "",
        description: "",
        last_update: "",
    });
    // dayjs(topicFile.file_date, "YYYY-MM-DD")
    const dispatch = useAppDispatch();

    const fetchTopicsRedux = () => {
        dispatch(fetchTopics());
    };

    const fetchAccessRedux = () => {
        dispatch(fetchAccess());
    };

    const fetchAgenciesRedux = () => {
        dispatch(fetchAgencies());
    };

    const handleCreateButtonOnClick = () => {
        // openCreateTopicModal();
        navigate("/publishTopic");
    };

    useEffect(() => {
        fetchTopicsRedux();
        fetchAgenciesRedux();
        fetchAccessRedux();
    }, []);

    useEffect(() => {
        // get all writeable topics according to current user's write access
        let filtered = topicsSelector.topics.filter((topic) => {
            return accessSelector.writeAccess.some((writeAccess) => {
                return writeAccess.topic_id === topic.topic_id;
            });
        });
        setWriteableTopics(filtered);
    }, [topicsSelector, accessSelector]);

    return (
        <div className="topicList">
            <PublishTopicFileModal
                topicDetails={selectedTopic}
                isOpen={showPublishNewTopicFile}
                setIsOpen={setShowPublishNewTopicFile}
            />
            <div className="flex justify-between max-w mx-[10%] my-[1%] overflow-hidden bg-local bg-origin-content">
                <div className="text-3xl font-semibold px-5">Publish Files to a Topic</div>
                <button
                    onClick={handleCreateButtonOnClick}
                    className="flex justify-between items-center rounded p-2 text-sm-bold border border-indigo-500 bg-indigo-500 text-white ransition duration-300 ease select-none hover:bg-indigo-600 focus:outline-none focus:shadow-outline"
                >
                    <IconContext.Provider value={{ size: "1.5em", color: "white" }}>
                        <div className="px-1">
                            <MdOutlineCreateNewFolder />
                        </div>
                    </IconContext.Provider>

                    <p className="px-1">New Topic</p>
                </button>
            </div>
            {writeableTopics &&
                agenciesSelector.agencies &&
                writeableTopics
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
                            <PublishTopicCard
                                key={topic.topic_id}
                                topic_id={topic.topic_id}
                                topic_name={topic.topic_name}
                                agency_id={topic.agency_id}
                                description={topic.description}
                                last_update={topic.last_update}
                                setShowModal={setShowPublishNewTopicFile}
                                setSelected={setSelectedTopic}
                            />
                        );
                    })}
        </div>
    );
};

export default PublishTopicList;
