import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../common/NavigationBar";
import { useAppSelector } from "../redux/hooks";
import ExploreTopicList from "./ExploreTopicList";
import ExploreTopicSearchBar from "./ExploreTopicSearchBar";

const Explore: React.FC = (props) => {
    // const user = useAppSelector((state) => state.user);
    // const navigate = useNavigate();
    // const checkUser = () => {
    //     if (!user.user.registered && user.user.loggedIn) {
    //         navigate("/register");
    //         console.log("hello!");
    //     }
    // };

    // useEffect(() => {
    //     checkUser();
    // }, []);
    return (
        <div className="explore bg-gray-100 h-screen overflow-auto">
            <NavigationBar current="explore" />
            <ExploreTopicSearchBar />
            <ExploreTopicList />
        </div>
    );
};

export default Explore;
