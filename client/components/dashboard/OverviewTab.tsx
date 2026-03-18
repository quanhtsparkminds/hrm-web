import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Calendar, CheckCircle, Clock } from 'lucide-react';
import { DirectorSummaryResponse, HRSummaryResponse, MemberSummaryResponse } from '@shared/api';
import { TUserProfile } from '@/services/AuthApi/AuthApi.types';
import { LeaveRecord } from './types';

interface OverviewTabProps {
  user: TUserProfile;
  directorSummary: DirectorSummaryResponse | null;
  hrSummary: HRSummaryResponse | null;
  memberSummary: MemberSummaryResponse | null;
  leaveBalance: { vacation: number; sick: number; casual: number };
  usedLeave: { vacation: number; sick: number; casual: number };
  leaves: LeaveRecord[];
}

export default function OverviewTab({
  user,
  directorSummary,
  hrSummary,
  memberSummary,
  leaveBalance,
  usedLeave,
  leaves,
}: OverviewTabProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome, {user?.name}!</h2>
        <p className="text-gray-600">
          Here's your {user?.role === 'ADMIN' ? 'Director' : user?.role === 'HR' ? 'HR' : user?.role === 'TEAM_LEADER' ? 'Team Leader' : 'Employee'} dashboard overview
        </p>
      </div>

      {/* Dashboard Summary based on Role */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {user.role === 'ADMIN' && directorSummary && (
          <>
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-500">Total Employees</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{directorSummary.totalEmployees}</div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-500">Present Today</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{directorSummary.totalPresentToDay}</div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-500">On Leave</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-600">{directorSummary.totalOnLeave}</div>
              </CardContent>
            </Card>
          </>
        )}

        {(user.role === 'HR' || user.role === 'TEAM_LEADER') && hrSummary && (
          <>
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Employees</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{hrSummary.totalEmployees}</div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-xs font-medium text-gray-500 uppercase tracking-wider">Pending Leave Req.</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-600">{hrSummary.totalPendingLeaveRequest}</div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-xs font-medium text-gray-500 uppercase tracking-wider">Approved Leave Req.</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{hrSummary.totalApprovedLeaveRequest}</div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm lg:col-span-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-xs font-medium text-gray-500 uppercase tracking-wider">Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{hrSummary.totalUpcomingEvent}</div>
              </CardContent>
            </Card>
          </>
        )}

        {(user.role === 'TEAM_MEMBER' || !user.role) && (
          <>
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-gray-600">Vacation Days</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-primary">
                    {memberSummary ? memberSummary.totalVacationDays : (leaveBalance.vacation - usedLeave.vacation)}
                  </span>
                  <span className="text-sm text-gray-600">of {leaveBalance.vacation} days</span>
                </div>
                <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500"
                    style={{
                      width: `${(usedLeave.vacation / leaveBalance.vacation) * 100}%`,
                    }}
                  ></div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-gray-600">Sick Days</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-green-600">
                    {memberSummary ? memberSummary.totalSickDays : (leaveBalance.sick - usedLeave.sick)}
                  </span>
                  <span className="text-sm text-gray-600">of {leaveBalance.sick} days</span>
                </div>
                <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500"
                    style={{
                      width: `${(usedLeave.sick / leaveBalance.sick) * 100}%`,
                    }}
                  ></div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-gray-600">Casual Days</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-amber-600">
                    {memberSummary ? memberSummary.totalCasualDays : (leaveBalance.casual - usedLeave.casual)}
                  </span>
                  <span className="text-sm text-gray-600">of {leaveBalance.casual} days</span>
                </div>
                <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500"
                    style={{
                      width: `${(usedLeave.casual / leaveBalance.casual) * 100}%`,
                    }}
                  ></div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Recent Leaves */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Recent Leave Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {leaves.slice(0, 3).map((leave) => (
              <div
                key={leave.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{leave.leaveType}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(leave.startDate).toLocaleDateString()} to {new Date(leave.endDate).toLocaleDateString()} ({leave.totalDays} days)
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {leave.status === 'APPROVED' && (
                    <span className="flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                      <CheckCircle size={14} /> Approved
                    </span>
                  )}
                  {leave.status === 'PENDING' && (
                    <span className="flex items-center gap-1 px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-sm font-medium">
                      <Clock size={14} /> Pending
                    </span>
                  )}
                  {leave.status === 'REJECTED' && (
                    <span className="flex items-center gap-1 px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm font-medium">
                      <AlertCircle size={14} /> Rejected
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
