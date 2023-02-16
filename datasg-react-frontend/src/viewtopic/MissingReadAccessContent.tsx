import { IconContext } from "react-icons";
import { BiLockOpen } from "react-icons/bi";

interface MissingReadAccessContentProps {
    topic_id: string;
}

const MissingReadAccessContent: React.FC<MissingReadAccessContentProps> = (props) => {
    return (
        <div className="flex w-full h-full justify-center items-center">
            <div className="p-4 m-1 border-2 shadow-lg rounded-lg border-gray-300 flex flex-col justify-center items-center">
                <p className="text-xl font-semibold m-1"> Oops!</p>
                <p className="text-lg m-1"> You don't seem to have access to this topic yet.</p>
                <button className="flex justify-center items-center bg-gray-200 rounded-lg shadow-lg p-2 m-1 active:bg-gray-300">
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
