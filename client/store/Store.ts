import { combineReducers, configureStore } from "@reduxjs/toolkit";
import AuthSlice, { authSliceKey } from "./slices/AuthSlice";
import UiSlice, { uiSliceKey } from "./slices/UiSlice";

const rootReducer = combineReducers({
    [authSliceKey]: AuthSlice,
    [uiSliceKey]: UiSlice,
});

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware({
            serializableCheck: true,
        });
    },
    devTools: import.meta.env.DEV,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
