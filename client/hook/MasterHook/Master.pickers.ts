import { useDepartments, usePositions } from './Master.hook';
import { useMemo } from 'react';

/**
 * Picker data hook for department dropdowns.
 * Transforms raw department data into key-value label pair.
 */
export const useDepartmentPickers = () => {
  const { data: response, isLoading } = useDepartments();

  const pickers = useMemo(() => {
    if (!response?.data) return [];
    return response.data
      .filter((dept: any) => dept.active)
      .map((dept: any) => ({
        label: dept.name,
        value: dept.id.toString(),
        type: dept.type,
      }));
  }, [response]);

  return { pickers, isLoading };
};

/**
 * Picker data hook for position dropdowns.
 * Updated to match the global position model.
 */
export const usePositionPickers = () => {
  const { data: response, isLoading } = usePositions();
  console.log({ data: response });

  const pickers = useMemo(() => {
    if (!response?.data) return [];
    return response.data
      .filter((pos: any) => !pos.active)
      .map((pos: any) => ({
        label: pos.name,
        value: pos.id.toString(),
        code: pos.code,
        levelRank: pos.levelRank,
      }));
  }, [response]);

  return { pickers, isLoading };
};
