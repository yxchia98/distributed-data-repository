import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import topicsReducer from "./topicsSlice";
import agenciesReducer from "./agenciesSlice";
import selectedTopicReducer from "./selectedTopicSlice";

export const store = configureStore({
    reducer: {
        user: userReducer,
        topics: topicsReducer,
        agencies: agenciesReducer,
        selectedTopic: selectedTopicReducer,
    },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
