import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  LogOut,
  Briefcase,
  Calendar,
  Users,
  Bell,
  Menu,
  X,
  Plus,
  CheckCircle,
  Clock,
  XCircle,
  Edit,
  Trash2,
} from "lucide-react";

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

interface CompanyEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
}

export default function HRDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentTab, setCurrentTab] = useState<"overview" | "leave" | "employees" | "events">(
    "overview"
  );

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([
    {
      id: "1",
      employeeName: "John Doe",
      leaveType: "Vacation",
      startDate: "2024-02-10",
      endDate: "2024-02-15",
      status: "pending",
      reason: "Personal trip",
      days: 6,
    },
    {
      id: "2",
      employeeName: "Jane Smith",
      leaveType: "Sick Leave",
      startDate: "2024-02-08",
      endDate: "2024-02-09",
      status: "approved",
      reason: "Sick",
      days: 2,
    },
    {
      id: "3",
      employeeName: "Mike Johnson",
      leaveType: "Casual Leave",
      startDate: "2024-02-12",
      endDate: "2024-02-12",
      status: "pending",
      reason: "Personal errand",
      days: 1,
    },
  ]);

  const [employees, setEmployees] = useState([
    {
      id: "1",
      name: "John Doe",
      email: "john@company.com",
      department: "Engineering",
      salary: 60000,
      bonus: 5000,
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@company.com",
      department: "Design",
      salary: 55000,
      bonus: 4000,
    },
    {
      id: "3",
      name: "Mike Johnson",
      email: "mike@company.com",
      department: "Engineering",
      salary: 65000,
      bonus: 6000,
    },
  ]);

  const [events, setEvents] = useState<CompanyEvent[]>([
    {
      id: "1",
      title: "Team Building Event",
      description: "Team building activity at the office",
      date: "2024-02-20",
      time: "14:00",
      location: "Main Office",
      attendees: 15,
    },
    {
      id: "2",
      title: "Company Meeting",
      description: "Quarterly company meeting",
      date: "2024-02-25",
      time: "10:00",
      location: "Conference Room A",
      attendees: 50,
    },
  ]);

  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    attendees: "",
  });

  const [selectedEmployeeForUpdate, setSelectedEmployeeForUpdate] = useState<string | null>(null);
  const [updateEmployeeData, setUpdateEmployeeData] = useState({
    salary: "",
    bonus: "",
  });

  useEffect(() => {
    const userInfo = localStorage.getItem("user");
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (!isLoggedIn || !userInfo) {
      navigate("/login");
    } else {
      const userData = JSON.parse(userInfo);
      if (userData.role !== "hr") {
        navigate("/dashboard");
      }
      setUser(userData);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  const handleApproveLeave = (id: string) => {
    setLeaveRequests(
      leaveRequests.map((leave) =>
        leave.id === id ? { ...leave, status: "approved" } : leave
      )
    );
  };

  const handleRejectLeave = (id: string) => {
    setLeaveRequests(
      leaveRequests.map((leave) =>
        leave.id === id ? { ...leave, status: "rejected" } : leave
      )
    );
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newEvent.title || !newEvent.date || !newEvent.time) {
      alert("Please fill in required fields");
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
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
      attendees: "",
    });
    setShowAddEvent(false);
    alert("Event created successfully!");
  };

  const handleDeleteEvent = (id: string) => {
    if (confirm("Delete this event?")) {
      setEvents(events.filter((e) => e.id !== id));
    }
  };

  const handleUpdateEmployeeInfo = (id: string) => {
    if (!updateEmployeeData.salary && !updateEmployeeData.bonus) {
      alert("Please enter at least one field");
      return;
    }

    setEmployees(
      employees.map((emp) =>
        emp.id === id
          ? {
              ...emp,
              salary: updateEmployeeData.salary
                ? parseInt(updateEmployeeData.salary)
                : emp.salary,
              bonus: updateEmployeeData.bonus
                ? parseInt(updateEmployeeData.bonus)
                : emp.bonus,
            }
          : emp
      )
    );

    setSelectedEmployeeForUpdate(null);
    setUpdateEmployeeData({ salary: "", bonus: "" });
    alert("Employee information updated!");
  };

  if (!user) {
    return null;
  }

  const pendingLeaves = leaveRequests.filter((l) => l.status === "pending");
  const approvedLeaves = leaveRequests.filter((l) => l.status === "approved");

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            {sidebarOpen && <span className="font-bold text-lg text-gray-900">HRM</span>}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setCurrentTab("overview")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              currentTab === "overview"
                ? "bg-primary text-white"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Briefcase size={20} />
            {sidebarOpen && <span>Overview</span>}
          </button>

          <button
            onClick={() => setCurrentTab("leave")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition relative ${
              currentTab === "leave"
                ? "bg-primary text-white"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Calendar size={20} />
            {sidebarOpen && <span>Leave Requests</span>}
            {pendingLeaves.length > 0 && (
              <span className="ml-auto w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>

          <button
            onClick={() => setCurrentTab("employees")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              currentTab === "employees"
                ? "bg-primary text-white"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Users size={20} />
            {sidebarOpen && <span>Employees</span>}
          </button>

          <button
            onClick={() => setCurrentTab("events")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              currentTab === "events"
                ? "bg-primary text-white"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Bell size={20} />
            {sidebarOpen && <span>Events</span>}
          </button>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            {sidebarOpen && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 className="text-2xl font-bold text-gray-900">HR Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0) || "H"}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-8">
          {/* Overview Tab */}
          {currentTab === "overview" && (
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
                    <p className="text-3xl font-bold text-primary">{employees.length}</p>
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
                            leave.status === "pending"
                              ? "bg-yellow-50 text-yellow-700"
                              : leave.status === "approved"
                              ? "bg-green-50 text-green-700"
                              : "bg-red-50 text-red-700"
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
          {currentTab === "leave" && (
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
                    .filter((l) => l.status !== "pending")
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

          {/* Employees Tab */}
          {currentTab === "employees" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Employee Information</h2>
                <p className="text-gray-600">View and update employee salary and bonus information</p>
              </div>

              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>All Employees</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {employees.map((emp) => (
                      <div key={emp.id}>
                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{emp.name}</p>
                            <p className="text-sm text-gray-500">
                              {emp.email} • {emp.department}
                            </p>
                          </div>
                          <div className="text-right mr-4">
                            <p className="text-sm text-gray-600">
                              Salary: <strong>${emp.salary.toLocaleString()}</strong>
                            </p>
                            <p className="text-sm text-gray-600">
                              Bonus: <strong>${emp.bonus.toLocaleString()}</strong>
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedEmployeeForUpdate(emp.id);
                              setUpdateEmployeeData({
                                salary: emp.salary.toString(),
                                bonus: emp.bonus.toString(),
                              });
                            }}
                            className="gap-2"
                          >
                            <Edit size={16} />
                            Update
                          </Button>
                        </div>

                        {selectedEmployeeForUpdate === emp.id && (
                          <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <Label className="text-sm text-gray-700 font-medium">
                                  New Salary
                                </Label>
                                <Input
                                  type="number"
                                  placeholder={emp.salary.toString()}
                                  value={updateEmployeeData.salary}
                                  onChange={(e) =>
                                    setUpdateEmployeeData({
                                      ...updateEmployeeData,
                                      salary: e.target.value,
                                    })
                                  }
                                  className="mt-1 h-9 text-sm"
                                />
                              </div>
                              <div>
                                <Label className="text-sm text-gray-700 font-medium">
                                  New Bonus
                                </Label>
                                <Input
                                  type="number"
                                  placeholder={emp.bonus.toString()}
                                  value={updateEmployeeData.bonus}
                                  onChange={(e) =>
                                    setUpdateEmployeeData({
                                      ...updateEmployeeData,
                                      bonus: e.target.value,
                                    })
                                  }
                                  className="mt-1 h-9 text-sm"
                                />
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleUpdateEmployeeInfo(emp.id)}
                                className="flex-1"
                              >
                                Save
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedEmployeeForUpdate(null)}
                                className="flex-1"
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Events Tab */}
          {currentTab === "events" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Company Events</h2>
                  <p className="text-gray-600">Create and manage company events and announcements</p>
                </div>
                <Button onClick={() => setShowAddEvent(!showAddEvent)} className="gap-2">
                  <Plus size={18} />
                  Create Event
                </Button>
              </div>

              {/* Add Event Form */}
              {showAddEvent && (
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle>Create New Event</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleAddEvent} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="title" className="text-gray-700 font-medium">
                            Event Title
                          </Label>
                          <Input
                            id="title"
                            type="text"
                            placeholder="Event title"
                            value={newEvent.title}
                            onChange={(e) =>
                              setNewEvent({ ...newEvent, title: e.target.value })
                            }
                            className="h-10"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="date" className="text-gray-700 font-medium">
                            Date
                          </Label>
                          <Input
                            id="date"
                            type="date"
                            value={newEvent.date}
                            onChange={(e) =>
                              setNewEvent({ ...newEvent, date: e.target.value })
                            }
                            className="h-10"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="time" className="text-gray-700 font-medium">
                            Time
                          </Label>
                          <Input
                            id="time"
                            type="time"
                            value={newEvent.time}
                            onChange={(e) =>
                              setNewEvent({ ...newEvent, time: e.target.value })
                            }
                            className="h-10"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="location" className="text-gray-700 font-medium">
                            Location
                          </Label>
                          <Input
                            id="location"
                            type="text"
                            placeholder="Event location"
                            value={newEvent.location}
                            onChange={(e) =>
                              setNewEvent({ ...newEvent, location: e.target.value })
                            }
                            className="h-10"
                          />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="description" className="text-gray-700 font-medium">
                            Description
                          </Label>
                          <textarea
                            id="description"
                            placeholder="Event description"
                            value={newEvent.description}
                            onChange={(e) =>
                              setNewEvent({ ...newEvent, description: e.target.value })
                            }
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            rows={4}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="attendees" className="text-gray-700 font-medium">
                            Expected Attendees
                          </Label>
                          <Input
                            id="attendees"
                            type="number"
                            placeholder="Number of attendees"
                            value={newEvent.attendees}
                            onChange={(e) =>
                              setNewEvent({ ...newEvent, attendees: e.target.value })
                            }
                            className="h-10"
                          />
                        </div>
                      </div>

                      <div className="flex gap-3 pt-4">
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

              {/* Events List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {events.map((event) => (
                  <Card key={event.id} className="border-0 shadow-sm">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{event.title}</CardTitle>
                          <CardDescription>
                            {event.date} at {event.time}
                          </CardDescription>
                        </div>
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition"
                        >
                          <Trash2 size={18} className="text-red-600" />
                        </button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600">
                          <strong>Location:</strong> {event.location}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          <strong>Description:</strong> {event.description}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          <strong>Expected Attendees:</strong> {event.attendees}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
