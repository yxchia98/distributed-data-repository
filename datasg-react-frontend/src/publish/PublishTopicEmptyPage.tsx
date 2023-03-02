import { useNavigate } from "react-router-dom";

const PublishTopicEmptyPage = () => {
    const navigate = useNavigate();

    const toExplorePage = () => {
        return navigate("/explore");
    };
    return (
        <div className="flex flex-col items-center w-full p-[15%]">
            <p className="text-lg">
                <i>*cricket noises*</i>
            </p>
            <h1 className="text-3xl font-medium p-4">
                Looks like you dont have any topics to publish to...
            </h1>
            <p className="text-lg p-4">
                <i>request access to topics to start publishing files</i>
            </p>
            <button
                onClick={toExplorePage}
                className="flex justify-between items-center rounded-lg p-2 text-sm-bold border border-indigo-500 bg-indigo-500 text-white transition ease select-none hover:bg-indigo-600 active:bg-indigo-700 focus:outline-none focus:shadow-outline"
            >
                Explore topics
            </button>
        </div>
    );
};

export default PublishTopicEmptyPage;
