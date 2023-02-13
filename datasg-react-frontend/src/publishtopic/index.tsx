import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../common/NavigationBar";
import { useAppSelector } from "../redux/hooks";
import PublishTopicForm from "./PublishTopicForm";

const PublishTopic: React.FC = (props) => {
    return (
        <div className="bg-gray-100 h-screen overflow-auto">
            <NavigationBar current="publish" />
            <PublishTopicForm />
        </div>
    );
};

export default PublishTopic;
