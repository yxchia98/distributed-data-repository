import axios from "axios";
import { useState, useEffect } from "react";
import NavigationBar from "../common/NavigationBar";

const Explore: React.FC = (props) => {
    return (
        <div className="register">
            <NavigationBar
                login={function (): {} {
                    throw new Error("Function not implemented.");
                }}
                logout={function (): {} {
                    throw new Error("Function not implemented.");
                }}
            />
        </div>
    );
};

export default Explore;
