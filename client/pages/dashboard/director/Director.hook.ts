import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/store";
import { signOut } from "@/store/slices/AuthSlice";
import { storage, StorageKeys } from "@/lib/storage";
import { request } from "@/lib/axios";
import { useState } from "react";
import { NavItem } from "@/components/layout/DashboardLayout";
import { BarChart3, Users, TrendingUp } from "lucide-react";
import { useRoleGuard } from "@/hook/UserHook/UserHook";
import { useLogout } from "@/hook/AuthHook/AuthHook";

export interface Employee {
    id: string;
    name: string;
    email: string;
    role: string;
    department: string;
    salary: number;
    bonus: number;
    status: "active" | "inactive" | "on_leave";
}

export interface CompanyStats {
    totalEmployees: number;
    presentToday: number;
    onLeaveToday: number;
    totalSalaryExpense: number;
}

export const useDirector = () => {
    const { logout } = useLogout();
    const { user, refetch } = useRoleGuard(["ADMIN"]);
    const [currentTab, setCurrentTab] = useState<
        "overview" | "employees" | "salary" | "reports"
    >("overview");

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

    const handleLogout = async () => {
        await logout();
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
        setNewEmployee({
            name: "",
            email: "",
            role: "employee",
            department: "",
            salary: "",
            bonus: "",
        });
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
                employees.map((e) =>
                    e.id === id ? { ...e, salary: parseInt(newSalary) } : e,
                ),
            );
        }
    };

    const handleTabSwitch = (tab: "overview" | "employees" | "salary" | "reports") => {
        setCurrentTab(tab);
        refetch();
    };

    const navItems: NavItem[] = [
        {
            id: "overview",
            label: "Overview",
            icon: BarChart3,
            onClick: () => handleTabSwitch("overview"),
            isActive: currentTab === "overview",
        },
        {
            id: "employees",
            label: "Employees",
            icon: Users,
            onClick: () => handleTabSwitch("employees"),
            isActive: currentTab === "employees",
        },
        {
            id: "salary",
            label: "Salary & Bonus",
            icon: TrendingUp,
            onClick: () => handleTabSwitch("salary"),
            isActive: currentTab === "salary",
        },
        {
            id: "reports",
            label: "Reports",
            icon: BarChart3,
            onClick: () => handleTabSwitch("reports"),
            isActive: currentTab === "reports",
        },
    ];

    return {
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
    };
};
