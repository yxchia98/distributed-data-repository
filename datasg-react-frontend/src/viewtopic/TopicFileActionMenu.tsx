import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { IconContext } from "react-icons";
import { SlOptionsVertical } from "react-icons/sl";
import { BiDownload, BiEdit, BiTrash } from "react-icons/bi";

interface TopicFileActionMenuProps {
    file_id: string;
}

const TopicFileActionMenu: React.FC<TopicFileActionMenuProps> = (props) => {
    const handleDownload = () => {
        console.log(`downloading file for file_id: ${props.file_id}`);
    };
    const handleDelete = () => {
        console.log(`deleting file for file_id: ${props.file_id}`);
    };
    const handleEdit = () => {
        console.log(`editing file for file_id: ${props.file_id}`);
    };
    return (
        <div className="w-1/12 py-2 flex items-center justify-center">
            <Menu as="div" className="absolute inline-block text-left">
                <div>
                    <Menu.Button className="inline-flex w-full ustify-center px-4 py-2 text-sm">
                        <IconContext.Provider value={{ size: "1em", color: "rgb(107 114 128)" }}>
                            <SlOptionsVertical />
                        </IconContext.Provider>
                    </Menu.Button>
                </div>
                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Menu.Items className="absolute right-0 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="px-1 py-1 ">
                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        onClick={handleDownload}
                                        className={`${
                                            active ? "bg-indigo-500 text-white" : "text-gray-900"
                                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                    >
                                        {active ? (
                                            <IconContext.Provider
                                                value={{
                                                    size: "1.5em",
                                                }}
                                            >
                                                <div className="mr-2 h-5 w-5 flex items-center justify-center">
                                                    <BiDownload />
                                                </div>
                                            </IconContext.Provider>
                                        ) : (
                                            <IconContext.Provider
                                                value={{
                                                    size: "1.5em",
                                                }}
                                            >
                                                <div className="mr-2 h-5 w-5 flex items-center text-indigo-500 justify-center">
                                                    <BiDownload />
                                                </div>
                                            </IconContext.Provider>
                                        )}
                                        Download
                                    </button>
                                )}
                            </Menu.Item>
                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        onClick={handleEdit}
                                        className={`${
                                            active ? "bg-indigo-500 text-white" : "text-gray-900"
                                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                    >
                                        {active ? (
                                            <IconContext.Provider
                                                value={{
                                                    size: "1.5em",
                                                }}
                                            >
                                                <div className="mr-2 h-5 w-5 flex items-center justify-center">
                                                    <BiEdit />
                                                </div>
                                            </IconContext.Provider>
                                        ) : (
                                            <IconContext.Provider
                                                value={{
                                                    size: "1.5em",
                                                }}
                                            >
                                                <div className="mr-2 h-5 w-5 flex items-center text-indigo-500 justify-center">
                                                    <BiEdit />
                                                </div>
                                            </IconContext.Provider>
                                        )}
                                        Edit
                                    </button>
                                )}
                            </Menu.Item>
                        </div>
                        <div className="px-1 py-1">
                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        onClick={handleDelete}
                                        className={`${
                                            active ? "bg-indigo-500 text-white" : "text-gray-900"
                                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                    >
                                        {active ? (
                                            <IconContext.Provider
                                                value={{
                                                    size: "1.5em",
                                                }}
                                            >
                                                <BiTrash className="mr-2 h-5 w-5 flex items-centerjustify-center" />
                                            </IconContext.Provider>
                                        ) : (
                                            <IconContext.Provider
                                                value={{
                                                    size: "1.5em",
                                                }}
                                            >
                                                <BiTrash className="mr-2 h-5 w-5 flex items-center text-indigo-500 justify-center" />
                                            </IconContext.Provider>
                                        )}
                                        Delete
                                    </button>
                                )}
                            </Menu.Item>
                        </div>
                    </Menu.Items>
                </Transition>
            </Menu>
        </div>
    );
};

const DownloadActive = () => {};

export default TopicFileActionMenu;