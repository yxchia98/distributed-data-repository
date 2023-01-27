import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

interface UserState {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    contact: string;
    agencyId: string;
    registered: boolean;
    loggedIn: boolean;
}

interface FetchUserResponseType {
    error: boolean;
    message: string;
    userId: string;
    email: string;
}

interface FetchUserDetailsResponseType {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    contact: string;
    agencyId: string;
}

const initialState = {
    userId: "HEHE",
    firstName: "",
    lastName: "",
    email: "",
    contact: "",
    agencyId: "",
    registered: false,
    loggedIn: false,
} as UserState;

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setStatus: (state, action: PayloadAction<FetchUserResponseType>) => {
            state.userId = action.payload.userId;
            state.email = action.payload.email;
            if (action.payload.userId) {
                state.loggedIn = true;
            }
        },
        setDetails: (state, action: PayloadAction<FetchUserDetailsResponseType>) => {
            state.userId = action.payload.userId;
            state.firstName = action.payload.firstName;
            state.lastName = action.payload.lastName;
            state.email = action.payload.email;
            state.contact = action.payload.contact;
            state.agencyId = action.payload.agencyId;
        },
    },
    extraReducers: {},
});

// Action creators are generated for each case reducer function
export const { setStatus, setDetails } = userSlice.actions;

export const selectUserId = (state: RootState) => state.user;

export default userSlice.reducer;
