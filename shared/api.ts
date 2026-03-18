/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

export interface DirectorSummaryResponse {
  totalEmployees: number;
  totalPresentToDay: number;
  totalOnLeave: number;
}

export interface HRSummaryResponse {
  totalEmployees: number;
  totalPendingLeaveRequest: number;
  totalApprovedLeaveRequest: number;
  totalUpcomingEvent: number;
}

export interface MemberSummaryResponse {
  totalVacationDays: number;
  totalSickDays: string;
  totalCasualDays: string;
}
