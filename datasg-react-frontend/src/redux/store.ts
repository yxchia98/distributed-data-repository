import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import topicsReducer from "./topicSlice";
import agenciesReducer from "./agencySlice";
import topicFilesReducer from "./topicFileSlice";

export const store = configureStore({
    reducer: {
        user: userReducer,
        topics: topicsReducer,
        agencies: agenciesReducer,
        topicFiles: topicFilesReducer,
    },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
