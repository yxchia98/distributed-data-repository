import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

interface TopicDetails {
    topic_id: string;
    user_id: string;
    agency_id: string;
    topic_name: string;
    topic_url: string;
    description: string;
    last_update: Date;
}

interface TopicState {
    topics: Array<TopicDetails>;
    search: TopicSearch;
    status: string;
}

interface FetchTopicsResponseType {
    error: boolean;
    message: string;
    data: Array<TopicDetails> | undefined;
}

export interface TopicSearch {
    search: string;
    agency_id: string;
}

const initialSearchState: TopicSearch = {
    search: "",
    agency_id: "",
};

// initialize initial state for user in redux store
const initialState: TopicState = {
    topics: [],
    search: initialSearchState,
    status: "idle", //'idle' | 'loading' | 'succeeded' | 'failed'
};

export const selectedTopicSlice = createSlice({
    name: "topics",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder;
    },
});

// Action creators are generated for each case reducer function
export const {} = selectedTopicSlice.actions;

export default selectedTopicSlice.reducer;
