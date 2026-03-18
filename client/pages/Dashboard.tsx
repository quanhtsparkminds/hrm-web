import DashboardLayout, { NavItem } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLogout } from '@/hook/AuthHook/AuthHook';
import { useUser } from '@/hook/UserHook/UserHook';
import { useAppDispatch, useAppSelector } from '@/store';
import { selectAccessToken, selectIsSignedIn } from '@/store/slices/AuthSlice';
import {
  AlertCircle,
  Bell,
  Briefcase,
  Calendar,
  CheckCircle,
  ChevronRight,
  Clock,
  MessageSquare,
  User,
} from 'lucide-react';
import TeamForum from '@/components/forum/TeamForum';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SummaryApi } from '@/services/SummaryApi/SummaryApi';
import { DirectorSummaryResponse, HRSummaryResponse, MemberSummaryResponse } from '@shared/api';

type LeaveRecord = {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'approved' | 'rejected';
  days: number;
};

type Notification = {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success';
  timestamp: string;
};

export default function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isSignedIn = useAppSelector(selectIsSignedIn);
  const accessToken = useAppSelector(selectAccessToken);

  const [currentTab, setCurrentTab] = useState<
    'overview' | 'leave' | 'notifications' | 'profile' | 'forum'
  >('overview');

  const [leaves, setLeaves] = useState<LeaveRecord[]>([
    {
      id: '1',
      type: 'Vacation',
      startDate: '2024-02-10',
      endDate: '2024-02-15',
      status: 'approved',
      days: 6,
    },
    {
      id: '2',
      type: 'Sick Leave',
      startDate: '2024-01-25',
      endDate: '2024-01-26',
      status: 'approved',
      days: 2,
    },
  ]);

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Leave Approved',
      message: 'Your vacation leave from Feb 10-15 has been approved.',
      type: 'success',
      timestamp: '2 hours ago',
    },
    {
      id: '2',
      title: 'Company Event',
      message: 'Team building event on Feb 20 at 3 PM.',
      type: 'info',
      timestamp: '1 day ago',
    },
    {
      id: '3',
      title: 'Policy Update',
      message: 'New remote work policy effective from March 1.',
      type: 'warning',
      timestamp: '3 days ago',
    },
  ]);

  const [newLeave, setNewLeave] = useState({
    type: 'vacation',
    startDate: '',
    endDate: '',
    reason: '',
  });

  const leaveBalance = {
    vacation: 10,
    sick: 5,
    casual: 3,
  };

  const usedLeave = {
    vacation: 6,
    sick: 2,
    casual: 0,
  };

  const { user } = useUser();
  const [directorSummary, setDirectorSummary] = useState<DirectorSummaryResponse | null>(null);
  const [hrSummary, setHrSummary] = useState<HRSummaryResponse | null>(null);
  const [memberSummary, setMemberSummary] = useState<MemberSummaryResponse | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      if (!user) return;
      try {
        if (user.role === 'ADMIN') {
          const res = await SummaryApi.getDirectorSummary();
          if (res.success) setDirectorSummary(res.data);
        } else if (user.role === 'HR' || user.role === 'TEAM_LEADER') {
          const res = await SummaryApi.getHRSummary();
          if (res.success) setHrSummary(res.data);
        } else if (user.role === 'TEAM_MEMBER' || !user.role) {
          const res = await SummaryApi.getMemberSummary();
          if (res.success) setMemberSummary(res.data);
        }
      } catch (error) {
        console.error('Error fetching summary:', error);
      }
    };
    fetchSummary();
  }, [user]);

  useEffect(() => {
    if (!isSignedIn || !accessToken) {
      navigate('/login');
    }
  }, [isSignedIn, accessToken, navigate]);

  const { logout } = useLogout();
  const handleLogout = async () => {
    await logout();
  };

  const handleBookLeave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newLeave.startDate || !newLeave.endDate) {
      alert('Please select both start and end dates');
      return;
    }

    const start = new Date(newLeave.startDate);
    const end = new Date(newLeave.endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    const leaveRecord: LeaveRecord = {
      id: String(leaves.length + 1),
      type: newLeave.type.charAt(0).toUpperCase() + newLeave.type.slice(1),
      startDate: newLeave.startDate,
      endDate: newLeave.endDate,
      status: 'pending',
      days,
    };

    setLeaves([leaveRecord, ...leaves]);
    setNewLeave({ type: 'vacation', startDate: '', endDate: '', reason: '' });
    alert('Leave request submitted successfully!');
  };

  if (!user) {
    return null;
  }

  const navItems: NavItem[] = [
    {
      id: 'overview',
      label: 'Dashboard',
      icon: Briefcase,
      onClick: () => setCurrentTab('overview'),
      isActive: currentTab === 'overview',
    },
    {
      id: 'leave',
      label: 'Book Leave',
      icon: Calendar,
      onClick: () => setCurrentTab('leave'),
      isActive: currentTab === 'leave',
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      onClick: () => setCurrentTab('notifications'),
      isActive: currentTab === 'notifications',
      hasBadge: true,
    },
    {
      id: 'forum',
      label: 'Team Feed',
      icon: MessageSquare,
      onClick: () => setCurrentTab('forum'),
      isActive: currentTab === 'forum',
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      onClick: () => setCurrentTab('profile'),
      isActive: currentTab === 'profile',
    },
  ];

  return (
    <DashboardLayout
      user={user}
      navItems={navItems}
      onLogout={handleLogout}
      avatarGradient="from-blue-400 to-indigo-600"
    >
      {/* Overview Tab */}
      {currentTab === 'overview' && (
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
                        <p className="font-medium text-gray-900">{leave.type}</p>
                        <p className="text-sm text-gray-500">
                          {leave.startDate} to {leave.endDate} ({leave.days} days)
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {leave.status === 'approved' && (
                        <span className="flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                          <CheckCircle size={14} /> Approved
                        </span>
                      )}
                      {leave.status === 'pending' && (
                        <span className="flex items-center gap-1 px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-sm font-medium">
                          <Clock size={14} /> Pending
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Leave Tab */}
      {currentTab === 'leave' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Book Leave</h2>
            <p className="text-gray-600">Request time off from work</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Leave Request Form */}
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
                      <option value="vacation">Vacation</option>
                      <option value="sick">Sick Leave</option>
                      <option value="casual">Casual Leave</option>
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

            {/* Leave Balance Summary */}
            <Card className="border-0 shadow-sm h-fit">
              <CardHeader>
                <CardTitle className="text-base">Balance Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
                        <p className="font-medium text-gray-900">{leave.type}</p>
                        <p className="text-sm text-gray-500">
                          {leave.startDate} to {leave.endDate} ({leave.days} days)
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {leave.status === 'approved' && (
                        <span className="flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                          <CheckCircle size={14} /> Approved
                        </span>
                      )}
                      {leave.status === 'pending' && (
                        <span className="flex items-center gap-1 px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-sm font-medium">
                          <Clock size={14} /> Pending
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Notifications Tab */}
      {currentTab === 'notifications' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h2>
            <p className="text-gray-600">Company updates and announcements</p>
          </div>

          <div className="space-y-3">
            {notifications.map((notif) => (
              <Card key={notif.id} className="border-0 shadow-sm hover:shadow-md transition">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      {notif.type === 'success' && (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      )}
                      {notif.type === 'warning' && (
                        <AlertCircle className="w-6 h-6 text-amber-500" />
                      )}
                      {notif.type === 'info' && <Bell className="w-6 h-6 text-blue-500" />}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{notif.title}</h3>
                      <p className="text-gray-600 text-sm mt-1">{notif.message}</p>
                      <p className="text-gray-400 text-xs mt-2">{notif.timestamp}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300 flex-shrink-0" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Profile Tab */}
      {currentTab === 'profile' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h2>
            <p className="text-gray-600">Manage your account information</p>
          </div>

          <Card className="border-0 shadow-sm max-w-2xl">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="text-sm text-gray-600">Profile Picture</p>
                  <Button variant="outline" className="mt-2 text-sm">
                    Change Picture
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName" className="text-gray-700 font-medium">
                    Full Name
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={user?.name || ''}
                    readOnly
                    className="mt-2 h-10 bg-gray-50"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-gray-700 font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={user?.email || ''}
                    readOnly
                    className="mt-2 h-10 bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="department" className="text-gray-700 font-medium">
                  Department
                </Label>
                <Input
                  id="department"
                  type="text"
                  value={user?.department || ''}
                  readOnly
                  className="mt-2 h-10 bg-gray-50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-700 font-medium">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-gray-700 font-medium">
                  Location
                </Label>
                <Input id="location" type="text" placeholder="City, Country" className="h-10" />
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Change Password</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword" className="text-gray-700 font-medium">
                      Current Password
                    </Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      placeholder="••••••••"
                      className="mt-2 h-10"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newPassword" className="text-gray-700 font-medium">
                      New Password
                    </Label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="••••••••"
                      className="mt-2 h-10"
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      className="mt-2 h-10"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <Button className="flex-1">Save Changes</Button>
                <Button variant="outline" className="flex-1">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Forum Tab */}
      {currentTab === 'forum' && <TeamForum user={user} />}
    </DashboardLayout>
  );
}
