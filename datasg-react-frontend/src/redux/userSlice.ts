import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { useAppSelector } from "./hooks";

export interface UserState {
    user_id: string;
    first_name: string;
    last_name: string;
    email: string;
    contact: string;
    agency_id: string;
    registered: boolean;
    loggedIn: boolean;
}

export interface FetchUserResponseType {
    error: boolean;
    message: string;
    data: FetchUserResponse | undefined;
}

interface FetchUserResponse {
    user_id: string;
    first_name?: string;
    last_name?: string;
    email: string;
    contact?: string;
    agency_id?: string;
}

const initialUserState = {
    user_id: "",
    first_name: "",
    last_name: "",
    email: "",
    contact: "",
    agency_id: "",
    registered: false,
    loggedIn: false,
} as UserState;

// initialize initial state for user in redux store
const initialState = {
    user: initialUserState,
    status: "idle", //'idle' | 'loading' | 'succeeded' | 'failed'
    error: <string | undefined>undefined,
};

export const fetchUser = createAsyncThunk("user/fetchUser", async () => {
    try {
        // configuration object for sending GET request to validify login session
        const authUserConfigurationObject: AxiosRequestConfig = {
            method: "get",
            url: `${process.env.REACT_APP_DATA_WRITER_API_URL}auth/login/success`,
            headers: {},
            withCredentials: true,
        };
        // send request to get login session details
        const authResponse: AxiosResponse<FetchUserResponseType> = await axios(
            authUserConfigurationObject
        );
        // retrieve user details from db, using OAuth-retrieved ID
        if (authResponse.data.data?.user_id) {
            const userDetailsConfigurationObject: AxiosRequestConfig = {
                method: "get",
                url: `${process.env.REACT_APP_DATA_READER_API_URL}profile/user`,
                headers: {},
                params: { user_id: authResponse.data.data.user_id },
                withCredentials: true,
            };
            const detailsResponse: AxiosResponse<FetchUserResponseType> = await axios(
                userDetailsConfigurationObject
            );
            return detailsResponse.data;
        } else {
            return authResponse.data;
        }
    } catch (error: any) {
        console.log(error.message);
        const errorResponse: FetchUserResponseType = {
            error: true,
            message: "",
            data: undefined,
        };
        return errorResponse;
    }
});

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setStatus: (state, action: PayloadAction<FetchUserResponseType>) => {
            state.user.user_id = action.payload.data?.user_id ? action.payload.data?.user_id : "";
            state.user.email = action.payload.data?.email ? action.payload.data?.email : "";
            if (action.payload.data?.user_id) {
                state.user.loggedIn = true;
            }
        },
        setDetails: (state, action: PayloadAction<FetchUserResponseType>) => {
            state.user.user_id = action.payload.data?.user_id ? action.payload.data?.user_id : "";
            state.user.first_name = action.payload.data?.first_name
                ? action.payload.data?.first_name
                : "";
            state.user.last_name = action.payload.data?.last_name
                ? action.payload.data?.last_name
                : "";
            state.user.email = action.payload.data?.email ? action.payload.data?.email : "";
            state.user.contact = action.payload.data?.contact ? action.payload.data?.contact : "";
            state.user.agency_id = action.payload.data?.agency_id
                ? action.payload.data?.agency_id
                : "";
            if (action.payload.data?.user_id && action.payload.data?.agency_id) {
                state.user.registered = true;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUser.pending, (state, action) => {
                state.status = "loading";
                state.user.loggedIn = false;
                state.user.registered = false;
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.status = "succeeded";
                // retrieve data parsed from thunk and assign to current redux state
                console.log(action.payload);
                const loadedUser = action.payload.data
                    ? action.payload.data
                    : { user_id: "", email: "" };
                if (action.payload.data?.user_id && action.payload.data?.email) {
                    state.user.loggedIn = true;
                    state.user.user_id = loadedUser.user_id;
                    state.user.email = loadedUser.email;
                }
                if (action.payload.data?.agency_id) {
                    state.user.registered = true;
                    state.user.first_name = loadedUser.first_name ? loadedUser.first_name : "";
                    state.user.last_name = loadedUser.last_name ? loadedUser.last_name : "";
                    state.user.contact = loadedUser.contact ? loadedUser.contact : "";
                    state.user.agency_id = loadedUser.agency_id ? loadedUser.agency_id : "";
                }
            })
            .addCase(fetchUser.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
                state.user.loggedIn = false;
                state.user.registered = false;
            });
    },
});

// Action creators are generated for each case reducer function
export const { setStatus, setDetails } = userSlice.actions;

export default userSlice.reducer;
