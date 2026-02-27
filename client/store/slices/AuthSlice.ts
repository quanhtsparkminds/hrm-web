import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/store/Store";
import { secureStorage, storage, StorageKeys } from "@/lib/storage";
import type { TUserProfile } from "@/services/AuthApi/AuthApi.types";

export const authSliceKey = "auth";

type AuthState = {
    accessToken: string;
    refreshToken: string;
    user: TUserProfile | null;
    isLoggedIn: boolean;
};

// Hydrate initial state from storage (mirrors RN's secureStorage/storage usage)
const initialState: AuthState = {
    accessToken: storage.getString(StorageKeys.token) ?? "",
    refreshToken: storage.getString(StorageKeys.refreshToken) ?? "",
    user: (() => {
        try {
            const raw = storage.getString(StorageKeys.user);
            return raw ? (JSON.parse(raw) as TUserProfile) : null;
        } catch {
            return null;
        }
    })(),
    isLoggedIn: storage.getBoolean(StorageKeys.isLoggedIn) ?? false,
};

export const authSlice = createSlice({
    name: authSliceKey,
    initialState,
    reducers: {
        signIn: (
            state,
            action: PayloadAction<{ accessToken: string; refreshToken: string }>
        ) => {
            const { accessToken, refreshToken } = action.payload;
            state.accessToken = accessToken;
            state.refreshToken = refreshToken;
            // Persist tokens via secure storage (equivalent of RN secureStorage.setItem)
            secureStorage.setItem(StorageKeys.token, accessToken);
            secureStorage.setItem(StorageKeys.refreshToken, refreshToken);
            // Also store in general storage so it can be read synchronously on hydration
            storage.set(StorageKeys.token, accessToken);
            storage.set(StorageKeys.refreshToken, refreshToken);
        },
        setUser: (state, action: PayloadAction<TUserProfile>) => {
            state.user = action.payload;
            state.isLoggedIn = true;
            storage.set(StorageKeys.user, JSON.stringify(action.payload));
            storage.set(StorageKeys.isLoggedIn, true);
        },
        signOut: (state) => {
            state.accessToken = "";
            state.refreshToken = "";
            state.user = null;
            state.isLoggedIn = false;
            // Clear secure storage (mirrors RN's secureStorage.removeItem)
            secureStorage.removeItem(StorageKeys.token);
            secureStorage.removeItem(StorageKeys.refreshToken);
            // Clear general storage
            storage.delete(StorageKeys.token);
            storage.delete(StorageKeys.refreshToken);
            storage.delete(StorageKeys.user);
            storage.delete(StorageKeys.isLoggedIn);
        },
    },

});

export const { signIn, setUser, signOut } = authSlice.actions;

// Selectors
export const selectIsSignedIn = (state: RootState) => state.auth.isLoggedIn;
export const selectAccessToken = (state: RootState) => state.auth.accessToken;
export const selectRefreshToken = (state: RootState) =>
    state.auth.refreshToken;
export const selectUser = (state: RootState) => state.auth.user;
export const selectUserRole = (state: RootState) => state.auth.user?.role;

export default authSlice.reducer;

