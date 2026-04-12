import { request } from '@/lib/axios';
import { LeaveRecord } from '@/components/dashboard/types';

export const LeaveApi = {
  getAllLeaveRequests: () => {
    return request.get<LeaveRecord[]>('/leave-requests');
  },

  createLeaveRequest: (data: Partial<LeaveRecord>) => {
    return request.post<LeaveRecord>('/leave-requests', data);
  },

  approveLeaveRequest: (id: number) => {
    return request.post<LeaveRecord>(`/leave-requests/${id}/approve`);
  },

  rejectLeaveRequest: (id: number, reason?: string) => {
    return request.post<LeaveRecord>(`/leave-requests/${id}/reject`, null, {
      params: { reason },
    });
  },
};

export default LeaveApi;
