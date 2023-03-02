import { useNavigate } from "react-router-dom";

const ExploreTopicEmptyPage = () => {
    return (
        <div className="flex flex-col items-center w-full p-[15%]">
            <p className="text-lg">
                <i>*cricket noises*</i>
            </p>
            <h1 className="text-3xl font-medium p-4">No topics found...</h1>
            <p className="text-lg p-4">
                <i>Come back later for more!</i>
            </p>
        </div>
    );
};

export default ExploreTopicEmptyPage;
