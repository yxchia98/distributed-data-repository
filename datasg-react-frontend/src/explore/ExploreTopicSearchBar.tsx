import React, { useEffect } from "react";
import { IconContext } from "react-icons";
import { BsSearch } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchTopics, setSearch, TopicSearch } from "../redux/topicSlice";

const ExploreTopicSearchBar = () => {
    const topicsSelector = useAppSelector((state) => state.topics);
    const agenciesSelector = useAppSelector((state) => state.agencies);
    const dispatch = useAppDispatch();
    const textSearchOnChangeHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const input: TopicSearch = {
            search: e.target.value ? e.target.value : "",
            agency_id: "",
        };
        dispatch(setSearch(input));
    };
    const agencySearchOnChangeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const input: TopicSearch = {
            search: "",
            agency_id: e.target.value ? e.target.value : "",
        };
        dispatch(setSearch(input));
    };
    const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // 👈️ prevent page refresh
    };
    return (
        <div className="topicSearchBar h-[5%] w-screen bg-gray-50 border-gray-200 border-y flex justify-center items-center">
            <form
                onSubmit={onSubmitHandler}
                className="flex flex-row w-screen items-center justify-center"
            >
                <div className="flex flex-row w-2/6 rounded-lg items-center justify-center mx-4 bg-white border border-gray-200">
                    <IconContext.Provider value={{ size: "1em", color: "rgb(107 114 128)" }}>
                        <div className="pl-2">
                            <BsSearch />
                        </div>
                    </IconContext.Provider>
                    <input
                        className="w-full h-full p-2 mx-2 text-gray-700 leading-tight border-none focus:outline-none focus:border-none focus:ring-0 transition duration-300"
                        type="text"
                        placeholder="Search for topics..."
                        onChange={textSearchOnChangeHandler}
                    />
                </div>
                <div className="flex flex-row w-1/6 rounded-lg items-center justify-center mx-4 bg-white border border-gray-200">
                    <select
                        onChange={agencySearchOnChangeHandler}
                        className="w-full h-full p-2 mx-2 text-gray-700 leading-tight border-none focus:outline-none ffocus:border-none focus:ring-0 transition duration-300"
                    >
                        <option key="" value="">
                            select an option
                        </option>
                        {agenciesSelector.agencies.map((agency: any) => (
                            <option key={agency.agency_id} value={agency.agency_id}>
                                {agency.short_name}
                            </option>
                        ))}
                    </select>
                </div>
            </form>
        </div>
    );
};

export default ExploreTopicSearchBar;
