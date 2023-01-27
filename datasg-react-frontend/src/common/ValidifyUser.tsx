import { Dispatch, SetStateAction } from "react";

interface ValidifyUserProps {
    user: string;
    setUser?: Dispatch<SetStateAction<string>>;
    userEmail: string;
    setUserEmail?: Dispatch<SetStateAction<string>>;
}

export const validifyUser = (props: ValidifyUserProps) => {};

export default validifyUser;
