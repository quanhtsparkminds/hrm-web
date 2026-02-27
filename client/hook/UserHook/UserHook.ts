import { useQuery } from "@tanstack/react-query";
import { authApi } from "@/services/AuthApi/AuthApi";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectAccessToken, selectIsSignedIn, setUser } from "@/store/slices/AuthSlice";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const useUser = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const isSignedIn = useAppSelector(selectIsSignedIn);
    const accessToken = useAppSelector(selectAccessToken);

    const query = useQuery({
        queryKey: ["user", "me"],
        queryFn: async () => {
            const res = await authApi.getCurrentUser();
            if (!res.success || !res.data) {
                throw new Error(res.message || "Failed to fetch user");
            }
            return res.data;
        },
        enabled: !!isSignedIn && !!accessToken,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    useEffect(() => {
        if (query.data) {
            dispatch(setUser(query.data));
        }
    }, [query.data, dispatch]);

    useEffect(() => {
        if (query.isError) {
            navigate("/login");
        }
    }, [query.isError, navigate]);

    return {
        ...query,
        user: query.data,
    };
};

export const useRoleNavigation = () => {
    const result = useUser();
    const { user, isLoading } = result;
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && user) {
            if (user.role === "ADMIN") {
                navigate("/director-dashboard");
            } else if (user.role === "HR") {
                navigate("/hr-dashboard");
            } else if (user.role === "TEAM_LEADER") {
                navigate("/team-leader-dashboard");
            }
        }
    }, [user, isLoading, navigate]);

    return result;
};

export const useRoleGuard = (allowedRoles: string[], fallbackPath: string = "/dashboard") => {
    const result = useUser();
    const { user, isLoading } = result;
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && user) {
            if (!allowedRoles.includes(user.role)) {
                navigate(fallbackPath);
            }
        }
    }, [user, isLoading, navigate, allowedRoles, fallbackPath]);

    return result;
};

