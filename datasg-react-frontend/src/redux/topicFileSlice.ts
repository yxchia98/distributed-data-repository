import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { Dayjs } from "dayjs";
import { FetchUserDetailsData, FetchUserDetailsResponseType, UserDetails } from "./userSlice";
import { useDispatch } from "react-redux";
import { TopicDetails } from "./topicSlice";
import { store } from "./store";

export interface TopicFileDetails {
    file_id: string;
    topic_id: string;
    agency_id: string;
    file_url: string;
    file_date: string;
}

interface SelectedTopicFilesState {
    owner: FetchUserDetailsData;
    topicFiles: Array<TopicFileDetails>;
    checked: Array<string>;
    status: string;
}

interface FetchTopicFilesResponseType {
    error: boolean;
    message: string;
    data: Array<TopicFileDetails> | undefined;
}

const initialOwner: FetchUserDetailsData = {
    user_id: "",
    first_name: "",
    last_name: "",
    email: "",
    contact: "",
    agency_id: "",
};

// initialize initial state for user in redux store
const initialState: SelectedTopicFilesState = {
    owner: initialOwner,
    topicFiles: [],
    checked: [],
    status: "idle", //'idle' | 'loading' | 'succeeded' | 'failed'
};

export const fetchSelectedTopicFiles = createAsyncThunk(
    "selectedTopic/fetchSelectedTopicFiles",
    async (key: string) => {
        // define response for fetching topic files information
        let res: FetchTopicFilesResponseType = {
            data: [],
            message: "Error fetching topic files",
            error: true,
        };
        try {
            const fetchTopicsConfigurationObject: AxiosRequestConfig = {
                method: "get",
                url: `${process.env.REACT_APP_DATA_READER_API_URL}topic/topicfiles`,
                headers: {},
                withCredentials: true,
                params: {
                    topic_id: key,
                },
            };
            const fetchTopicResponse: AxiosResponse<FetchTopicFilesResponseType> = await axios(
                fetchTopicsConfigurationObject
            );
            res.data = fetchTopicResponse.data.data ? fetchTopicResponse.data.data : [];
            res.message = fetchTopicResponse.data.message ? fetchTopicResponse.data.message : "";
            res.error = fetchTopicResponse.data.error ? fetchTopicResponse.data.error : true;
            return res;
        } catch (error) {
            return res;
        }
    }
);

export const fetchSelectedTopicOwner = createAsyncThunk(
    "selectedTopic/fetchSelectedTopicOwner",
    async (user_id: string) => {
        // define respose for fetching topic owner's information
        const owner_id = user_id;
        let topicOwner: FetchUserDetailsData = {
            user_id: "",
            first_name: "",
            last_name: "",
            email: "",
            contact: "",
            agency_id: "",
        };
        let res: FetchUserDetailsResponseType = {
            error: false,
            message: "",
            data: topicOwner,
        };
        try {
            const fetchOwnerConfigurationObject: AxiosRequestConfig = {
                method: "get",
                url: `${process.env.REACT_APP_DATA_READER_API_URL}profile/user`,
                headers: {},
                withCredentials: true,
                params: {
                    user_id: owner_id,
                },
            };

            const fetchOwnerResponse: AxiosResponse<FetchUserDetailsResponseType> = await axios(
                fetchOwnerConfigurationObject
            );
            res.data = fetchOwnerResponse.data.data ? fetchOwnerResponse.data.data : res.data;
            res.message = fetchOwnerResponse.data.message ? fetchOwnerResponse.data.message : "";
            res.error = fetchOwnerResponse.data.error ? fetchOwnerResponse.data.error : true;
            return res;
        } catch (error) {
            return res;
        }
    }
);

export const selectedTopicSlice = createSlice({
    name: "selectedTopic",
    initialState,
    reducers: {
        setChecked: (state, action: PayloadAction<Array<string>>) => {
            const checkedList = action.payload;
            state.checked = checkedList;
        },
        clearChecked: (state) => {
            state.checked = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSelectedTopicFiles.pending, (state, action) => {
                state.status = "loading";
            })
            .addCase(fetchSelectedTopicFiles.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.topicFiles = action.payload.data ? action.payload.data : [];
            })
            .addCase(fetchSelectedTopicFiles.rejected, (state, action) => {
                state.status = "failed;";
            })
            .addCase(fetchSelectedTopicOwner.pending, (state, action) => {
                state.status = "loading";
            })
            .addCase(fetchSelectedTopicOwner.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.owner = action.payload.data;
            })
            .addCase(fetchSelectedTopicOwner.rejected, (state, action) => {
                state.status = "failed;";
            });
    },
});

// Action creators are generated for each case reducer function
export const { setChecked, clearChecked } = selectedTopicSlice.actions;

export default selectedTopicSlice.reducer;
