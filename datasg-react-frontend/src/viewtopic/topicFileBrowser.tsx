import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
    fetchSelectedTopicFiles,
    FetchSelectedTopicFilesThunkParams,
    setRefresh,
} from "../redux/topicFileSlice";
import { fetchAccess } from "../redux/accessSlice";
import TopicFileBrowserHeader from "./TopicFileBrowserHeader";
import TopicFileBrowserContent from "./TopicFileBrowserContent";
import { fetchCurrentTopicOwner, setCurrentTopicWithId } from "../redux/topicSlice";
import { IconContext } from "react-icons";
import { CgSpinner } from "react-icons/cg";
import dayjs from "dayjs";

interface TopicFileBrowserProps {
    topic_id: string;
    agency_id: string;
}

export interface SelectedDateRange {
    startDate: any;
    endDate: any;
}

const TopicFileBrowser: React.FC<TopicFileBrowserProps> = (props) => {
    const dispatch = useAppDispatch();
    const [hasReadAccess, setHasReadAccess] = useState<boolean>(false);
    const [hasWriteAccess, setHasWriteAccess] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const userSelector = useAppSelector((state) => state.user);
    const accessSelector = useAppSelector((state) => state.access);
    const topicsSelector = useAppSelector((state) => state.topics);
    const topicFilesSelector = useAppSelector((state) => state.topicFiles);
    const [selectedDate, setSelectedDate] = useState<SelectedDateRange | null>({
        startDate: dayjs().subtract(1, "month").format("YYYY-MM-DD"),
        endDate: dayjs().format("YYYY-MM-DD"),
    });

    // fetch topic files and access rights using redux thunk
    const fetchTopicFilesRedux = () => {
        const startDate = selectedDate?.startDate
            ? dayjs(selectedDate.startDate, "YYYY-M-D").format("YYYY-MM-DD")
            : dayjs().subtract(1, "month").format("YYYY-MM-DD");
        const endDate = selectedDate?.endDate
            ? dayjs(selectedDate.endDate, "YYYY-M-D").add(1, "day").format("YYYY-MM-DD")
            : dayjs().add(1, "day").format("YYYY-MM-DD");
        console.log(`fetching files from \nstart date: ${startDate}\nend date: ${endDate}`);
        const findTopic: FetchSelectedTopicFilesThunkParams = {
            topic_id: props.topic_id,
            start_date: startDate,
            end_date: endDate,
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
        dispatch(fetchCurrentTopicOwner(user_id));
    };

    // fetch topic owner's details after setting current topic
    useEffect(() => {
        if (topicsSelector.currentTopic.user_id) {
            fetchTopicOwnerRedux(topicsSelector.currentTopic.user_id);
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
        fetchAccessRedux();
    }, []);

    useEffect(() => {
        fetchTopicFilesRedux();
    }, [selectedDate]);

    useEffect(() => {
        if (topicFilesSelector.refresh == true) {
            fetchTopicFilesRedux();
            dispatch(setRefresh(false));
        }
    }, [topicFilesSelector.refresh]);

    useEffect(() => {
        if (
            userSelector.status != "loading" &&
            accessSelector.status != "loading" &&
            topicsSelector.accessStatus != "loading" &&
            topicsSelector.status != "loading"
        ) {
            setIsLoading(false);
        }
    }, [userSelector, accessSelector, topicsSelector]);

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
                        datePickerValue={selectedDate}
                        setDatePickerValue={setSelectedDate}
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
