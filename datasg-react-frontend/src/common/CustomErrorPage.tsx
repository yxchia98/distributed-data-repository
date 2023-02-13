interface CustomErrorPageProps {
    message: string;
}

const CustomErrorPage: React.FC<CustomErrorPageProps> = (props) => {
    return (
        <div className="h-screen flex flex-col overflow-auto bg-white items-center">
            <div className="m-auto flex flex-col items-center">
                <h1 className="bold text-6xl font-bold p-6">Oops!</h1>
                <p className="text-xl">Sorry, there was an error accessing this page.</p>
                <p className="text-xl">
                    <i>{props.message}</i>
                </p>
            </div>
        </div>
    );
};

export default CustomErrorPage;
