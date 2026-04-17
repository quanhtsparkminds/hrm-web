import { useNavigate } from 'react-router-dom';
import { request } from '@/lib/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/services/AuthApi/AuthApi';
import * as Types from '@/services/AuthApi/AuthApi.types';
import { useAppDispatch } from '@/store';
import { setUser, signOut } from '@/store/slices/AuthSlice';
import { setLoading } from '@/store/slices/UiSlice';

export const useLoginMutation = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Types.TLoginRequest) => {
      dispatch(setLoading(true));
      try {
        // 1. Login - server will set session cookie
        await authApi.login(data);

        // 2. Fetch current user profile (using session cookie)
        const userRes = await authApi.getCurrentUser();
        const profile = userRes.data;

        // Update TanStack Query cache
        queryClient.setQueryData(['user', 'me'], profile);

        // Dispatch setUser
        dispatch(setUser(profile));

        return profile;
      } finally {
        dispatch(setLoading(false));
      }
    },
  });
};

export const useSignupMutation = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: Types.TSignupRequest) => {
      dispatch(setLoading(true));
      try {
        return await authApi.signup(data);
      } finally {
        dispatch(setLoading(false));
      }
    },
    onSuccess: () => {
      navigate('/login');
    },
  });
};

export const useLogout = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const logout = async () => {
    dispatch(setLoading(true));
    try {
      // The server will rely on the session cookie to identify and clear the session.
      await request.post('/auth/logout');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      // 1. Clear TanStack Query cache
      queryClient.clear();
      // 2. Dispatch signOut (Redux + Storage)
      dispatch(signOut());
      // 3. Navigate to login
      navigate('/login');
      dispatch(setLoading(false));
    }
  };

  return { logout };
};
