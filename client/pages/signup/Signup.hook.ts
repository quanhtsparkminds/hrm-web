import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSignupMutation } from "@/hook/AuthHook/AuthHook";
import { ApiError } from "@/lib/axios";
import { getErrorMessage } from "@/lib/errorMapping";
import { toast } from "sonner";

export const useSignup = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const signupMutation = useSignupMutation();

    const togglePasswordVisibility = () => setShowPassword(!showPassword);
    const toggleConfirmPasswordVisibility = () =>
        setShowConfirmPassword(!showConfirmPassword);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            await signupMutation.mutateAsync({
                username,
                email,
                password,
            });
            toast.success("Account created successfully. Please login.");
        } catch (err: any) {
            const message = err instanceof ApiError
                ? getErrorMessage(err.errorCode, err.message)
                : (err.message || "Something went wrong");
            setError(message);
        }
    };

    return {
        username,
        setUsername,
        email,
        setEmail,
        password,
        setPassword,
        confirmPassword,
        setConfirmPassword,
        showPassword,
        showConfirmPassword,
        togglePasswordVisibility,
        toggleConfirmPasswordVisibility,
        handleSignup,
        isLoading: signupMutation.isPending,
        error,
        navigate,
    };
};
