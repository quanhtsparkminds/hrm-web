import DashboardLayout, { NavItem } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLogout } from "@/hook/AuthHook/AuthHook";
import { useRoleGuard } from "@/hook/UserHook/UserHook";
import { Calendar, CheckCircle, Clock, Users, XCircle } from "lucide-react";
import { useState } from "react";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "present" | "on_leave" | "absent";
  leaveType?: string;
  returnDate?: string;
}

interface LeaveRequest {
  id: string;
  employeeName: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  status: "pending" | "approved" | "rejected";
  reason: string;
  days: number;
}

export default function TeamLeaderDashboard() {
  const { logout } = useLogout();
  const { user, refetch } = useRoleGuard(["TEAM_LEADER"]);
  const [currentTab, setCurrentTab] = useState<"overview" | "leave" | "team">(
    "overview",
  );

  const handleTabSwitch = (tab: "overview" | "leave" | "team") => {
    setCurrentTab(tab);
    refetch();
  };

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: "1",
      name: "John Doe",
      email: "john@company.com",
      role: "Software Engineer",
      status: "present",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@company.com",
      role: "Frontend Developer",
      status: "on_leave",
      leaveType: "Vacation",
      returnDate: "2024-02-15",
    },
    {
      id: "3",
      name: "Mike Johnson",
      email: "mike@company.com",
      role: "Backend Developer",
      status: "present",
    },
    {
      id: "4",
      name: "Sarah Williams",
      email: "sarah@company.com",
      role: "QA Engineer",
      status: "absent",
    },
  ]);

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([
    {
      id: "1",
      employeeName: "John Doe",
      leaveType: "Sick Leave",
      startDate: "2024-02-08",
      endDate: "2024-02-09",
      status: "pending",
      reason: "Sick",
      days: 2,
    },
    {
      id: "2",
      employeeName: "Mike Johnson",
      leaveType: "Casual Leave",
      startDate: "2024-02-12",
      endDate: "2024-02-12",
      status: "pending",
      reason: "Personal errand",
      days: 1,
    },
    {
      id: "3",
      employeeName: "Sarah Williams",
      leaveType: "Vacation",
      startDate: "2024-02-20",
      endDate: "2024-02-25",
      status: "approved",
      reason: "Annual vacation",
      days: 6,
    },
  ]);

  const handleLogout = async () => {
    await logout();
  };

  const handleApproveLeave = (id: string) => {
    setLeaveRequests(
      leaveRequests.map((leave) =>
        leave.id === id ? { ...leave, status: "approved" } : leave,
      ),
    );
  };

  const handleRejectLeave = (id: string) => {
    setLeaveRequests(
      leaveRequests.map((leave) =>
        leave.id === id ? { ...leave, status: "rejected" } : leave,
      ),
    );
  };

  if (!user) {
    return null;
  }

  const totalTeamMembers = teamMembers.length;
  const presentMembers = teamMembers.filter(
    (m) => m.status === "present",
  ).length;
  const onLeaveMembers = teamMembers.filter(
    (m) => m.status === "on_leave",
  ).length;
  const absentMembers = teamMembers.filter((m) => m.status === "absent").length;
  const pendingLeavesNum = leaveRequests.filter(
    (l) => l.status === "pending",
  ).length;

  const navItems: NavItem[] = [
    {
      id: "overview",
      label: "Overview",
      icon: Users,
      onClick: () => handleTabSwitch("overview"),
      isActive: currentTab === "overview",
    },
    {
      id: "leave",
      label: "Leave Requests",
      icon: Calendar,
      onClick: () => handleTabSwitch("leave"),
      isActive: currentTab === "leave",
      hasBadge: pendingLeavesNum > 0,
    },
    {
      id: "team",
      label: "Team Members",
      icon: Users,
      onClick: () => handleTabSwitch("team"),
      isActive: currentTab === "team",
    },
  ];

  return (
    <DashboardLayout
      user={user}
      navItems={navItems}
      onLogout={handleLogout}
      title="Team Leader Dashboard"
      avatarGradient="from-green-400 to-green-600"
    >
      {/* Overview Tab */}
      {currentTab === "overview" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Team Overview
            </h2>
            <p className="text-gray-600">
              Monitor your team's status and approve leave requests
            </p>
          </div>

          {/* Team Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">
                  Team Members
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-primary">
                    {totalTeamMembers}
                  </span>
                  <Users className="w-8 h-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">
                  Present Today
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-green-600">
                    {presentMembers}
                  </span>
                  <CheckCircle className="w-8 h-8 text-green-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">On Leave</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-yellow-600">
                    {onLeaveMembers}
                  </span>
                  <Calendar className="w-8 h-8 text-yellow-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Absent</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-red-600">
                    {absentMembers}
                  </span>
                  <Clock className="w-8 h-8 text-red-200" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Team Overview Table */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Team Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{member.name}</p>
                      <p className="text-sm text-gray-500">{member.role}</p>
                    </div>
                    <div className="text-right mr-4">
                      {member.status === "on_leave" && (
                        <p className="text-sm text-gray-600">
                          <strong>{member.leaveType}</strong> • Back on{" "}
                          {member.returnDate}
                        </p>
                      )}
                    </div>
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-medium ${
                        member.status === "present"
                          ? "bg-green-50 text-green-700"
                          : member.status === "on_leave"
                            ? "bg-yellow-50 text-yellow-700"
                            : "bg-red-50 text-red-700"
                      }`}
                    >
                      {member.status === "present"
                        ? "Present"
                        : member.status === "on_leave"
                          ? "On Leave"
                          : "Absent"}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pending Requests */}
          {pendingLeavesNum > 0 && (
            <Card className="border-0 shadow-sm border-l-4 border-l-yellow-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-yellow-600" />
                  Pending Leave Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  You have {pendingLeavesNum} leave request(s) waiting for
                  approval.
                </p>
                <Button onClick={() => setCurrentTab("leave")}>
                  Review Requests
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Leave Requests Tab */}
      {currentTab === "leave" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Leave Requests
            </h2>
            <p className="text-gray-600">
              Approve or reject team member leave requests
            </p>
          </div>

          {/* Pending Leaves */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Pending Requests
            </h3>
            <div className="space-y-3">
              {leaveRequests.filter((l) => l.status === "pending").length ===
              0 ? (
                <Card className="border-0 shadow-sm">
                  <CardContent className="py-8 text-center text-gray-500">
                    No pending leave requests
                  </CardContent>
                </Card>
              ) : (
                leaveRequests
                  .filter((l) => l.status === "pending")
                  .map((leave) => (
                    <Card key={leave.id} className="border-0 shadow-sm">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <p className="text-lg font-semibold text-gray-900">
                              {leave.employeeName}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {leave.leaveType}
                            </p>
                          </div>
                          <span className="px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-sm font-medium">
                            {leave.days} days
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          <strong>Duration:</strong> {leave.startDate} to{" "}
                          {leave.endDate}
                        </p>
                        <p className="text-sm text-gray-600 mb-4">
                          <strong>Reason:</strong> {leave.reason}
                        </p>
                        <div className="flex gap-3">
                          <Button
                            onClick={() => handleApproveLeave(leave.id)}
                            className="gap-2 bg-green-600 hover:bg-green-700 flex-1"
                          >
                            <CheckCircle size={18} />
                            Approve
                          </Button>
                          <Button
                            onClick={() => handleRejectLeave(leave.id)}
                            variant="outline"
                            className="gap-2 flex-1"
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

          {/* Processed Requests */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Processed Requests
            </h3>
            <div className="space-y-3">
              {leaveRequests
                .filter((l) => l.status !== "pending")
                .map((leave) => (
                  <div
                    key={leave.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {leave.employeeName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {leave.leaveType} • {leave.startDate} to {leave.endDate}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        leave.status === "approved"
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {leave.status === "approved" ? "Approved" : "Rejected"}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Team Members Tab */}
      {currentTab === "team" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Team Members
            </h2>
            <p className="text-gray-600">Detailed view of your team</p>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-center">
                  Total
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-3xl font-bold text-primary">
                  {totalTeamMembers}
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-center">
                  Present
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-3xl font-bold text-green-600">
                  {presentMembers}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {((presentMembers / totalTeamMembers) * 100).toFixed(0)}%
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-center">
                  On Leave
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-3xl font-bold text-yellow-600">
                  {onLeaveMembers}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {((onLeaveMembers / totalTeamMembers) * 100).toFixed(0)}%
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-center">
                  Absent
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-3xl font-bold text-red-600">
                  {absentMembers}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {((absentMembers / totalTeamMembers) * 100).toFixed(0)}%
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Team Member List */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>All Team Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {member.name}
                          </p>
                          <p className="text-sm text-gray-500">{member.role}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right mr-4">
                      {member.status === "on_leave" && (
                        <p className="text-xs text-gray-600 mb-1">
                          {member.leaveType}
                        </p>
                      )}
                      <p className="text-xs text-gray-500">{member.email}</p>
                    </div>
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                        member.status === "present"
                          ? "bg-green-50 text-green-700"
                          : member.status === "on_leave"
                            ? "bg-yellow-50 text-yellow-700"
                            : "bg-red-50 text-red-700"
                      }`}
                    >
                      {member.status === "present"
                        ? "Present"
                        : member.status === "on_leave"
                          ? "On Leave"
                          : "Absent"}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
}
