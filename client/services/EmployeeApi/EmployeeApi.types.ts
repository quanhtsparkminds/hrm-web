/**
 * Represents the detailed employee data returned from the backend.
 * Matches EmployeeResponseDTO in Java.
 */
export type TEmployee = {
  id: number;
  employeeCode: string;

  // User
  userId?: number;
  username?: string;
  email?: string;

  // Personal Info
  fullName: string;
  dateOfBirth: string; // ISO format
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  phoneNumber: string;
  personalEmail: string;
  nationality: string;
  maritalStatus: 'SINGLE' | 'MARRIED' | 'DIVORCED' | 'WIDOWED';

  // Identity
  nationalId: string;

  // Address
  permanentAddress: string;
  currentAddress: string;

  // Work Info
  departmentId?: number;
  departmentName?: string;

  positionId?: number;
  positionName?: string;

  jobTitle: string;

  managerId?: number;
  managerName?: string;

  employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERN';
  hireDate: string; // ISO format
  probationEndDate?: string;
  terminationDate?: string;
  workLocation: string;

  // Tax & Insurance
  taxCode: string;
  socialInsuranceNumber: string;
  healthInsuranceNumber: string;
  numberOfDependents: number;

  // Summary Info
  totalContracts: number;
  totalEmergencyContacts: number;

  // Audit
  createdAt: string;
  updatedAt: string;
};

/**
 * Filter criteria for fetching employees.
 * Matches EmployeeCriteria in Java.
 */
export interface EmployeeCriteria {
  name?: string;
  startDate?: string;
  endDate?: string;
  status?: string; // ELeaveStatus in Java, mapping to string for now
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
}

/**
 * Pagination parameters for API requests.
 */
export interface PageableParams {
  page?: number;
  size?: number;
  sort?: string[];
}

/**
 * Response structure for paginated requests.
 */
export interface PageResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  size: number;
  number: number;
  numberOfElements: number;
  empty: boolean;
}
