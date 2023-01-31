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

interface TopicSearch {
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

export const fetchTopics = createAsyncThunk("topics/fetchTopics", async () => {
    let res: FetchTopicsResponseType = {
        data: [],
        message: "Error fetching topics",
        error: true,
    };
    try {
        const fetchTopicsConfigurationObject: AxiosRequestConfig = {
            method: "get",
            url: `${process.env.REACT_APP_DATA_READER_API_URL}topic/topics`,
            headers: {},
            withCredentials: true,
        };
        const fetchTopicResponse: AxiosResponse<FetchTopicsResponseType> = await axios(
            fetchTopicsConfigurationObject
        );
        res.data = fetchTopicResponse.data.data ? fetchTopicResponse.data.data : [];
        res.message = fetchTopicResponse.data.message ? fetchTopicResponse.data.message : "";
        res.error = fetchTopicResponse.data.error ? fetchTopicResponse.data.error : true;
        return res;
    } catch (error) {
        return res;
    }
});

export const topicsSlice = createSlice({
    name: "topics",
    initialState,
    reducers: {
        setSearch: (state, action: PayloadAction<TopicSearch>) => {
            state.search = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTopics.pending, (state, action) => {
                state.status = "loading";
            })
            .addCase(fetchTopics.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.topics = action.payload.data ? action.payload.data : [];
            })
            .addCase(fetchTopics.rejected, (state, action) => {
                state.status = "failed;";
            });
    },
});

// Action creators are generated for each case reducer function
export const {} = topicsSlice.actions;

export default topicsSlice.reducer;
