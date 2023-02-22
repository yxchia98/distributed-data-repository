import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";

const ProfileTopic: React.FC = (props) => {
    const userSelector = useAppSelector((state) => state.user);
    useEffect(() => {}, []);
    return (
        <div className="explore bg-gray-100">
            <span>My Topics</span>
        </div>
    );
};

export default ProfileTopic;
