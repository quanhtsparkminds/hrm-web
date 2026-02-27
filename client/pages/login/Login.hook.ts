import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "@/hook";
import { ApiError } from "@/lib/axios";
import { getErrorMessage } from "@/lib/errorMapping";

export const useLogin = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("hrsparkminds");
    const [password, setPassword] = useState("123456");
    const [showPassword, setShowPassword] = useState(false);

    const loginMutation = useLoginMutation();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        loginMutation.mutate(
            { username, password },
            {
                onSuccess: () => {
                    navigate("/dashboard");
                },
            }
        );
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    return {
        username,
        setUsername,
        password,
        setPassword,
        showPassword,
        togglePasswordVisibility,
        isLoading: loginMutation.isPending,
        error: loginMutation.error
            ? loginMutation.error instanceof ApiError
                ? getErrorMessage(loginMutation.error.errorCode, loginMutation.error.message)
                : loginMutation.error.message
            : "",
        handleLogin,
        navigate,
    };
};
