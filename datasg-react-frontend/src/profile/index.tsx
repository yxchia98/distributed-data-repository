import axios from "axios";
import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import NavigationBar from "../common/NavigationBar";
import { useAppSelector } from "../redux/hooks";
import CustomErrorPage from "../common/CustomErrorPage";
import ProfileSideBar from "./profilesidebar";

const Profile: React.FC = (props) => {
    const userSelector = useAppSelector((state) => state.user);
    return (
        <div className="explore bg-gray-100 h-screen overflow-auto">
            <NavigationBar current="profile" />
            {/* <p>{JSON.stringify(userSelector)}</p> */}
            {(!userSelector.user.user_id ||
                !userSelector.user.loggedIn ||
                !userSelector.user.registered) && (
                <CustomErrorPage message={"You have to be logged in to access this feature"} />
            )}
            {userSelector.user.user_id &&
                userSelector.user.loggedIn &&
                userSelector.user.registered && (
                    <div className="h-[92.5%] w-full flex">
                        <div id="sidebar" className="w-[15%] h-full overflow-auto">
                            <ProfileSideBar />
                        </div>
                        <div className="w-[85%]">
                            <Outlet />
                        </div>
                    </div>
                )}
        </div>
    );
};

export default Profile;
