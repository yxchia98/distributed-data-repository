import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { AccessDetail, FetchAccessResponse } from "./accessSlice";

export interface TopicDetails {
    topic_id: string;
    user_id: string;
    agency_id: string;
    topic_name: string;
    topic_url: string;
    description: string;
    last_update: string;
}

interface TopicState {
    topics: Array<TopicDetails>;
    search: TopicSearch;
    currentTopic: TopicDetails;
    currentTopicAccess: CurrentTopicAccess;
    status: string;
    accessStatus: string;
}

interface CurrentTopicAccess {
    read: Array<AccessDetail>;
    write: Array<AccessDetail>;
}

interface FetchCurrentTopicAccessReturnType {
    error: boolean;
    message: string;
    read: Array<AccessDetail>;
    write: Array<AccessDetail>;
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

const initialCurrentTopic: TopicDetails = {
    topic_id: "",
    user_id: "",
    agency_id: "",
    topic_name: "",
    topic_url: "",
    description: "",
    last_update: "",
};

// initialize initial state for user in redux store
const initialState: TopicState = {
    topics: [],
    search: initialSearchState,
    currentTopic: initialCurrentTopic,
    currentTopicAccess: {
        read: [],
        write: [],
    },
    status: "idle", //'idle' | 'loading' | 'succeeded' | 'failed'
    accessStatus: "idle", //'idle' | 'loading' | 'succeeded' | 'failed'
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

export const fetchCurrentTopicAccess = createAsyncThunk(
    "topics/fetchCurrentTopicAccess",
    async (topicId: string) => {
        let res: FetchCurrentTopicAccessReturnType = {
            error: true,
            message: "error fetching access for topic",
            read: [],
            write: [],
        };
        const fetchReadAccessConfigurationObject: AxiosRequestConfig = {
            method: "get",
            url: `${process.env.REACT_APP_DATA_READER_API_URL}auth/topicread`,
            headers: {},
            params: {
                topic_id: topicId,
            },
            withCredentials: true,
        };
        const fetchWriteAccessConfigurationObject: AxiosRequestConfig = {
            method: "get",
            url: `${process.env.REACT_APP_DATA_READER_API_URL}auth/topicwrite`,
            headers: {},
            params: {
                topic_id: topicId,
            },
            withCredentials: true,
        };
        try {
            const fetchReadAccessResponse: AxiosResponse<FetchAccessResponse> = await axios(
                fetchReadAccessConfigurationObject
            );
            const fetchWriteAccessResponse: AxiosResponse<FetchAccessResponse> = await axios(
                fetchWriteAccessConfigurationObject
            );
            if (fetchReadAccessResponse.data.error || fetchWriteAccessResponse.data.error) {
                return res;
            }
            res.error = false;
            res.message = "successfully retrieved read and write acceses for topic";
            res.read = fetchReadAccessResponse.data.data;
            res.write = fetchWriteAccessResponse.data.data;
            return res;
        } catch (error: any) {
            return res;
        }
    }
);

export const topicsSlice = createSlice({
    name: "topics",
    initialState,
    reducers: {
        setSearch: (state, action: PayloadAction<TopicSearch>) => {
            const searchText = action.payload.search ? action.payload.search : "";
            const searchAgency = action.payload.agency_id ? action.payload.agency_id : "";
            state.search.search = searchText;
            state.search.agency_id = searchAgency;
        },
        setCurrentTopicWithId: (state, action: PayloadAction<string>) => {
            let foundTopic = state.topics.find((topic) => topic.topic_id === action.payload);
            state.currentTopic = foundTopic ? foundTopic : initialCurrentTopic;
        },
        setCurrentTopicWithDetails: (state, action: PayloadAction<TopicDetails>) => {
            state.currentTopic = action.payload;
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
            })
            .addCase(fetchCurrentTopicAccess.pending, (state, action) => {
                state.accessStatus = "loading";
            })
            .addCase(fetchCurrentTopicAccess.fulfilled, (state, action) => {
                state.accessStatus = "succeeded";
                state.currentTopicAccess.read = action.payload.read;
                state.currentTopicAccess.write = action.payload.write;
            })
            .addCase(fetchCurrentTopicAccess.rejected, (state, action) => {
                state.accessStatus = "failed;";
            });
    },
});

// Action creators are generated for each case reducer function
export const { setSearch, setCurrentTopicWithId, setCurrentTopicWithDetails } = topicsSlice.actions;

export default topicsSlice.reducer;
