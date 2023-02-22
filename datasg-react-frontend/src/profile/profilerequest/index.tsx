import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AccessRequestDetail, fetchAccessRequests } from "../../redux/accessSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

const ProfileRequest: React.FC = (props) => {
    const userSelector = useAppSelector((state) => state.user);
    const accessSelector = useAppSelector((state) => state.access);
    const [accessRequests, setAccessRequests] = useState<Array<AccessRequestDetail>>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const dispatch = useAppDispatch();

    const fetchAccessRequestsRedux = () => {
        dispatch(fetchAccessRequests(userSelector.user.user_id));
    };

    useEffect(() => {
        if (accessSelector.status === "loading") {
            setIsLoading(true);
            return;
        }

        setIsLoading(false);
        console.log("approvable:");
        console.log(accessSelector.approvable);
        console.log("requested:");
        console.log(accessSelector.requested);
    }, [accessSelector]);

    useEffect(() => {
        fetchAccessRequestsRedux();
    }, []);

    return (
        <div className="explore bg-gray-100">
            <div className="w-full flex justify-center">
                <div className="w-full flex justify-center p-8">
                    <span className="text-3xl font-semibold">My Requests</span>
                </div>
            </div>
        </div>
    );
};

export default ProfileRequest;
