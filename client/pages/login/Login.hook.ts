import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoginMutation } from '@/hook';
import { ApiError } from '@/lib/axios';
import { getErrorMessage } from '@/lib/errorMapping';
import { useTranslation } from 'react-i18next';
import { useUser } from '@/hook/UserHook/UserHook';
import { useAppSelector } from '@/store';
import { selectIsSignedIn } from '@/store/slices/AuthSlice';

export const useLogin = () => {
  const { t } = useTranslation(['login', 'error']);
  const navigate = useNavigate();
  const isSignedIn = useAppSelector(selectIsSignedIn);
  const { isLoading: isUserLoading, isInitialized } = useUser();

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);

  const loginMutation = useLoginMutation();

  useEffect(() => {
    if (isInitialized && isSignedIn && !isUserLoading) {
      navigate('/dashboard');
    }
  }, [isSignedIn, isUserLoading, isInitialized, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(
      { username, password },
      {
        onSuccess: () => {
          navigate('/dashboard');
        },
      },
    );
  };

  const handleKeycloakLogin = () => {
    window.location.href = `http://localhost:8084/oauth2/authorization/ssohrm`;
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
        ? getErrorMessage(
            (loginMutation.error as ApiError)?.errorCode,
            (loginMutation.error as ApiError)?.message,
          )
        : loginMutation.error?.message || t('error:somethingWentWrong')
      : '',
    handleLogin,
    handleKeycloakLogin,
    navigate,
  };
};
