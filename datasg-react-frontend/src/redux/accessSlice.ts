import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

interface AccessState {
    readAccess: Array<ReadAccessDetail>;
    writeAccess: Array<WriteAccessDetail>;
    requested: Array<AccessRequestDetail>;
    approvable: Array<AccessRequestDetail>;
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
    requested: [],
    approvable: [],
    status: "idle", //'idle' | 'loading' | 'succeeded' | 'failed'
};

export const fetchAccessRequests = createAsyncThunk(
    "access/fetchAccessRequests",
    async (userId: string) => {
        let res: AccessState = {
            readAccess: [],
            writeAccess: [],
            requested: [],
            approvable: [],
            status: "",
        };
        try {
            const fetchSubmittedAccessRequestConfigurationObject: AxiosRequestConfig = {
                method: "get",
                url: `${process.env.REACT_APP_DATA_READER_API_URL}auth/requestapproval`,
                headers: {},
                withCredentials: true,
                params: {
                    user_id: userId,
                },
            };

            const fetchApprovableAccessRequestConfigurationObject: AxiosRequestConfig = {
                method: "get",
                url: `${process.env.REACT_APP_DATA_READER_API_URL}auth/submittedrequest`,
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
            res.requested = fetchSubmittedRequestAccessResponse.data.data;
            res.approvable = fetchApprovableRequestAccessResponse.data.data;
            return res;
        } catch (error: any) {
            return res;
        }
    }
);

export const fetchAccess = createAsyncThunk("access/fetchAccess", async () => {
    let res: AccessState = {
        readAccess: [],
        writeAccess: [],
        requested: [],
        approvable: [],
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
                state.approvable = action.payload.approvable;
                state.requested = action.payload.requested;
            })
            .addCase(fetchAccessRequests.rejected, (state, action) => {
                state.status = "failed;";
            });
    },
});

// Action creators are generated for each case reducer function
export const {} = accessSlice.actions;

export default accessSlice.reducer;
