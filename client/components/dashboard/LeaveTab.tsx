import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { AlertCircle, Ban, Calendar, Check, CheckCircle, Clock, RefreshCcw, X } from 'lucide-react';
import { useState } from 'react';
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
  onApproveLeave?: (id: number) => void;
  onRejectLeave?: (id: number) => void;
  onRefresh?: () => void;
};

export default function LeaveTab({
  role,
  handleBookLeave,
  newLeave,
  setNewLeave,
  leaveBalance,
  usedLeave,
  leaves,
  onApproveLeave,
  onRejectLeave,
  onRefresh,
}: LeaveTabProps) {
  const isAdmin = role === 'ADMIN';
  const isHR = role === 'HR' || role === 'LEADER';
  const [activeTab, setActiveTab] = useState('ALL');

  const filteredLeaves =
    activeTab === 'ALL' ? leaves : leaves.filter((l) => l.status === activeTab);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return (
          <Badge className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200">
            <CheckCircle className="mr-1 w-3 h-3" /> Approved
          </Badge>
        );
      case 'PENDING':
        return (
          <Badge className="bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border-yellow-200">
            <Clock className="mr-1 w-3 h-3" /> Pending
          </Badge>
        );
      case 'REJECTED':
        return (
          <Badge className="bg-red-50 text-red-700 hover:bg-red-100 border-red-200">
            <AlertCircle className="mr-1 w-3 h-3" /> Rejected
          </Badge>
        );
      case 'CANCELLED':
        return (
          <Badge className="bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200">
            <Ban className="mr-1 w-3 h-3" /> Cancelled
          </Badge>
        );
      default:
        return null;
    }
  };

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
        <Card className={cn('border-0 shadow-sm h-fit', isAdmin && 'lg:col-span-3')}>
          <CardHeader>
            <CardTitle className="text-base">
              {isAdmin ? 'System Summary' : 'Balance Summary'}
            </CardTitle>
          </CardHeader>
          <CardContent
            className={cn(
              'space-y-4',
              isAdmin && 'grid grid-cols-1 md:grid-cols-3 gap-4 space-y-0',
            )}
          >
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
      <Card className="border-0 shadow-sm overflow-hidden">
        <CardHeader className="pb-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <CardTitle>Leave Requests</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={onRefresh}
                className="h-8 w-8 text-gray-400 hover:text-primary transition-colors"
              >
                <RefreshCcw className="h-4 w-4" />
              </Button>
            </div>
            <Tabs defaultValue="ALL" className="w-full md:w-auto" onValueChange={setActiveTab}>
              <TabsList className="bg-gray-100/50 p-1">
                <TabsTrigger value="ALL" className="text-xs px-3">
                  All
                </TabsTrigger>
                <TabsTrigger value="PENDING" className="text-xs px-3">
                  Pending
                </TabsTrigger>
                <TabsTrigger value="APPROVED" className="text-xs px-3">
                  Approved
                </TabsTrigger>
                <TabsTrigger value="REJECTED" className="text-xs px-3">
                  Rejected
                </TabsTrigger>
                <TabsTrigger value="CANCELLED" className="text-xs px-3">
                  Cancelled
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {filteredLeaves.length === 0 ? (
              <div className="text-center py-12 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-3">
                  <Calendar className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="text-sm font-medium text-gray-900">No requests found</h3>
                <p className="text-xs text-gray-500 mt-1">
                  There are no {activeTab !== 'ALL' ? activeTab.toLowerCase() : ''} leave requests
                  to display.
                </p>
              </div>
            ) : (
              filteredLeaves.map((leave) => (
                <div
                  key={leave.id}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:border-primary/20 hover:shadow-md hover:shadow-primary/5 transition-all duration-200"
                >
                  <div className="flex items-start gap-4 mb-4 sm:mb-0">
                    <div className="mt-1 p-2 bg-gray-50 group-hover:bg-primary/5 rounded-lg transition-colors">
                      <Calendar className="w-5 h-5 text-gray-500 group-hover:text-primary transition-colors" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <p className="font-semibold text-gray-900">{leave.leaveType}</p>
                        {(isAdmin || isHR) && (
                          <Badge
                            variant="outline"
                            className="font-normal bg-blue-50/30 text-blue-600 border-blue-100"
                          >
                            {leave.employeeName}
                          </Badge>
                        )}
                        <span className="text-xs text-gray-400 sm:hidden">
                          • {leave.totalDays} days
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <p className="flex items-center gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                          {new Date(leave.startDate).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                          })}{' '}
                          -{' '}
                          {new Date(leave.endDate).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                        <p className="hidden sm:flex items-center gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                          {leave.totalDays} days
                        </p>
                      </div>
                      {leave.reason && (
                        <p className="text-xs text-gray-400 mt-1 line-clamp-1 italic">
                          "{leave.reason}"
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-0 pt-3 sm:pt-0">
                    <div className="flex items-center gap-2">{getStatusBadge(leave.status)}</div>

                    {(isAdmin || isHR) && leave.status === 'PENDING' && (
                      <div className="flex items-center gap-2 ml-2 pl-4 border-l border-gray-100">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onApproveLeave?.(leave.id)}
                          className="h-8 w-8 p-0 rounded-full border-green-200 border text-green-600 hover:bg-green-50 hover:text-green-700"
                          title="Approve"
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onRejectLeave?.(leave.id)}
                          className="h-8 w-8 p-0 rounded-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                          title="Reject"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
