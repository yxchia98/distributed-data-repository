import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../common/NavigationBar";
import { useAppSelector } from "../redux/hooks";
import TopicList from "./TopicList";
import TopicSearchBar from "./TopicSearchBar";

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
        <div className="explore bg-gray-100 h-screen">
            <NavigationBar current="explore" />
            <TopicSearchBar />
            <TopicList />
        </div>
    );
};

export default Explore;
