import EmployeeManagement from '@/components/employees/EmployeeManagement';
import TeamForum from '@/components/forum/TeamForum';
import DashboardLayout, { NavItem } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLogout } from '@/hook/AuthHook/AuthHook';
import { useEmployees } from '@/hook/EmployeeHook/EmployeeHook';
import { useRoleGuard } from '@/hook/UserHook/UserHook';
import {
  Bell,
  Briefcase,
  Calendar,
  CheckCircle,
  MessageSquare,
  Plus,
  Users,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';

type EGender = 'MALE' | 'FEMALE' | 'OTHER';
type EMaritalStatus = 'SINGLE' | 'MARRIED' | 'DIVORCED' | 'WIDOWED';
type EEmployeeType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERN';

type Employee = {
  id: string;
  employeeCode: string;
  fullName: string;
  email: string;
  personalEmail: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: EGender;
  nationality: string;
  maritalStatus: EMaritalStatus;
  nationalId: string;
  nationalIdIssuedDate: string;
  nationalIdIssuedPlace: string;
  permanentAddress: string;
  currentAddress: string;
  department: string;
  position: string;
  jobTitle: string;
  employmentType: EEmployeeType;
  hireDate: string;
  probationEndDate: string;
  workLocation: string;
  salary: number;
  bonus: number;
  taxCode: string;
  socialInsuranceNumber: string;
  healthInsuranceNumber: string;
  numberOfDependents: number;
};

type LeaveRequest = {
  id: string;
  employeeName: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'approved' | 'rejected';
  reason: string;
  days: number;
};

type CompanyEvent = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
};

export default function HRDashboard() {
  const { logout } = useLogout();
  const { user, refetch } = useRoleGuard(['HR']);
  const [currentTab, setCurrentTab] = useState<
    'overview' | 'leave' | 'employees' | 'events' | 'forum'
  >('overview');

  const handleTabSwitch = (tab: 'overview' | 'leave' | 'employees' | 'events' | 'forum') => {
    setCurrentTab(tab);
    refetch();
  };

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([
    {
      id: '1',
      employeeName: 'John Doe',
      leaveType: 'Vacation',
      startDate: '2024-02-10',
      endDate: '2024-02-15',
      status: 'pending',
      reason: 'Personal trip',
      days: 6,
    },
    {
      id: '2',
      employeeName: 'Jane Smith',
      leaveType: 'Sick Leave',
      startDate: '2024-02-08',
      endDate: '2024-02-09',
      status: 'approved',
      reason: 'Sick',
      days: 2,
    },
    {
      id: '3',
      employeeName: 'Mike Johnson',
      leaveType: 'Casual Leave',
      startDate: '2024-02-12',
      endDate: '2024-02-12',
      status: 'pending',
      reason: 'Personal errand',
      days: 1,
    },
  ]);

  const { data: employeeResponse } = useEmployees({}, { size: 1 });
  const totalEmployeeCount = employeeResponse?.data?.length || 0;

  const [employees, setEmployees] = useState<Employee[]>([]);

  const [events, setEvents] = useState<CompanyEvent[]>([
    {
      id: '1',
      title: 'Team Building Event',
      description: 'Team building activity at the office',
      date: '2024-02-20',
      time: '14:00',
      location: 'Main Office',
      attendees: 15,
    },
    {
      id: '2',
      title: 'Company Meeting',
      description: 'Quarterly company meeting',
      date: '2024-02-25',
      time: '10:00',
      location: 'Conference Room A',
      attendees: 50,
    },
  ]);

  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    attendees: '',
  });

  const [selectedEmployeeForUpdate, setSelectedEmployeeForUpdate] = useState<string | null>(null);
  const [selectedEmployeeForDetail, setSelectedEmployeeForDetail] = useState<string | null>(null);
  const [employeeViewMode, setEmployeeViewMode] = useState<'list' | 'detail' | 'update'>('list');
  const [updateEmployeeData, setUpdateEmployeeData] = useState<Partial<Employee>>({});

  const handleLogout = async () => {
    await logout();
  };

  const handleApproveLeave = (id: string) => {
    setLeaveRequests(
      leaveRequests.map((leave) => (leave.id === id ? { ...leave, status: 'approved' } : leave)),
    );
  };

  const handleRejectLeave = (id: string) => {
    setLeaveRequests(
      leaveRequests.map((leave) => (leave.id === id ? { ...leave, status: 'rejected' } : leave)),
    );
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newEvent.title || !newEvent.date || !newEvent.time) {
      alert('Please fill in required fields');
      return;
    }

    const event: CompanyEvent = {
      id: String(events.length + 1),
      title: newEvent.title,
      description: newEvent.description,
      date: newEvent.date,
      time: newEvent.time,
      location: newEvent.location,
      attendees: parseInt(newEvent.attendees) || 0,
    };

    setEvents([...events, event]);
    setNewEvent({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      attendees: '',
    });
    setShowAddEvent(false);
    alert('Event created successfully!');
  };

  const handleDeleteEvent = (id: string) => {
    if (confirm('Delete this event?')) {
      setEvents(events.filter((e) => e.id !== id));
    }
  };

  const handleUpdateEmployeeInfo = (id: string) => {
    setEmployees(
      employees.map((emp) =>
        emp.id === id
          ? {
              ...emp,
              ...updateEmployeeData,
            }
          : emp,
      ),
    );

    setSelectedEmployeeForUpdate(null);
    setEmployeeViewMode('list');
    setUpdateEmployeeData({});
    alert('Employee information updated!');
  };

  if (!user) {
    return null;
  }

  const pendingLeaves = leaveRequests.filter((l) => l.status === 'pending');
  const approvedLeaves = leaveRequests.filter((l) => l.status === 'approved');

  const navItems: NavItem[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: Briefcase,
      onClick: () => handleTabSwitch('overview'),
      isActive: currentTab === 'overview',
    },
    {
      id: 'leave',
      label: 'Leave Requests',
      icon: Calendar,
      onClick: () => handleTabSwitch('leave'),
      isActive: currentTab === 'leave',
      hasBadge: pendingLeaves.length > 0,
    },
    {
      id: 'employees',
      label: 'Employees',
      icon: Users,
      onClick: () => handleTabSwitch('employees'),
      isActive: currentTab === 'employees',
    },
    {
      id: 'events',
      label: 'Events',
      icon: Bell,
      onClick: () => handleTabSwitch('events'),
      isActive: currentTab === 'events',
    },
    {
      id: 'forum',
      label: 'Team Feed',
      icon: MessageSquare,
      onClick: () => handleTabSwitch('forum'),
      isActive: currentTab === 'forum',
    },
  ];

  return (
    <DashboardLayout
      user={user}
      navItems={navItems}
      onLogout={handleLogout}
      title="HR Dashboard"
      avatarGradient="from-pink-400 to-pink-600"
    >
      {/* Overview Tab */}
      {currentTab === 'overview' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">HR Overview</h2>
            <p className="text-gray-600">Manage leave requests, employees, and company events</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-primary">{totalEmployeeCount}</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Pending Leave Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-yellow-600">{pendingLeaves.length}</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Approved Leaves</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-600">{approvedLeaves.length}</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-blue-600">{events.length}</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Leave Requests */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Recent Leave Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaveRequests.slice(0, 3).map((leave) => (
                  <div
                    key={leave.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{leave.employeeName}</p>
                      <p className="text-sm text-gray-500">
                        {leave.leaveType} • {leave.startDate} to {leave.endDate}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        leave.status === 'pending'
                          ? 'bg-yellow-50 text-yellow-700'
                          : leave.status === 'approved'
                            ? 'bg-green-50 text-green-700'
                            : 'bg-red-50 text-red-700'
                      }`}
                    >
                      {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Leave Requests Tab */}
      {currentTab === 'leave' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Leave Requests</h2>
            <p className="text-gray-600">Review and manage employee leave requests</p>
          </div>

          {/* Pending Leaves */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Pending Requests</h3>
            <div className="space-y-3">
              {pendingLeaves.length === 0 ? (
                <Card className="border-0 shadow-sm">
                  <CardContent className="py-8 text-center text-gray-500">
                    No pending leave requests
                  </CardContent>
                </Card>
              ) : (
                pendingLeaves.map((leave) => (
                  <Card key={leave.id} className="border-0 shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-lg font-semibold text-gray-900">
                            {leave.employeeName}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">{leave.leaveType}</p>
                        </div>
                        <span className="px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-sm font-medium">
                          {leave.days} days
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        <strong>Duration:</strong> {leave.startDate} to {leave.endDate}
                      </p>
                      <p className="text-sm text-gray-600 mb-4">
                        <strong>Reason:</strong> {leave.reason}
                      </p>
                      <div className="flex gap-3">
                        <Button
                          onClick={() => handleApproveLeave(leave.id)}
                          className="gap-2 bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle size={18} />
                          Approve
                        </Button>
                        <Button
                          onClick={() => handleRejectLeave(leave.id)}
                          variant="outline"
                          className="gap-2"
                        >
                          <XCircle size={18} />
                          Reject
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Approved & Rejected */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Processed Requests</h3>
            <div className="space-y-3">
              {leaveRequests
                .filter((l) => l.status !== 'pending')
                .map((leave) => (
                  <div
                    key={leave.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{leave.employeeName}</p>
                      <p className="text-sm text-gray-500">
                        {leave.leaveType} • {leave.startDate} to {leave.endDate}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        leave.status === 'approved'
                          ? 'bg-green-50 text-green-700'
                          : 'bg-red-50 text-red-700'
                      }`}
                    >
                      {leave.status === 'approved' ? 'Approved' : 'Rejected'}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Employees Tab */}
      {currentTab === 'employees' && <EmployeeManagement />}

      {/* Events Tab */}
      {currentTab === 'events' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Company Events</h2>
              <p className="text-gray-600">Create and manage upcoming company activities</p>
            </div>
            <Button onClick={() => setShowAddEvent(!showAddEvent)} className="gap-2">
              <Plus size={18} />
              New Event
            </Button>
          </div>

          {showAddEvent && (
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Create New Event</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddEvent} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="eventTitle">Event Title</Label>
                    <Input
                      id="eventTitle"
                      placeholder="Title"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="eventLocation">Location</Label>
                    <Input
                      id="eventLocation"
                      placeholder="Location"
                      value={newEvent.location}
                      onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="eventDate">Date</Label>
                    <Input
                      id="eventDate"
                      type="date"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="eventTime">Time</Label>
                    <Input
                      id="eventTime"
                      type="time"
                      value={newEvent.time}
                      onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="eventDesc">Description</Label>
                    <Input
                      id="eventDesc"
                      placeholder="Description"
                      value={newEvent.description}
                      onChange={(e) =>
                        setNewEvent({
                          ...newEvent,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="md:col-span-2 flex gap-3">
                    <Button type="submit" className="flex-1">
                      Create Event
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setShowAddEvent(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((event) => (
              <Card key={event.id} className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>{event.title}</CardTitle>
                  <CardDescription>
                    {event.date} at {event.time}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">{event.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">{event.location}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteEvent(event.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
      {/* Forum Tab */}
      {currentTab === 'forum' && <TeamForum user={user} />}
    </DashboardLayout>
  );
}
