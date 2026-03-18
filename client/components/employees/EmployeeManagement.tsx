import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Info,
  Edit,
  UserCheck,
  Mail,
  Phone,
  MapPin,
  ArrowLeft,
  Loader2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEmployees, useEmployeeDetail } from '@/hook/EmployeeHook/EmployeeHook';
import { EmployeeCriteria, PageableParams } from '@/services/EmployeeApi/EmployeeApi.types';
import { format } from 'date-fns';

const EmployeeManagement: React.FC = () => {
  // State for search and filters
  const [criteria, setCriteria] = useState<EmployeeCriteria>({
    name: '',
    gender: undefined,
  });

  // State for pagination
  const [pagination, setPagination] = useState<PageableParams>({
    page: 0,
    size: 10,
  });

  // State for view mode: 'list' | 'detail' | 'update'
  const [viewMode, setViewMode] = useState<'list' | 'detail' | 'update'>('list');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);

  // Fetch employees data
  const { data: pageResponse, isLoading, isError, error } = useEmployees(criteria, pagination);
  const pageData = pageResponse?.data;
  const metadata = pageResponse?.metadata;

  // Fetch detailed employee data if an ID is selected
  const { data: employeeResponse, isLoading: isLoadingDetail } =
    useEmployeeDetail(selectedEmployeeId);
  const employeeDetail = employeeResponse?.data;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCriteria((prev) => ({ ...prev, name: e.target.value }));
    setPagination((prev) => ({ ...prev, page: 0 })); // Reset to first page on search
  };

  const handleGenderFilter = (gender: 'MALE' | 'FEMALE' | 'OTHER' | 'ALL') => {
    setCriteria((prev) => ({
      ...prev,
      gender: gender === 'ALL' ? undefined : gender,
    }));
    setPagination((prev) => ({ ...prev, page: 0 }));
  };

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const showDetail = (id: number) => {
    setSelectedEmployeeId(id);
    setViewMode('detail');
  };

  const showUpdate = (id: number) => {
    setSelectedEmployeeId(id);
    setViewMode('update');
  };

  if (viewMode === 'detail' && selectedEmployeeId) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Employee Profile</h2>
            <p className="text-gray-600">
              Reviewing detailed information for {employeeDetail?.fullName || '...'}
            </p>
          </div>
          <Button variant="outline" onClick={() => setViewMode('list')} className="gap-2">
            <ArrowLeft size={16} /> Back to List
          </Button>
        </div>

        {isLoadingDetail ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
            <p className="text-gray-500">Loading profile details...</p>
          </div>
        ) : employeeDetail ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sidebar with Profile Card */}
            <Card className="border-0 shadow-lg lg:col-span-1 overflow-hidden">
              <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
              <CardHeader className="text-center -mt-16 pb-2 relative">
                <div className="mx-auto w-24 h-24 bg-white p-1 rounded-full shadow-xl">
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-inner">
                    {employeeDetail.fullName.charAt(0)}
                  </div>
                </div>
                <CardTitle className="text-2xl mt-4">{employeeDetail.fullName}</CardTitle>
                <CardDescription className="font-medium text-blue-600">
                  {employeeDetail.jobTitle}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                    <UserCheck size={18} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-xs uppercase tracking-wider font-semibold">
                      Employee ID
                    </span>
                    <strong className="text-gray-900">{employeeDetail.employeeCode}</strong>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-2 bg-pink-50 rounded-lg text-pink-600">
                    <Mail size={18} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-xs uppercase tracking-wider font-semibold">
                      Work Email
                    </span>
                    <strong className="text-gray-900">{employeeDetail.email}</strong>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-2 bg-green-50 rounded-lg text-green-600">
                    <Phone size={18} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-xs uppercase tracking-wider font-semibold">
                      Phone
                    </span>
                    <strong className="text-gray-900">{employeeDetail.phoneNumber}</strong>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                    <MapPin size={18} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-xs uppercase tracking-wider font-semibold">
                      Current Address
                    </span>
                    <strong className="text-gray-900 text-xs">
                      {employeeDetail.currentAddress}
                    </strong>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Main Details Panel */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Professional Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                  <DetailItem label="Department" value={employeeDetail.departmentName} />
                  <DetailItem label="Position" value={employeeDetail.positionName} />
                  <DetailItem
                    label="Employment Type"
                    value={employeeDetail.employmentType}
                    highlight
                  />
                  <DetailItem
                    label="Hire Date"
                    value={format(new Date(employeeDetail.hireDate), 'PPP')}
                  />
                  <DetailItem label="Direct Manager" value={employeeDetail.managerName || 'None'} />
                  <DetailItem label="Work Location" value={employeeDetail.workLocation} />
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                  <DetailItem
                    label="Birthday"
                    value={format(new Date(employeeDetail.dateOfBirth), 'PPP')}
                  />
                  <DetailItem label="Gender" value={employeeDetail.gender} />
                  <DetailItem label="Nationality" value={employeeDetail.nationality} />
                  <DetailItem label="Marital Status" value={employeeDetail.maritalStatus} />
                  <DetailItem label="National ID" value={employeeDetail.nationalId} />
                  <DetailItem label="Personal Email" value={employeeDetail.personalEmail} />
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Tax & Insurance</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                  <DetailItem label="Tax Code" value={employeeDetail.taxCode} />
                  <DetailItem
                    label="Social Insurance"
                    value={employeeDetail.socialInsuranceNumber}
                  />
                  <DetailItem
                    label="Health Insurance"
                    value={employeeDetail.healthInsuranceNumber}
                  />
                  <DetailItem label="Dependents" value={employeeDetail.numberOfDependents} />
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="text-center py-20">Employee not found.</div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-1">Employee Directory</h2>
          <p className="text-gray-600">Search and manage your talent pool with ease.</p>
        </div>
        <div className="flex gap-2">{/* Add Employee button would go here */}</div>
      </div>

      {/* Search and Filters Bar */}
      <Card className="border-0 shadow-sm overflow-hidden bg-white/50 backdrop-blur-sm">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by name or code..."
              className="pl-10 h-10 bg-white border-gray-100 border"
              value={criteria.name}
              onChange={handleSearch}
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            <Filter size={16} className="text-gray-400 mr-2" />
            <FilterChip
              label="All"
              active={criteria.gender === undefined}
              onClick={() => handleGenderFilter('ALL')}
            />
            <FilterChip
              label="Male"
              active={criteria.gender === 'MALE'}
              onClick={() => handleGenderFilter('MALE')}
            />
            <FilterChip
              label="Female"
              active={criteria.gender === 'FEMALE'}
              onClick={() => handleGenderFilter('FEMALE')}
            />
            <FilterChip
              label="Other"
              active={criteria.gender === 'OTHER'}
              onClick={() => handleGenderFilter('OTHER')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Employee List Table */}
      <Card className="border-0 shadow-lg overflow-hidden bg-white">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
            <p className="text-gray-500">Retrieving employee roster...</p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-20 text-red-500">
            <p>Error: {(error as any)?.message || 'Failed to load employees'}</p>
            <Button variant="link" onClick={() => window.location.reload()}>
              Try again
            </Button>
          </div>
        ) : !pageData || pageData.length === 0 ? (
          <div className="text-center py-20">
            <Users size={48} className="mx-auto text-gray-200 mb-4" />
            <p className="text-gray-500">No employees found matching your criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Code
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {pageData?.map((emp) => (
                  <tr key={emp.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold group-hover:scale-110 transition-transform shadow-sm">
                          {emp.fullName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{emp.fullName}</p>
                          <p className="text-xs text-gray-400 font-medium">{emp.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600">
                      {emp.employeeCode}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-semibold">
                        {emp.departmentName || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                      {emp.positionName || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight ${
                          emp.employmentType === 'FULL_TIME'
                            ? 'bg-green-100 text-green-700'
                            : emp.employmentType === 'PART_TIME'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {emp.employmentType.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => showDetail(emp.id)}
                        className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        title="View details"
                      >
                        <Info size={18} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => showUpdate(emp.id)}
                        className="h-8 w-8 p-0 text-gray-400 hover:text-gray-900"
                        title="Edit employee"
                      >
                        <Edit size={18} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {metadata && metadata.totalPages > 1 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500 font-medium">
              Showing{' '}
              <span className="text-gray-900">
                {(metadata.page || 0) * (metadata.size || 0) + 1}
              </span>{' '}
              to{' '}
              <span className="text-gray-900">
                {Math.min(
                  ((metadata.page || 0) + 1) * (metadata.size || 0),
                  metadata.totalElements || 0,
                )}
              </span>{' '}
              of <span className="text-gray-900">{metadata.totalElements}</span> results
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-4 font-semibold"
                onClick={() => handlePageChange((metadata.page || 0) - 1)}
                disabled={metadata.page === 0}
              >
                <ChevronLeft size={16} className="mr-1" /> Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-4 font-semibold"
                onClick={() => handlePageChange((metadata.page || 0) + 1)}
                disabled={metadata.last}
              >
                Next <ChevronRight size={16} className="ml-1" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

// --- Helper Components ---

const DetailItem = ({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: any;
  highlight?: boolean;
}) => (
  <div className="space-y-1">
    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</span>
    <p className={`font-semibold ${highlight ? 'text-blue-600' : 'text-gray-900'}`}>
      {value || '—'}
    </p>
  </div>
);

const FilterChip = ({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border whitespace-nowrap ${
      active
        ? 'bg-blue-600 border-blue-600 text-white shadow-md'
        : 'bg-white border-gray-200 border text-gray-600 hover:border-blue-400 hover:text-blue-600'
    }`}
  >
    {label}
  </button>
);

export default EmployeeManagement;
