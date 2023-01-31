import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

interface AgencyDetails {
    agency_id: string;
    short_name: string;
    long_name: string;
}

interface AgencyState {
    agencies: Array<AgencyDetails>;
    status: string;
}

interface FetchAgencyResponseType {
    error: boolean;
    message: string;
    data: Array<AgencyDetails> | undefined;
}

// initialize initial state for user in redux store
const initialState: AgencyState = {
    agencies: [],
    status: "idle", //'idle' | 'loading' | 'succeeded' | 'failed'
};

export const fetchAgencies = createAsyncThunk("agencies/fetchAgencies", async () => {
    let res: FetchAgencyResponseType = {
        data: [],
        message: "Error fetching agencies",
        error: true,
    };
    try {
        const fetchAgenciesConfigurationObject: AxiosRequestConfig = {
            method: "get",
            url: `${process.env.REACT_APP_DATA_READER_API_URL}profile/agencies`,
            headers: {},
            withCredentials: true,
        };
        const fetchTopicResponse: AxiosResponse<FetchAgencyResponseType> = await axios(
            fetchAgenciesConfigurationObject
        );
        res.data = fetchTopicResponse.data.data ? fetchTopicResponse.data.data : [];
        res.message = fetchTopicResponse.data.message ? fetchTopicResponse.data.message : "";
        res.error = fetchTopicResponse.data.error ? fetchTopicResponse.data.error : true;
        return res;
    } catch (error) {
        return res;
    }
});

export const agencySlice = createSlice({
    name: "agencies",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAgencies.pending, (state, action) => {
                state.status = "loading";
            })
            .addCase(fetchAgencies.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.agencies = action.payload.data ? action.payload.data : [];
            })
            .addCase(fetchAgencies.rejected, (state, action) => {
                state.status = "failed;";
            });
    },
});

// Action creators are generated for each case reducer function
export const {} = agencySlice.actions;

export default agencySlice.reducer;
