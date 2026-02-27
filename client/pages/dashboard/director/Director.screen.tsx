import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CheckCircle,
  Clock,
  Edit,
  Plus,
  Trash2,
  TrendingUp,
  Users,
} from "lucide-react";
import { useDirector } from "./Director.hook";

export default function DirectorScreen() {
  const {
    user,
    currentTab,
    setCurrentTab,
    employees,
    stats,
    showAddEmployee,
    setShowAddEmployee,
    newEmployee,
    setNewEmployee,
    handleLogout,
    handleAddEmployee,
    handleDeleteEmployee,
    handleUpdateSalary,
    handleTabSwitch,
    navItems,
  } = useDirector();

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout
      user={user}
      navItems={navItems}
      onLogout={handleLogout}
      title="Director Dashboard"
      avatarGradient="from-red-400 to-red-600"
    >
      {currentTab === "overview" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Sparkminds Overview
            </h2>
            <p className="text-gray-600">
              Full control and management of your organization
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">
                  Total Employees
                </CardTitle>
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
                <CardTitle className="text-sm font-medium">
                  Present Today
                </CardTitle>
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
                <CardTitle className="text-sm font-medium">
                  Monthly Salary Cost
                </CardTitle>
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
                <Button
                  className="flex-1"
                  onClick={() => handleTabSwitch("employees")}
                >
                  Add Employee
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleTabSwitch("salary")}
                >
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
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Employee Management
              </h2>
              <p className="text-gray-600">
                Add, edit, and manage employee records
              </p>
            </div>
            <Button
              onClick={() => setShowAddEmployee(!showAddEmployee)}
              className="gap-2"
            >
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
                <form
                  onSubmit={handleAddEmployee}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
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
                    <Label
                      htmlFor="email"
                      className="text-gray-700 font-medium"
                    >
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@company.com"
                      value={newEmployee.email}
                      onChange={(e) =>
                        setNewEmployee({
                          ...newEmployee,
                          email: e.target.value,
                        })
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
                    <Label
                      htmlFor="department"
                      className="text-gray-700 font-medium"
                    >
                      Department
                    </Label>
                    <Input
                      id="department"
                      type="text"
                      placeholder="Department"
                      value={newEmployee.department}
                      onChange={(e) =>
                        setNewEmployee({
                          ...newEmployee,
                          department: e.target.value,
                        })
                      }
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="salary"
                      className="text-gray-700 font-medium"
                    >
                      Monthly Salary
                    </Label>
                    <Input
                      id="salary"
                      type="number"
                      placeholder="50000"
                      value={newEmployee.salary}
                      onChange={(e) =>
                        setNewEmployee({
                          ...newEmployee,
                          salary: e.target.value,
                        })
                      }
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="bonus"
                      className="text-gray-700 font-medium"
                    >
                      Bonus
                    </Label>
                    <Input
                      id="bonus"
                      type="number"
                      placeholder="5000"
                      value={newEmployee.bonus}
                      onChange={(e) =>
                        setNewEmployee({
                          ...newEmployee,
                          bonus: e.target.value,
                        })
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
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Salary & Bonus Management
            </h2>
            <p className="text-gray-600">
              View and update employee compensation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">
                  Total Monthly Salary
                </CardTitle>
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
                <CardTitle className="text-sm font-medium">
                  Total Monthly Bonus
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-600">
                  $
                  {(
                    employees.reduce((sum, e) => sum + e.bonus, 0) / 1000
                  ).toFixed(1)}
                  K
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  {stats.totalEmployees} employees
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">
                  Total Compensation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-purple-600">
                  $
                  {(
                    (stats.totalSalaryExpense +
                      employees.reduce((sum, e) => sum + e.bonus, 0)) /
                    1000
                  ).toFixed(1)}
                  K
                </p>
                <p className="text-sm text-gray-600 mt-2">Monthly total</p>
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
                      <p className="text-sm text-gray-500">
                        {emp.role.replace("_", " ").toUpperCase()}
                      </p>
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
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Company Reports
            </h2>
            <p className="text-gray-600">
              Analytics and insights about your organization
            </p>
          </div>

          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Department Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from(
                  new Map(employees.map((e) => [e.department, e])),
                ).map(([dept]) => {
                  const deptEmployees = employees.filter(
                    (e) => e.department === dept,
                  );
                  return (
                    <div
                      key={dept}
                      className="p-4 border border-gray-200 rounded-lg"
                    >
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
    </DashboardLayout>
  );
}
