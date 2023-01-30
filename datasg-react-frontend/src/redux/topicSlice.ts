import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { useAppSelector } from "./hooks";

const initialState = {
    topics: [],
    status: "idle", //'idle' | 'loading' | 'succeeded' | 'failed'
    error: <string | undefined>undefined,
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {},
    extraReducers: (builder) => {},
});

// Action creators are generated for each case reducer function
export const {} = userSlice.actions;

export default userSlice.reducer;
