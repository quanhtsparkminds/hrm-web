import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/store/Store';
import { storage, StorageKeys } from '@/lib/storage';
import type { TUserProfile } from '@/services/AuthApi/AuthApi.types';

export const authSliceKey = 'auth';

type AuthState = {
  user: TUserProfile | null;
  isLoggedIn: boolean;
  isInitialized: boolean;
};

// Hydrate initial state from storage
const initialState: AuthState = {
  user: (() => {
    try {
      const raw = storage.getString(StorageKeys.user);
      return raw ? (JSON.parse(raw) as TUserProfile) : null;
    } catch {
      return null;
    }
  })(),
  isLoggedIn: storage.getBoolean(StorageKeys.isLoggedIn) ?? false,
  isInitialized: false,
};

export const authSlice = createSlice({
  name: authSliceKey,
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<TUserProfile>) => {
      state.user = action.payload;
      state.isLoggedIn = true;
      state.isInitialized = true;
      storage.set(StorageKeys.user, JSON.stringify(action.payload));
      storage.set(StorageKeys.isLoggedIn, true);
    },
    signOut: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      state.isInitialized = true;
      // Clear general storage
      storage.delete(StorageKeys.user);
      storage.delete(StorageKeys.isLoggedIn);
    },
    setInitialized: (state) => {
      state.isInitialized = true;
    },
  },
});

export const { setUser, signOut, setInitialized } = authSlice.actions;

// Selectors
export const selectIsSignedIn = (state: RootState) => state.auth.isLoggedIn;
export const selectUser = (state: RootState) => state.auth.user;
export const selectUserRole = (state: RootState) => state.auth.user?.role;
export const selectIsAuthInitialized = (state: RootState) => state.auth.isInitialized;

export default authSlice.reducer;
