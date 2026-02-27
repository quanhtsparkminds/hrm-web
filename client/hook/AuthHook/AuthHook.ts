import { useNavigate } from "react-router-dom";
import { storage, StorageKeys } from "@/lib/storage";
import { request } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/services/AuthApi/AuthApi";
import * as Types from "@/services/AuthApi/AuthApi.types";
import { useAppDispatch } from "@/store";
import { signIn, setUser, signOut } from "@/store/slices/AuthSlice";

export const useLoginMutation = () => {
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: Types.TLoginRequest) => {
            // 1. Login to get tokens
            const loginRes = await authApi.login(data);

            if (!loginRes.success || !loginRes.data) {
                throw new Error(loginRes.message || "Login failed");
            }

            const { accessToken, refreshToken } = loginRes.data;

            // Dispatch signIn — stores tokens in Redux state + storage layer
            dispatch(signIn({ accessToken, refreshToken }));

            // 2. Fetch current user profile
            const userRes = await authApi.getCurrentUser();

            if (!userRes.success || !userRes.data) {
                throw new Error("Failed to fetch user profile");
            }

            const profile = userRes.data;

            // Update TanStack Query cache
            queryClient.setQueryData(["user", "me"], profile);

            // Dispatch setUser — stores user in Redux state + storage layer
            dispatch(setUser(profile));

            return profile;
        },
    });
};

export const useLogout = () => {
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const logout = async () => {
        try {
            const refreshToken = storage.getString(StorageKeys.refreshToken);
            if (refreshToken) {
                await request.post("/auth/logout", { refreshToken });
            }
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            // 1. Clear TanStack Query cache
            queryClient.clear();
            // 2. Dispatch signOut (Redux + Storage)
            dispatch(signOut());
            // 3. Navigate to login
            navigate("/login");
        }
    };

    return { logout };
};
