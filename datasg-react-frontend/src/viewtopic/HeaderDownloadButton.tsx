import { Dispatch, SetStateAction } from "react";
import { IconContext } from "react-icons";
import { FiArrowDownCircle } from "react-icons/fi";
import { TbCircleDotted } from "react-icons/tb";

interface HeaderDownloadButtonProps {
    handleOnClick: () => Promise<boolean>;
    isDownloading: boolean;
    setIsDownloading: Dispatch<SetStateAction<boolean>>;
    disabled: boolean;
}

const HeaderDownloadButton: React.FC<HeaderDownloadButtonProps> = (props) => {
    return (
        <button
            onClick={props.handleOnClick}
            disabled={props.disabled}
            className="h-12 px-4 m-1 text-md rounded-lg bg-gray-200 flex flex-row items-center font-semibold active:bg-gray-300 disabled:bg-gray-200 disabled:text-gray-400"
        >
            {!props.isDownloading && (
                <IconContext.Provider value={{ size: "1.5em", color: "rgb(156 163 175)" }}>
                    <div className="mr-2">
                        <FiArrowDownCircle />
                    </div>
                </IconContext.Provider>
            )}
            {props.isDownloading && (
                <IconContext.Provider value={{ size: "1.5em", color: "rgb(156 163 175)" }}>
                    <div className="mr-2 animate-spin">
                        <TbCircleDotted />
                    </div>
                </IconContext.Provider>
            )}
            Download
        </button>
    );
};
export default HeaderDownloadButton;
