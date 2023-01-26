import { useRouteError } from "react-router-dom";

const ErrorPage = () => {
    const error: any = useRouteError();
    console.error(error);

    return (
        <div className="h-screen flex flex-col overflow-auto bg-white items-center">
            <div className="m-auto flex flex-col items-center">
                <h1 className="bold text-6xl font-bold p-6">Oops!</h1>
                <p className="text-xl">Sorry, an unexpected error has occurred.</p>
                <p className="text-xl">
                    <i>{error.statusText || error.message}</i>
                </p>
            </div>
        </div>
    );
};

export default ErrorPage;
