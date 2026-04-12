import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Info,
} from 'lucide-react';
import { DirectorSummaryResponse, HRSummaryResponse, MemberSummaryResponse } from '@shared/api';
import { TUserProfile } from '@/services/AuthApi/AuthApi.types';
import { LeaveRecord } from './types';
import { useState } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isWithinInterval,
  parseISO,
} from 'date-fns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

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
          Here's your{' '}
          {user?.role === 'ADMIN'
            ? 'Director'
            : user?.role === 'HR'
              ? 'HR'
              : user?.role === 'LEADER'
                ? 'Team Leader'
                : 'Employee'}{' '}
          dashboard overview
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
                <div className="text-3xl font-bold text-primary">
                  {directorSummary.totalEmployees}
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-500">Present Today</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {directorSummary.totalPresentToDay}
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-500">On Leave</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-600">
                  {directorSummary.totalOnLeave}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {(user.role === 'HR' || user.role === 'TEAM_LEADER') && hrSummary && (
          <>
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Employees
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{hrSummary.totalEmployees}</div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pending Leave Req.
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-600">
                  {hrSummary.totalPendingLeaveRequest}
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Approved Leave Req.
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {hrSummary.totalApprovedLeaveRequest}
                </div>
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
                    {memberSummary
                      ? memberSummary.totalVacationDays
                      : leaveBalance.vacation - usedLeave.vacation}
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
                    {memberSummary
                      ? memberSummary.totalSickDays
                      : leaveBalance.sick - usedLeave.sick}
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
                    {memberSummary
                      ? memberSummary.totalCasualDays
                      : leaveBalance.casual - usedLeave.casual}
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

      <LeaveCalendar leaves={leaves} />
    </div>
  );
}

function LeaveCalendar({ leaves }: { leaves: LeaveRecord[] }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedLeave, setSelectedLeave] = useState<LeaveRecord | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const getLeavesForDay = (day: Date) => {
    return leaves.filter((leave) => {
      if (leave.status === 'REJECTED' || leave.status === 'CANCELLED') return false;

      const start = parseISO(leave.startDate);
      const end = parseISO(leave.endDate);

      return isWithinInterval(day, { start, end });
    });
  };

  return (
    <Card className="border-0 shadow-sm overflow-hidden">
      <CardHeader className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-7">
        <CardTitle className="text-xl font-bold">Leaves Overview</CardTitle>
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium mr-4">{format(currentMonth, 'MMMM yyyy')}</p>
          <Button variant="outline" size="icon" onClick={prevMonth} className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth} className="h-8 w-8">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-7 border-y border-gray-100 border bg-gray-50/50">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div
              key={day}
              className="py-2 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider border-r border-gray-100 last:border-r-0"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 bg-white border-l border-gray-100">
          {calendarDays.map((day, idx) => {
            const dayLeaves = getLeavesForDay(day);
            const isCurrentMonth = isSameMonth(day, monthStart);
            const isToday = isSameDay(day, new Date());

            return (
              <div
                key={day.toString()}
                className={cn(
                  'min-h-[120px] p-2 border-r border-b border-gray-100 transition-colors',
                  !isCurrentMonth && 'bg-gray-50/20 text-gray-300 font-light',
                )}
              >
                <div className="flex justify-between items-center mb-1">
                  <span
                    className={cn(
                      'text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full transition-all',
                      isToday ? 'bg-primary text-white shadow-sm' : 'text-gray-500',
                    )}
                  >
                    {format(day, 'd')}
                  </span>
                </div>
                <div className="space-y-1">
                  {dayLeaves.map((leave) => (
                    <button
                      key={leave.id}
                      onClick={() => setSelectedLeave(leave)}
                      className={cn(
                        'w-full text-left px-2 py-1 text-[10px] rounded-md truncate transition-all active:scale-95 shadow-sm border',
                        leave.status === 'APPROVED'
                          ? 'bg-green-50 text-green-700 border-green-100 border hover:bg-green-100/80'
                          : 'bg-yellow-50 text-yellow-700 border-yellow-100 border hover:bg-yellow-100/80',
                      )}
                      title={leave.employeeName}
                    >
                      <span className="font-semibold">{leave.employeeName}</span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>

      <Dialog open={!!selectedLeave} onOpenChange={() => setSelectedLeave(null)}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              Leave Details
            </DialogTitle>
            <DialogDescription>
              Details for {selectedLeave?.employeeName}'s leave request.
            </DialogDescription>
          </DialogHeader>
          {selectedLeave && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-6 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                <div className="space-y-1.5">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Employee
                  </p>
                  <p className="text-sm font-bold text-gray-900">{selectedLeave.employeeName}</p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Leave Type
                  </p>
                  <Badge
                    variant="outline"
                    className="bg-blue-50/50 text-blue-600 border-blue-100 font-semibold px-2"
                  >
                    {selectedLeave.leaveType}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 p-1">
                <div className="space-y-1.5">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Period
                  </p>
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold text-gray-800">
                      {format(parseISO(selectedLeave.startDate), 'MMM d')} -{' '}
                      {format(parseISO(selectedLeave.endDate), 'MMM d, yyyy')}
                    </p>
                    <p className="text-xs text-gray-400 font-medium">
                      {selectedLeave.totalDays} business days
                    </p>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Current Status
                  </p>
                  <Badge
                    className={cn(
                      'font-bold py-1 px-3 rounded-full shadow-sm',
                      selectedLeave.status === 'APPROVED'
                        ? 'bg-green-100 text-green-700 border-green-200 border'
                        : 'bg-yellow-100 text-yellow-700 border-yellow-200 border',
                    )}
                  >
                    {selectedLeave.status}
                  </Badge>
                </div>
              </div>

              {selectedLeave.reason && (
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Reason provided
                  </p>
                  <div className="text-sm text-gray-600 bg-gray-50/50 p-4 rounded-xl border border-gray-100 italic">
                    "{selectedLeave.reason}"
                  </div>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <Button onClick={() => setSelectedLeave(null)} className="rounded-xl px-6">
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
