import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

interface AccessState {
    readAccess: Array<AccessDetail>;
    writeAccess: Array<AccessDetail>;
    outgoing: Array<AccessRequestDetail>;
    incoming: Array<AccessRequestDetail>;
    status: string;
}

export interface AccessDetail {
    user_id: string;
    topic_id: string;
    last_access: string;
}

export interface AccessRequestDetail {
    request_id: string;
    requestor_id: string;
    approver_id: string;
    topic_id: string;
    access_type: string;
    status: string;
    description: string;
    request_date: string;
}

interface FetchAccessRequestResponse {
    error: boolean;
    message: string;
    data: Array<AccessRequestDetail>;
}

export interface FetchAccessResponse {
    error: boolean;
    message: string;
    data: Array<AccessDetail>;
}

// initialize initial state for user in redux store
const initialState: AccessState = {
    readAccess: [],
    writeAccess: [],
    incoming: [],
    outgoing: [],
    status: "idle", //'idle' | 'loading' | 'succeeded' | 'failed'
};

export const fetchAccessRequests = createAsyncThunk(
    "access/fetchAccessRequests",
    async (userId: string) => {
        let res: AccessState = {
            readAccess: [],
            writeAccess: [],
            outgoing: [],
            incoming: [],
            status: "",
        };
        try {
            const fetchSubmittedAccessRequestConfigurationObject: AxiosRequestConfig = {
                method: "get",
                url: `${process.env.REACT_APP_DATA_READER_API_URL}auth/submittedrequest`,
                headers: {},
                withCredentials: true,
                params: {
                    user_id: userId,
                },
            };

            const fetchApprovableAccessRequestConfigurationObject: AxiosRequestConfig = {
                method: "get",
                url: `${process.env.REACT_APP_DATA_READER_API_URL}auth/requestapproval`,
                headers: {},
                withCredentials: true,
                params: {
                    user_id: userId,
                },
            };
            const fetchSubmittedRequestAccessResponse: AxiosResponse<FetchAccessRequestResponse> =
                await axios(fetchSubmittedAccessRequestConfigurationObject);
            const fetchApprovableRequestAccessResponse: AxiosResponse<FetchAccessRequestResponse> =
                await axios(fetchApprovableAccessRequestConfigurationObject);
            res.outgoing = fetchSubmittedRequestAccessResponse.data.data;
            res.incoming = fetchApprovableRequestAccessResponse.data.data;
            return res;
        } catch (error: any) {
            return res;
        }
    }
);

export const fetchAccess = createAsyncThunk("access/fetchAccess", async (userId: string) => {
    let res: AccessState = {
        readAccess: [],
        writeAccess: [],
        outgoing: [],
        incoming: [],
        status: "",
    };
    try {
        const fetchReadAccessConfigurationObject: AxiosRequestConfig = {
            method: "get",
            url: `${process.env.REACT_APP_DATA_READER_API_URL}auth/read`,
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            params: {
                user_id: userId,
            },
            withCredentials: true,
        };
        const fetchWriteAccessConfigurationObject: AxiosRequestConfig = {
            method: "get",
            url: `${process.env.REACT_APP_DATA_READER_API_URL}auth/write`,
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            params: {
                user_id: userId,
            },
            withCredentials: true,
        };
        const fetchReadAccessResponse: AxiosResponse<FetchAccessResponse> = await axios(
            fetchReadAccessConfigurationObject
        );
        const FetchAccessResponse: AxiosResponse<FetchAccessResponse> = await axios(
            fetchWriteAccessConfigurationObject
        );
        res.readAccess = fetchReadAccessResponse.data.data;
        res.writeAccess = FetchAccessResponse.data.data;
        return res;
    } catch (error: any) {
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
            })
            .addCase(fetchAccessRequests.pending, (state, action) => {
                state.status = "loading";
            })
            .addCase(fetchAccessRequests.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.incoming = action.payload.incoming;
                state.outgoing = action.payload.outgoing;
            })
            .addCase(fetchAccessRequests.rejected, (state, action) => {
                state.status = "failed;";
            });
    },
});

// Action creators are generated for each case reducer function
export const {} = accessSlice.actions;

export default accessSlice.reducer;
