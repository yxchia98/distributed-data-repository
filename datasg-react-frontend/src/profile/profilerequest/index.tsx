import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";

const ProfileRequest: React.FC = (props) => {
    const userSelector = useAppSelector((state) => state.user);

    return (
        <div className="explore bg-gray-100">
            <div className="w-full">
                <span className="text-3xl font-semibold">My Requests</span>
            </div>
            <span className="w-full">{JSON.stringify(userSelector)}</span>
        </div>
    );
};

export default ProfileRequest;
