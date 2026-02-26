import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  LogOut,
  Briefcase,
  Users,
  TrendingUp,
  BarChart3,
  Menu,
  X,
  Trash2,
  Edit,
  Plus,
  CheckCircle,
  AlertCircle,
  Clock,
} from "lucide-react";

interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  salary: number;
  bonus: number;
  status: "active" | "inactive" | "on_leave";
}

interface CompanyStats {
  totalEmployees: number;
  presentToday: number;
  onLeaveToday: number;
  totalSalaryExpense: number;
}

export default function DirectorDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentTab, setCurrentTab] = useState<"overview" | "employees" | "salary" | "reports">(
    "overview"
  );

  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: "1",
      name: "John Doe",
      email: "john@company.com",
      role: "employee",
      department: "Engineering",
      salary: 60000,
      bonus: 5000,
      status: "active",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@company.com",
      role: "team_leader",
      department: "Design",
      salary: 75000,
      bonus: 8000,
      status: "on_leave",
    },
    {
      id: "3",
      name: "Mike Johnson",
      email: "mike@company.com",
      role: "employee",
      department: "Engineering",
      salary: 65000,
      bonus: 6000,
      status: "active",
    },
    {
      id: "4",
      name: "Sarah Williams",
      email: "sarah@company.com",
      role: "hr",
      department: "HR",
      salary: 70000,
      bonus: 7000,
      status: "active",
    },
  ]);

  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    role: "employee",
    department: "",
    salary: "",
    bonus: "",
  });

  const stats: CompanyStats = {
    totalEmployees: employees.length,
    presentToday: employees.filter((e) => e.status !== "on_leave").length,
    onLeaveToday: employees.filter((e) => e.status === "on_leave").length,
    totalSalaryExpense: employees.reduce((sum, e) => sum + e.salary, 0),
  };

  useEffect(() => {
    const userInfo = localStorage.getItem("user");
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (!isLoggedIn || !userInfo) {
      navigate("/login");
    } else {
      const userData = JSON.parse(userInfo);
      if (userData.role !== "director") {
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

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newEmployee.name || !newEmployee.email || !newEmployee.department) {
      alert("Please fill in all required fields");
      return;
    }

    const employee: Employee = {
      id: String(employees.length + 1),
      name: newEmployee.name,
      email: newEmployee.email,
      role: newEmployee.role,
      department: newEmployee.department,
      salary: parseInt(newEmployee.salary) || 0,
      bonus: parseInt(newEmployee.bonus) || 0,
      status: "active",
    };

    setEmployees([...employees, employee]);
    setNewEmployee({ name: "", email: "", role: "employee", department: "", salary: "", bonus: "" });
    setShowAddEmployee(false);
    alert("Employee added successfully!");
  };

  const handleDeleteEmployee = (id: string) => {
    if (confirm("Are you sure you want to delete this employee?")) {
      setEmployees(employees.filter((e) => e.id !== id));
    }
  };

  const handleUpdateSalary = (id: string) => {
    const newSalary = prompt("Enter new salary:");
    if (newSalary && !isNaN(parseInt(newSalary))) {
      setEmployees(
        employees.map((e) => (e.id === id ? { ...e, salary: parseInt(newSalary) } : e))
      );
    }
  };

  const handleUpdateBonus = (id: string) => {
    const newBonus = prompt("Enter new bonus:");
    if (newBonus && !isNaN(parseInt(newBonus))) {
      setEmployees(employees.map((e) => (e.id === id ? { ...e, bonus: parseInt(newBonus) } : e)));
    }
  };

  if (!user) {
    return null;
  }

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
            <BarChart3 size={20} />
            {sidebarOpen && <span>Overview</span>}
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
            onClick={() => setCurrentTab("salary")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              currentTab === "salary"
                ? "bg-primary text-white"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <TrendingUp size={20} />
            {sidebarOpen && <span>Salary & Bonus</span>}
          </button>

          <button
            onClick={() => setCurrentTab("reports")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              currentTab === "reports"
                ? "bg-primary text-white"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <BarChart3 size={20} />
            {sidebarOpen && <span>Reports</span>}
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
            <h1 className="text-2xl font-bold text-gray-900">Director Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0) || "D"}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-8">
          {/* Overview Tab */}
          {currentTab === "overview" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Company Overview</h2>
                <p className="text-gray-600">Full control and management of your organization</p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-bold text-primary">
                        {stats.totalEmployees}
                      </span>
                      <Users className="w-8 h-8 text-blue-200" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Present Today</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-bold text-green-600">
                        {stats.presentToday}
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
                        {stats.onLeaveToday}
                      </span>
                      <Clock className="w-8 h-8 text-yellow-200" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Monthly Salary Cost</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-bold text-purple-600">
                        ${(stats.totalSalaryExpense / 1000).toFixed(0)}K
                      </span>
                      <TrendingUp className="w-8 h-8 text-purple-200" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Button className="flex-1" onClick={() => setCurrentTab("employees")}>
                      Add Employee
                    </Button>
                    <Button variant="outline" className="flex-1" onClick={() => setCurrentTab("salary")}>
                      Manage Salary
                    </Button>
                    <Button variant="outline" className="flex-1">
                      View Reports
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Export Data
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Employees */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Recent Employees</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {employees.slice(0, 5).map((emp) => (
                      <div
                        key={emp.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-gray-900">{emp.name}</p>
                          <p className="text-sm text-gray-500">
                            {emp.role} • {emp.department}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              emp.status === "active"
                                ? "bg-green-50 text-green-700"
                                : emp.status === "on_leave"
                                ? "bg-yellow-50 text-yellow-700"
                                : "bg-gray-50 text-gray-700"
                            }`}
                          >
                            {emp.status === "active"
                              ? "Active"
                              : emp.status === "on_leave"
                              ? "On Leave"
                              : "Inactive"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Employees Tab */}
          {currentTab === "employees" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Employee Management</h2>
                  <p className="text-gray-600">Add, edit, and manage employee records</p>
                </div>
                <Button onClick={() => setShowAddEmployee(!showAddEmployee)} className="gap-2">
                  <Plus size={18} />
                  Add Employee
                </Button>
              </div>

              {/* Add Employee Form */}
              {showAddEmployee && (
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle>Add New Employee</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleAddEmployee} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-gray-700 font-medium">
                          Full Name
                        </Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="Full Name"
                          value={newEmployee.name}
                          onChange={(e) =>
                            setNewEmployee({ ...newEmployee, name: e.target.value })
                          }
                          className="h-10"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-700 font-medium">
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="email@company.com"
                          value={newEmployee.email}
                          onChange={(e) =>
                            setNewEmployee({ ...newEmployee, email: e.target.value })
                          }
                          className="h-10"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="role" className="text-gray-700 font-medium">
                          Role
                        </Label>
                        <select
                          id="role"
                          value={newEmployee.role}
                          onChange={(e) =>
                            setNewEmployee({ ...newEmployee, role: e.target.value })
                          }
                          className="w-full h-10 px-3 border border-gray-200 rounded-lg bg-white"
                        >
                          <option value="employee">Employee</option>
                          <option value="team_leader">Team Leader</option>
                          <option value="hr">HR</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="department" className="text-gray-700 font-medium">
                          Department
                        </Label>
                        <Input
                          id="department"
                          type="text"
                          placeholder="Department"
                          value={newEmployee.department}
                          onChange={(e) =>
                            setNewEmployee({ ...newEmployee, department: e.target.value })
                          }
                          className="h-10"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="salary" className="text-gray-700 font-medium">
                          Monthly Salary
                        </Label>
                        <Input
                          id="salary"
                          type="number"
                          placeholder="50000"
                          value={newEmployee.salary}
                          onChange={(e) =>
                            setNewEmployee({ ...newEmployee, salary: e.target.value })
                          }
                          className="h-10"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bonus" className="text-gray-700 font-medium">
                          Bonus
                        </Label>
                        <Input
                          id="bonus"
                          type="number"
                          placeholder="5000"
                          value={newEmployee.bonus}
                          onChange={(e) =>
                            setNewEmployee({ ...newEmployee, bonus: e.target.value })
                          }
                          className="h-10"
                        />
                      </div>

                      <div className="md:col-span-2 flex gap-3">
                        <Button type="submit" className="flex-1">
                          Add Employee
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          className="flex-1"
                          onClick={() => setShowAddEmployee(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}

              {/* Employees Table */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>All Employees</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {employees.map((emp) => (
                      <div
                        key={emp.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{emp.name}</p>
                          <p className="text-sm text-gray-500">
                            {emp.email} • {emp.department}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-medium text-gray-900">
                            ${emp.salary.toLocaleString()}
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              emp.status === "active"
                                ? "bg-green-50 text-green-700"
                                : "bg-yellow-50 text-yellow-700"
                            }`}
                          >
                            {emp.status === "active" ? "Active" : "On Leave"}
                          </span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleUpdateSalary(emp.id)}
                              className="p-2 hover:bg-gray-100 rounded-lg transition"
                            >
                              <Edit size={18} className="text-blue-600" />
                            </button>
                            <button
                              onClick={() => handleDeleteEmployee(emp.id)}
                              className="p-2 hover:bg-gray-100 rounded-lg transition"
                            >
                              <Trash2 size={18} className="text-red-600" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Salary & Bonus Tab */}
          {currentTab === "salary" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Salary & Bonus Management</h2>
                <p className="text-gray-600">View and update employee compensation</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Total Monthly Salary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-primary">
                      ${(stats.totalSalaryExpense / 1000).toFixed(1)}K
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      {stats.totalEmployees} employees
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Total Monthly Bonus</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-green-600">
                      ${(employees.reduce((sum, e) => sum + e.bonus, 0) / 1000).toFixed(1)}K
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      {stats.totalEmployees} employees
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Total Compensation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-purple-600">
                      ${(
                        (stats.totalSalaryExpense +
                          employees.reduce((sum, e) => sum + e.bonus, 0)) /
                        1000
                      ).toFixed(1)}K
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      Monthly total
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Salary Details */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Employee Salary Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {employees.map((emp) => (
                      <div
                        key={emp.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{emp.name}</p>
                          <p className="text-sm text-gray-500">{emp.role.replace("_", " ").toUpperCase()}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            ${emp.salary.toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-500">
                            Bonus: ${emp.bonus.toLocaleString()}
                          </p>
                        </div>
                        <button
                          onClick={() => handleUpdateSalary(emp.id)}
                          className="ml-4 p-2 hover:bg-gray-100 rounded-lg transition"
                        >
                          <Edit size={18} className="text-blue-600" />
                        </button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Reports Tab */}
          {currentTab === "reports" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Company Reports</h2>
                <p className="text-gray-600">Analytics and insights about your organization</p>
              </div>

              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Department Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Array.from(
                      new Map(employees.map((e) => [e.department, e]))
                    ).map(([dept, emp]) => {
                      const deptEmployees = employees.filter((e) => e.department === dept);
                      return (
                        <div key={dept} className="p-4 border border-gray-200 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <p className="font-semibold text-gray-900">{dept}</p>
                            <p className="text-sm text-gray-600">
                              {deptEmployees.length} employees
                            </p>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500"
                              style={{
                                width: `${(deptEmployees.length / employees.length) * 100}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
