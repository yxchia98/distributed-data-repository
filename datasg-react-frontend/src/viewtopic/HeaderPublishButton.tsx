import { Dispatch, SetStateAction } from "react";
import { IconContext } from "react-icons";
import { FiArrowUpCircle } from "react-icons/fi";
import { TbCircleDotted } from "react-icons/tb";

interface HeaderPublishButtonProps {
    handleOnClick: () => boolean;
    isPublishing: boolean;
    setIsPublishing: Dispatch<SetStateAction<boolean>>;
    disabled: boolean;
}

const HeaderPublishButton: React.FC<HeaderPublishButtonProps> = (props) => {
    return (
        <button
            onClick={props.handleOnClick}
            disabled={props.disabled}
            className="h-12 px-4 m-1 text-md rounded-lg bg-gray-200 flex flex-row items-center font-semibold active:bg-gray-300 disabled:bg-gray-200 disabled:text-gray-400"
        >
            {props.isPublishing && (
                <IconContext.Provider value={{ size: "1.5em", color: "rgb(156 163 175)" }}>
                    <div className="mr-2 animate-spin">
                        <TbCircleDotted />
                    </div>
                </IconContext.Provider>
            )}
            {!props.isPublishing && (
                <IconContext.Provider value={{ size: "1.5em", color: "rgb(156 163 175)" }}>
                    <div className="mr-2">
                        <FiArrowUpCircle />
                    </div>
                </IconContext.Provider>
            )}
            Publish
        </button>
    );
};
export default HeaderPublishButton;
