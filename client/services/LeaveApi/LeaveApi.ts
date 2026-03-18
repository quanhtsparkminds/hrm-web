import { request } from "@/lib/axios";
import { LeaveRecord } from "@/components/dashboard/types";

export const LeaveApi = {
  getAllLeaveRequests: () => {
    return request.get<LeaveRecord[]>("leave-requests");
  },

  createLeaveRequest: (data: Partial<LeaveRecord>) => {
    return request.post<LeaveRecord>("leave-requests", data);
  },
};

export default LeaveApi;
