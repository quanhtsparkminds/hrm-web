import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { LeaveRecord } from './types';

type LeaveTabProps = {
  role?: string;
  handleBookLeave: (e: React.FormEvent) => void;
  newLeave: { type: string; startDate: string; endDate: string; reason: string };
  setNewLeave: React.Dispatch<
    React.SetStateAction<{ type: string; startDate: string; endDate: string; reason: string }>
  >;
  leaveBalance: { vacation: number; sick: number; casual: number };
  usedLeave: { vacation: number; sick: number; casual: number };
  leaves: LeaveRecord[];
};

export default function LeaveTab({
  role,
  handleBookLeave,
  newLeave,
  setNewLeave,
  leaveBalance,
  usedLeave,
  leaves,
}: LeaveTabProps) {
  const isAdmin = role === 'ADMIN';
  const isHR = role === 'HR' || role === 'TEAM_LEADER';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {isAdmin ? 'Leave Management' : 'Book Leave'}
        </h2>
        <p className="text-gray-600">
          {isAdmin ? 'View and manage employee leave requests' : 'Request time off from work'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leave Request Form - Hidden for Admin */}
        {!isAdmin && (
          <Card className="lg:col-span-2 border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Request Leave</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleBookLeave} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="leaveType" className="text-gray-700 font-medium">
                    Leave Type
                  </Label>
                  <select
                    id="leaveType"
                    value={newLeave.type}
                    onChange={(e) => setNewLeave({ ...newLeave, type: e.target.value })}
                    className="w-full h-10 px-3 border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="ANNUAL">Annual Leave</option>
                    <option value="SICK">Sick Leave</option>
                    <option value="CASUAL">Casual Leave</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate" className="text-gray-700 font-medium">
                      Start Date
                    </Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={newLeave.startDate}
                      onChange={(e) =>
                        setNewLeave({
                          ...newLeave,
                          startDate: e.target.value,
                        })
                      }
                      className="h-10 border-gray-200 border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate" className="text-gray-700 font-medium">
                      End Date
                    </Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={newLeave.endDate}
                      onChange={(e) => setNewLeave({ ...newLeave, endDate: e.target.value })}
                      className="h-10 border-gray-200 border"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason" className="text-gray-700 font-medium">
                    Reason (Optional)
                  </Label>
                  <textarea
                    id="reason"
                    placeholder="Provide a reason for your leave..."
                    value={newLeave.reason}
                    onChange={(e) => setNewLeave({ ...newLeave, reason: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={4}
                  />
                </div>

                <Button type="submit" className="w-full h-10">
                  Submit Leave Request
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Leave Balance Summary */}
        <Card className={cn("border-0 shadow-sm h-fit", isAdmin && "lg:col-span-3")}>
          <CardHeader>
            <CardTitle className="text-base">
              {isAdmin ? 'System Summary' : 'Balance Summary'}
            </CardTitle>
          </CardHeader>
          <CardContent className={cn("space-y-4", isAdmin && "grid grid-cols-1 md:grid-cols-3 gap-4 space-y-0")}>
            <div>
              <p className="text-sm text-gray-600 mb-2">Vacation Days</p>
              <p className="text-2xl font-bold text-primary">
                {leaveBalance.vacation - usedLeave.vacation}/{leaveBalance.vacation}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Sick Days</p>
              <p className="text-2xl font-bold text-green-600">
                {leaveBalance.sick - usedLeave.sick}/{leaveBalance.sick}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Casual Days</p>
              <p className="text-2xl font-bold text-amber-600">
                {leaveBalance.casual - usedLeave.casual}/{leaveBalance.casual}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* All Leaves List */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>All Leave Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {leaves.map((leave) => (
              <div
                key={leave.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900">{leave.leaveType}</p>
                      {(isAdmin || isHR) && (
                        <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                          {leave.employeeName}
                        </span>
                      )}
                    </div>
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
