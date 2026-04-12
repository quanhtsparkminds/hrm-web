import { request } from '@/lib/axios';
import { TEmployee, EmployeeCriteria, PageResponse, PageableParams } from './EmployeeApi.types';

/**
 * Service for handling all employee-related API calls.
 */
export const EmployeeApi = {
  /**
   * Fetches all employees from the backend server with pagination and filtering.
   * @param criteria Filter criteria for the search.
   * @param pagination Page number, size, and sorting info.
   * @returns A promise that resolves to the paginated list of employees.
   */
  getAllEmployees: (criteria: EmployeeCriteria = {}, pagination: PageableParams = {}) => {
    const { page = 0, size = 10, sort = [] } = pagination;

    // Construct query parameters
    const params: any = {
      page,
      size,
      sort,
      ...criteria,
    };

    // Remove empty values to keep the query string clean
    Object.keys(params).forEach((key) => {
      if (params[key] === undefined || params[key] === '' || params[key] === null) {
        delete params[key];
      }
    });

    // The endpoint from the prompt is /api/v1/all-employees
    // and axios base URL is /api
    return request.get<TEmployee[]>('/all-employees', { params });
  },

  /**
   * Fetches details for a single employee.
   */
  getEmployeeById: (id: number) => {
    return request.get<TEmployee>(`/employee/${id}`);
  },

  /**
   * Creates a new employee record.
   */
  createEmployee: (data: Partial<TEmployee>) => {
    return request.post<TEmployee>('/employee', data);
  },

  /**
   * Updates an existing employee record.
   */
  updateEmployee: (id: number, data: Partial<TEmployee>) => {
    return request.put<TEmployee>(`/employee/${id}`, data);
  },

  /**
   * Deactivates or removes an employee record.
   */
  deleteEmployee: (id: number) => {
    return request.delete<void>(`/employee/${id}`);
  },
};

export default EmployeeApi;
