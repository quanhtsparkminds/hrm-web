import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import LeaveApi from '@/services/LeaveApi/LeaveApi';
import { LeaveRecord } from '@/components/dashboard/types';

/**
 * Custom hook to fetch all leave requests.
 */
export const useLeaves = () => {
  return useQuery({
    queryKey: ['leaves'],
    queryFn: async () => {
      const res = await LeaveApi.getAllLeaveRequests();
      return res.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Custom hook to create a new leave request.
 */
export const useCreateLeave = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<LeaveRecord>) => LeaveApi.createLeaveRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaves'] });
    },
  });
};

/**
 * Custom hook to approve a leave request.
 */
export const useApproveLeave = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => LeaveApi.approveLeaveRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaves'] });
    },
  });
};

/**
 * Custom hook to reject a leave request.
 */
export const useRejectLeave = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) =>
      LeaveApi.rejectLeaveRequest(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaves'] });
    },
  });
};
