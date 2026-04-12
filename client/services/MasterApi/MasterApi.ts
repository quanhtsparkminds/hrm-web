import { request } from '@/lib/axios';
import { Department, Position } from './MasterApi.types';

/**
 * Service for fetching global master data for pickers and dropdowns.
 */
export const MasterApi = {
  /**
   * Fetches all active departments and teams.
   */
  getDepartments: () => {
    return request.get<Department[]>('/departments');
  },

  /**
   * Fetches all positions available in the system.
   */
  getPositions: () => {
    return request.get<Position[]>('/positions');
  },
};

export default MasterApi;
