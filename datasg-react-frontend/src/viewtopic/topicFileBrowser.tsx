import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
    fetchSelectedTopicFiles,
    FetchSelectedTopicFilesThunkParams,
    fetchSelectedTopicOwner,
} from "../redux/topicFileSlice";
import { fetchAccess } from "../redux/accessSlice";
import TopicFileBrowserHeader from "./TopicFileBrowserHeader";
import TopicFileBrowserContent from "./TopicFileBrowserContent";
import { setCurrentTopicWithId } from "../redux/topicSlice";
import { IconContext } from "react-icons";
import { CgSpinner } from "react-icons/cg";

interface TopicFileBrowserProps {
    topic_id: string;
    agency_id: string;
}

const TopicFileBrowser: React.FC<TopicFileBrowserProps> = (props) => {
    const dispatch = useAppDispatch();
    const [hasReadAccess, setHasReadAccess] = useState<boolean>(false);
    const [hasWriteAccess, setHasWriteAccess] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const userSelector = useAppSelector((state) => state.user);
    const accessSelector = useAppSelector((state) => state.access);
    const topicsSelector = useAppSelector((state) => state.topics);

    // fetch topic files and access rights using redux thunk
    const fetchTopicFilesRedux = () => {
        console.log("firing");
        const findTopic: FetchSelectedTopicFilesThunkParams = {
            topic_id: props.topic_id,
            start_date: "2023-02-10",
            end_date: "2023-02-24",
        };
        dispatch(fetchSelectedTopicFiles(findTopic));
    };
    const fetchAccessRedux = () => {
        dispatch(fetchAccess());
    };
    const setCurrentTopicRedux = () => {
        dispatch(setCurrentTopicWithId(props.topic_id));
    };
    const fetchTopicOwnerRedux = (user_id: string) => {
        dispatch(fetchSelectedTopicOwner(user_id));
    };

    // fetch topic owner's details after setting current topic
    useEffect(() => {
        if (topicsSelector.currentTopic.user_id) {
            fetchTopicOwnerRedux(topicsSelector.currentTopic.user_id);
            setIsLoading(false);
            return;
        }
    }, [topicsSelector.currentTopic]);

    // fetch and set current topic after fetching topic details
    useEffect(() => {
        setIsLoading(true);
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
            {!isLoading && (
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
            )}
            {isLoading && (
                <div className="h-[92.5%] py-2.5 px-2.5 m-[2.5%] overflow-hidden bg-white bg-local bg-origin-content rounded-xl">
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
                </div>
            )}
        </div>
    );
};

export default TopicFileBrowser;
