import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchTopics } from "../redux/topicSlice";

const TopicSearchBar = () => {
    const allTopics = useAppSelector((state) => state.topics);
    return (
        <div className="topicSearchBar h-[5%] bg-gray-50 border-gray-200 border-y flex justify-center items-center">
            <form onSubmit={() => console.log("searching...")}>
                <div className="flex flex-row items-center justify-center">
                    <input
                        className="w-auto text-gray-700 border border-gray-200 rounded leading-tight focus:outline-none transition duration-300"
                        type="text"
                        placeholder="Search for topics..."
                    />{" "}
                    <select className="w-auto text-gray-700 border border-gray-200 rounded leading-tight focus:outline-none transition duration-300">
                        <option key="" value="">
                            select an option
                        </option>
                        {/* {agencies.map((agency: any) => (
                            <option key={agency.agency_id} value={agency.agency_id}>
                                {agency.short_name}
                            </option>
                        ))} */}
                    </select>
                </div>
            </form>
        </div>
    );
};

export default TopicSearchBar;
