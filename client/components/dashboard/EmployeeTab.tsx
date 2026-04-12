import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Search,
  Eye,
  Edit2,
  UserX,
  Plus,
  Users,
  Building2,
  Mail,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { EmployeeApi } from '@/services/EmployeeApi/EmployeeApi';
import { TEmployee } from '@/services/EmployeeApi/EmployeeApi.types';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// New separated components
import { EmployeeDetails } from '../employees/EmployeeDetails';
import { EmployeeForm } from '../employees/EmployeeForm';

type ViewMode = 'list' | 'details' | 'create' | 'edit';

export default function EmployeeTab() {
  const [employees, setEmployees] = useState<TEmployee[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedEmployee, setSelectedEmployee] = useState<TEmployee | null>(null);

  const fetchEmployees = async (page: number) => {
    setLoading(true);
    try {
      const response = await EmployeeApi.getAllEmployees(
        { name: searchQuery },
        { page, size: 10 }
      );
      if (response.success) {
        setEmployees(response.data);
        if (response.metadata) {
          setTotalPages(response.metadata.totalPages);
          setTotalElements(response.metadata.totalElements);
        }
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast.error('Failed to load employees list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (viewMode === 'list') {
      fetchEmployees(currentPage);
    }
  }, [currentPage, viewMode]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(0);
    fetchEmployees(0);
  };

  const handleCreate = async (data: any) => {
    try {
      setLoading(true);
      const res = await EmployeeApi.createEmployee(data);
      if (res.success) {
        toast.success('Employee created successfully!');
        setViewMode('list');
      }
    } catch (err) {
      toast.error('Failed to create employee');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (data: any) => {
    if (!selectedEmployee) return;
    try {
      setLoading(true);
      const res = await EmployeeApi.updateEmployee(selectedEmployee.id, data);
      if (res.success) {
        toast.success('Employee updated successfully!');
        setViewMode('list');
      }
    } catch (err) {
      toast.error('Failed to update employee');
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async (id: number) => {
    if (!window.confirm('Are you sure you want to deactivate this employee?')) return;
    try {
      await EmployeeApi.deleteEmployee(id);
      toast.success('Employee deactivated');
      fetchEmployees(currentPage);
    } catch (err) {
      toast.error('Failed to deactivate employee');
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    for (let i = 0; i < totalPages; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => setCurrentPage(i)}
            isActive={currentPage === i}
            className="cursor-pointer"
          >
            {i + 1}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return (
      <Pagination className="mt-8">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
              className={cn("cursor-pointer", currentPage === 0 && "opacity-50 pointer-events-none")}
            />
          </PaginationItem>
          {pages}
          <PaginationItem>
            <PaginationNext
              onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
              className={cn("cursor-pointer", currentPage === totalPages - 1 && "opacity-50 pointer-events-none")}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  if (viewMode === 'details' && selectedEmployee) {
    return <EmployeeDetails employee={selectedEmployee} onBack={() => { setViewMode('list'); setSelectedEmployee(null); }} />;
  }

  if (viewMode === 'create') {
    return <EmployeeForm onBack={() => setViewMode('list')} onSubmit={handleCreate} isLoading={loading} />;
  }

  if (viewMode === 'edit' && selectedEmployee) {
    return <EmployeeForm initialData={selectedEmployee} onBack={() => setViewMode('list')} onSubmit={handleUpdate} isLoading={loading} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-foreground mb-1">Employee Management</h2>
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            Search and manage your talent pool (<span className="text-primary font-bold">{totalElements}</span> total)
          </p>
        </div>
        <Button 
          onClick={() => setViewMode('create')}
          className="bg-primary hover:bg-primary/90 text-white gap-2 font-bold px-6 h-11 shadow-sm"
        >
          <Plus size={18} /> Add Employee
        </Button>
      </div>

      <Card className="border-none shadow-sm dark:bg-card">
        <CardContent className="p-4">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by name or employee code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-50 dark:bg-muted border-none ring-offset-background focus-visible:ring-primary"
              />
            </div>
            <Button type="submit" variant="secondary" className="font-bold px-8 h-11 dark:bg-muted dark:hover:bg-muted/80">
              Search
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm overflow-hidden bg-white dark:bg-card">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50/50 dark:bg-muted/50 border-b border-gray-100 dark:border-border">
              <TableRow className="hover:bg-transparent">
                <TableHead className="px-6 py-4 font-bold text-gray-900 dark:text-foreground uppercase text-[10px] tracking-wider">Employee Identity</TableHead>
                <TableHead className="px-6 py-4 font-bold text-gray-900 dark:text-foreground uppercase text-[10px] tracking-wider">Department Details</TableHead>
                <TableHead className="px-6 py-4 font-bold text-gray-900 dark:text-foreground uppercase text-[10px] tracking-wider">Contract Type</TableHead>
                <TableHead className="px-6 py-4 font-bold text-gray-900 dark:text-foreground uppercase text-[10px] tracking-wider text-right">Management</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="px-6 py-4"><Skeleton className="h-12 w-52 rounded-lg" /></TableCell>
                    <TableCell className="px-6 py-4"><Skeleton className="h-12 w-40 rounded-lg" /></TableCell>
                    <TableCell className="px-6 py-4"><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                    <TableCell className="px-6 py-4 text-right"><Skeleton className="h-10 w-32 ml-auto rounded-lg" /></TableCell>
                  </TableRow>
                ))
              ) : employees.length > 0 ? (
                employees.map((emp) => (
                  <TableRow key={emp.id} className="hover:bg-gray-50/50 dark:hover:bg-muted/30 transition-colors border-gray-50 dark:border-border">
                    <TableCell className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold border border-blue-200 dark:border-blue-800">
                          {emp.fullName.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-gray-900 dark:text-foreground truncate">{emp.fullName}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5 truncate">
                            <Mail size={12} className="text-gray-400 shrink-0" /> {emp.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-5">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] font-mono font-bold text-primary bg-primary/5 px-1.5 py-0.5 rounded w-fit">{emp.employeeCode}</span>
                        <span className="text-sm text-gray-600 dark:text-gray-300 font-semibold flex items-center gap-1.5">
                          <Building2 size={14} className="text-gray-400" /> {emp.departmentName || 'Operations'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-5">
                      <Badge variant="outline" className={cn(
                        "rounded-full font-bold text-[10px] px-3 py-0.5 uppercase tracking-wide border-none",
                        emp.employmentType === 'FULL_TIME' ? "bg-green-100/50 text-green-700 dark:bg-green-900/40 dark:text-green-400" :
                        emp.employmentType === 'PART_TIME' ? "bg-blue-100/50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400" :
                        "bg-orange-100/50 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400"
                      )}>
                        {emp.employmentType.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => { setSelectedEmployee(emp); setViewMode('details'); }}
                          className="h-9 w-9 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                          title="View Details"
                        >
                          <Eye size={16} strokeWidth={2.5} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => { setSelectedEmployee(emp); setViewMode('edit'); }}
                          className="h-9 w-9 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-muted"
                          title="Edit Record"
                        >
                          <Edit2 size={16} strokeWidth={2.5} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeactivate(emp.id)}
                          className="h-9 w-9 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                          title="Deactivate Employee"
                        >
                          <UserX size={16} strokeWidth={2.5} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="py-24 text-center">
                    <div className="flex flex-col items-center gap-4 text-gray-400 dark:text-gray-600">
                      <div className="p-4 bg-gray-50 dark:bg-muted rounded-full">
                        <Users size={40} strokeWidth={1} />
                      </div>
                      <p className="text-gray-500 dark:text-gray-400 font-bold">No results found matching your search</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {renderPagination()}
    </div>
  );
}
