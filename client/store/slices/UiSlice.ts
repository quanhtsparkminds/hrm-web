import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const uiSliceKey = "ui";

type UiState = {
    isLoading: boolean;
    loadingMessage?: string;
};

const initialState: UiState = {
    isLoading: false,
};

export const uiSlice = createSlice({
    name: uiSliceKey,
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setLoadingWithMessage: (state, action: PayloadAction<{ loading: boolean; message?: string }>) => {
            state.isLoading = action.payload.loading;
            state.loadingMessage = action.payload.message;
        },
    },
});

export const { setLoading, setLoadingWithMessage } = uiSlice.actions;

export default uiSlice.reducer;
