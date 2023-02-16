import { useRouteError } from "react-router-dom";
import NavigationBar from "./common/NavigationBar";

const ErrorPage = () => {
    const error: any = useRouteError();
    console.error(error);

    return (
        <div>
            <div className="h-screen flex flex-col bg-white">
                <NavigationBar current={"home"} />
                <div className="m-auto flex flex-col items-center">
                    <h1 className="bold text-6xl font-bold p-6">Oops!</h1>
                    <p className="text-xl">Sorry, an unexpected error has occurred.</p>
                    <p className="text-xl">
                        <i>{error.statusText || error.message}</i>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ErrorPage;
