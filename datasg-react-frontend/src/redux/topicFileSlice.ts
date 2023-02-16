import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { Dayjs } from "dayjs";

export interface TopicFileDetails {
    file_id: string;
    topic_id: string;
    agency_id: string;
    file_url: string;
    file_date: string;
}

interface SelectedTopicFilesState {
    topicFiles: Array<TopicFileDetails>;
    checked: Array<string>;
    status: string;
}

interface FetchTopicFilesResponseType {
    error: boolean;
    message: string;
    data: Array<TopicFileDetails> | undefined;
}

// initialize initial state for user in redux store
const initialState: SelectedTopicFilesState = {
    topicFiles: [],
    checked: [],
    status: "idle", //'idle' | 'loading' | 'succeeded' | 'failed'
};

export const fetchSelectedTopicFiles = createAsyncThunk(
    "selectedTopic/fetchSelectedTopicFiles",
    async (key: string) => {
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
            });
    },
});

// Action creators are generated for each case reducer function
export const { setChecked, clearChecked } = selectedTopicSlice.actions;

export default selectedTopicSlice.reducer;
