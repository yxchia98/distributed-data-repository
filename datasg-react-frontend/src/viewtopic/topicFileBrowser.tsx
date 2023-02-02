import { useEffect } from "react";
import { IconContext } from "react-icons";
import { BiShareAlt } from "react-icons/bi";
import { IoChevronBackOutline } from "react-icons/io5";
import { FiArrowDownCircle, FiArrowUpCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { fetchAgencies } from "../redux/agencySlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchSelectedTopicFiles } from "../redux/topicFileSlice";

interface TopicFileBrowserProps {
    topic_id: string;
    agency_id: string;
}

const TopicFileBrowser: React.FC<TopicFileBrowserProps> = (props) => {
    const topicsSelector = useAppSelector((state) => state.topics).topics;
    const agenciesSelector = useAppSelector((state) => state.agencies).agencies;
    const topicFilesSelector = useAppSelector((state) => state.topicFiles);
    const navigate = useNavigate();
    const user = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch();

    // fetch topic files using redux thunk
    const fetchTopicFilesRedux = () => {
        dispatch(fetchSelectedTopicFiles(props.topic_id));
    };

    useEffect(() => {
        fetchTopicFilesRedux();
    }, []);

    const handleBackOnClick = () => {
        console.log(`clicked!`);
    };

    return (
        <div className="max-w py-5 px-5 mx-[10%] my-[1%] overflow-hidden bg-white bg-local bg-origin-content rounded-t-xl">
            <div className="flow-root mb-[2%]">
                <div className="float-left">
                    <button
                        onClick={handleBackOnClick}
                        className="flex flex-row items-center py-2 border border-gray-300 bg-white text-gray-700 shadow-sm rounded-md hover:bg-gray-50 transition"
                    >
                        <IconContext.Provider value={{ size: "1.5em", color: "rgb(156 163 175)" }}>
                            <div className="">
                                <IoChevronBackOutline />
                            </div>
                            <div className=" pr-3">Back</div>
                        </IconContext.Provider>
                    </button>
                </div>
                <div className="float-right">
                    <IconContext.Provider value={{ size: "2em", color: "rgb(88 80 236)" }}>
                        <div className="">
                            <BiShareAlt />
                        </div>
                    </IconContext.Provider>
                </div>
            </div>
            <div className="flex flex-row">
                <div className="font-semibold xl:text-3xl md:text-2xl sm:text-xl text-gray-700">
                    {
                        // filter topics in redux store and retrieve topic name
                        topicsSelector
                            .filter((topic) => topic.topic_id == props.topic_id)
                            .map((topic) => topic.topic_name)
                    }
                </div>
            </div>
            <div className="pt-0 pb-2 xl:text-xl md:text-lg sm:text-md text-indigo-600">
                {
                    // filter agency list and get corresponding agency's long description
                    agenciesSelector
                        .filter((agency) => agency.agency_id == props.agency_id)
                        .map((agency) => agency.long_name)
                }
            </div>
            <div className="xl:text-lg md:text-md sm:text-sm">
                {
                    // filter topics in redux store and get corresponding topics's long description
                    topicsSelector
                        .filter((topic) => topic.topic_id == props.topic_id)
                        .map((topic) => topic.description)
                }
            </div>
            <div className="float-right flex flex-row mr-[2%]">
                <select className="m-1 inline-flex justify-center rounded-md border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50">
                    <option>Action</option>
                    <option>option2</option>
                    <option>option3</option>
                </select>
                <button className="h-12 px-4 m-1 text-md rounded-lg bg-gray-200 flex flex-row items-center">
                    <IconContext.Provider value={{ size: "1.5em", color: "rgb(156 163 175)" }}>
                        <div className="mr-2">
                            <FiArrowDownCircle />
                        </div>
                    </IconContext.Provider>
                    Download
                </button>
                <button className="h-12 px-4 m-1 text-md rounded-lg bg-gray-200 flex flex-row items-center">
                    <IconContext.Provider value={{ size: "1.5em", color: "rgb(156 163 175)" }}>
                        <div className="mr-2">
                            <FiArrowUpCircle />
                        </div>
                    </IconContext.Provider>
                    Publish
                </button>
            </div>
        </div>
    );
};

export default TopicFileBrowser;
