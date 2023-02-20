import { useState } from "react";
import { IconContext } from "react-icons";
import { BiLock, BiLockOpen } from "react-icons/bi";
import { useAppSelector } from "../redux/hooks";
import RequestAccessModal from "./RequestAccessModal";

interface MissingReadAccessContentProps {
    topic_id: string;
}

const MissingReadAccessContent: React.FC<MissingReadAccessContentProps> = (props) => {
    const topicsSelector = useAppSelector((state) => state.topics).topics;

    const [isRequestAccessModalOpen, setIsRequestAccessModalOpen] = useState<boolean>(false);

    const handleRequestAccessOnClick = () => {
        setIsRequestAccessModalOpen(true);
    };
    return (
        <div className="flex w-full h-full justify-center items-center">
            <RequestAccessModal
                isOpen={isRequestAccessModalOpen}
                setIsOpen={setIsRequestAccessModalOpen}
                topicDetails={topicsSelector.find((topic) => topic.topic_id === props.topic_id)}
            />
            <div className="p-4 m-1 border-2 shadow-lg rounded-lg border-gray-300 flex flex-col justify-center items-center">
                <IconContext.Provider value={{ size: "3em", color: "rgb(55 65 81)" }}>
                    <div className="m-1">
                        <BiLock />
                    </div>
                </IconContext.Provider>
                <p className="text-xl font-semibold m-1"> Oops!</p>
                <p className="text-lg m-1"> You don't seem to have access to this topic yet.</p>
                <button
                    onClick={handleRequestAccessOnClick}
                    className="flex justify-center items-center bg-gray-200 rounded-lg shadow-lg p-2 m-1 active:bg-gray-300"
                >
                    <IconContext.Provider value={{ size: "1.5em", color: "rgb(55 65 81)" }}>
                        <div className="m-1">
                            <BiLockOpen />
                        </div>
                    </IconContext.Provider>
                    <p>Request Access</p>
                </button>
            </div>
        </div>
    );
};

export default MissingReadAccessContent;
