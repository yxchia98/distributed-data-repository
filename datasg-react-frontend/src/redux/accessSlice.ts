import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

interface AccessState {
    readAccess: Array<ReadAccessDetail>;
    writeAccess: Array<WriteAccessDetail>;
    status: string;
}

interface ReadAccessDetail {
    user_id: string;
    topic_id: string;
    last_access: string;
}
interface WriteAccessDetail {
    user_id: string;
    topic_id: string;
    last_access: string;
}

interface FetchReadAccessResponse {
    error: boolean;
    message: string;
    data: Array<ReadAccessDetail>;
}

interface FetchWriteAccessResponse {
    error: boolean;
    message: string;
    data: Array<WriteAccessDetail>;
}

// initialize initial state for user in redux store
const initialState: AccessState = {
    readAccess: [],
    writeAccess: [],
    status: "idle", //'idle' | 'loading' | 'succeeded' | 'failed'
};

export const fetchAccess = createAsyncThunk("access/fetchAccess", async () => {
    let res: AccessState = {
        readAccess: [],
        writeAccess: [],
        status: "",
    };
    try {
        const fetchReadAccessConfigurationObject: AxiosRequestConfig = {
            method: "get",
            url: `${process.env.REACT_APP_DATA_READER_API_URL}auth/read`,
            headers: {},
            withCredentials: true,
        };
        const fetchWriteAccessConfigurationObject: AxiosRequestConfig = {
            method: "get",
            url: `${process.env.REACT_APP_DATA_READER_API_URL}auth/write`,
            headers: {},
            withCredentials: true,
        };
        const fetchReadAccessResponse: AxiosResponse<FetchReadAccessResponse> = await axios(
            fetchReadAccessConfigurationObject
        );
        const FetchWriteAccessResponse: AxiosResponse<FetchWriteAccessResponse> = await axios(
            fetchWriteAccessConfigurationObject
        );
        res.readAccess = fetchReadAccessResponse.data.data;
        res.writeAccess = FetchWriteAccessResponse.data.data;
        return res;
    } catch (error) {
        return res;
    }
});

export const accessSlice = createSlice({
    name: "access",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAccess.pending, (state, action) => {
                state.status = "loading";
            })
            .addCase(fetchAccess.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.readAccess = action.payload.readAccess;
                state.writeAccess = action.payload.writeAccess;
            })
            .addCase(fetchAccess.rejected, (state, action) => {
                state.status = "failed;";
            });
    },
});

// Action creators are generated for each case reducer function
export const {} = accessSlice.actions;

export default accessSlice.reducer;
