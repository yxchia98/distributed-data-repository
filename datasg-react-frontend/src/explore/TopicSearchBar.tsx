import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchTopics, setSearch, TopicSearch } from "../redux/topicsSlice";

const TopicSearchBar = () => {
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
        console.log("changed agency!");
        console.log(topicsSelector.search);
    };
    const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // 👈️ prevent page refresh
    };
    return (
        <div className="topicSearchBar h-[5%] bg-gray-50 border-gray-200 border-y flex justify-center items-center">
            <form onSubmit={onSubmitHandler}>
                <div className="flex flex-row items-center justify-center">
                    <input
                        className="w-auto text-gray-700 border border-gray-200 rounded leading-tight focus:outline-none transition duration-300"
                        type="text"
                        placeholder="Search for topics..."
                        onChange={textSearchOnChangeHandler}
                    />
                    <select
                        onChange={agencySearchOnChangeHandler}
                        className="w-auto text-gray-700 border border-gray-200 rounded leading-tight focus:outline-none transition duration-300"
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

export default TopicSearchBar;
