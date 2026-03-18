import { useQuery } from '@tanstack/react-query';
import EmployeeApi from '@/services/EmployeeApi/EmployeeApi';
import { EmployeeCriteria, PageableParams } from '@/services/EmployeeApi/EmployeeApi.types';

/**
 * Custom hook to fetch the list of employees with criteria and pagination support.
 */
export const useEmployees = (criteria: EmployeeCriteria = {}, pagination: PageableParams = {}) => {
  return useQuery({
    queryKey: ['employees', criteria, pagination],
    queryFn: () => EmployeeApi.getAllEmployees(criteria, pagination),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

/**
 * Custom hook to fetch a single employee by their ID.
 */
export const useEmployeeDetail = (id: number | null) => {
  return useQuery({
    queryKey: ['employee', id],
    queryFn: () => (id ? EmployeeApi.getEmployeeById(id) : null),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};
