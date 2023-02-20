import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchSelectedTopicFiles, fetchSelectedTopicOwner } from "../redux/topicFileSlice";
import { fetchAccess } from "../redux/accessSlice";
import TopicFileBrowserHeader from "./TopicFileBrowserHeader";
import TopicFileBrowserContent from "./TopicFileBrowserContent";
import { setCurrentTopic } from "../redux/topicSlice";

interface TopicFileBrowserProps {
    topic_id: string;
    agency_id: string;
}

const TopicFileBrowser: React.FC<TopicFileBrowserProps> = (props) => {
    const dispatch = useAppDispatch();
    const [hasReadAccess, setHasReadAccess] = useState<boolean>(false);
    const [hasWriteAccess, setHasWriteAccess] = useState<boolean>(false);
    const userSelector = useAppSelector((state) => state.user);
    const accessSelector = useAppSelector((state) => state.access);
    const topicsSelector = useAppSelector((state) => state.topics);

    // fetch topic files and access rights using redux thunk
    const fetchTopicFilesRedux = () => {
        dispatch(fetchSelectedTopicFiles(props.topic_id));
    };
    const fetchAccessRedux = () => {
        dispatch(fetchAccess());
    };
    const setCurrentTopicRedux = () => {
        dispatch(setCurrentTopic(props.topic_id));
    };
    const fetchTopicOwnerRedux = (user_id: string) => {
        dispatch(fetchSelectedTopicOwner(user_id));
    };

    // fetch topic owner's details after setting current topic
    useEffect(() => {
        fetchTopicOwnerRedux(topicsSelector.currentTopic.user_id);
    }, [topicsSelector.currentTopic]);

    // fetch and set current topic after fetching topic details
    useEffect(() => {
        setCurrentTopicRedux();
    }, [topicsSelector.topics]);

    // fetch latest topic and access details
    useEffect(() => {
        fetchTopicFilesRedux();
        fetchAccessRedux();
    }, []);

    useEffect(() => {
        if (
            accessSelector.readAccess.find(
                (access) =>
                    access.topic_id === props.topic_id &&
                    access.user_id === userSelector.user.user_id
            )
        ) {
            setHasReadAccess(true);
        }
        if (
            accessSelector.writeAccess.find(
                (access) =>
                    access.topic_id === props.topic_id &&
                    access.user_id === userSelector.user.user_id
            )
        ) {
            setHasWriteAccess(true);
        }
    }, [accessSelector]);

    return (
        <div className="w-screen h-[92.5%] overflow-hidden">
            <div className="h-[92.5%] py-2.5 px-2.5 m-[2.5%] overflow-hidden bg-white bg-local bg-origin-content rounded-xl">
                <TopicFileBrowserHeader
                    topic_id={props.topic_id}
                    agency_id={props.agency_id}
                    readAccess={hasReadAccess}
                    writeAccess={hasWriteAccess}
                />
                <TopicFileBrowserContent
                    topic_id={props.topic_id}
                    agency_id={props.agency_id}
                    readAccess={hasReadAccess}
                    writeAccess={hasWriteAccess}
                />
            </div>
        </div>
    );
};

export default TopicFileBrowser;
