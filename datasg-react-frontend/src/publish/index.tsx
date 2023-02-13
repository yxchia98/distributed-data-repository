import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../common/NavigationBar";
import { useAppSelector } from "../redux/hooks";
import CustomErrorPage from "../common/CustomErrorPage";
import PublishTopicList from "./PublishTopicList";
import PublishTopicSearchBar from "./PublishTopicSearchBar";

const Publish: React.FC = (props) => {
    const userSelector = useAppSelector((state) => state.user);

    return (
        <div className="explore bg-gray-100 h-screen">
            <NavigationBar current="publish" />
            {!userSelector.user.user_id && (
                <CustomErrorPage message={"You have to be logged in to access this feature"} />
            )}
            {userSelector.user.user_id && <PublishTopicSearchBar />}
            {userSelector.user.user_id && <PublishTopicList />}
        </div>
    );
};

export default Publish;
