import { useQuery } from '@tanstack/react-query';
import MasterApi from '@/services/MasterApi/MasterApi';
import { useMemo } from 'react';

/**
 * Hook to fetch all departments and provide memoized data.
 */
export const useDepartments = () => {
    return useQuery({
        queryKey: ['master', 'departments'],
        queryFn: () => MasterApi.getDepartments(),
        staleTime: 60 * 60 * 1000, // 60 minutes for master data
    });
};

/**
 * Hook to fetch all positions.
 */
export const usePositions = () => {
    return useQuery({
        queryKey: ['master', 'positions'],
        queryFn: () => MasterApi.getPositions(),
        staleTime: 60 * 60 * 1000,
    });
};
