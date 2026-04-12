export interface Department {
  id: number;
  code: string;
  name: string;
  description: string | null;
  type: 'COMPANY' | 'DEPARTMENT' | 'TEAM';
  headId: number | null;
  headName: string | null;
  parentId: number | null;
  parentName: string | null;
  active: boolean;
  createdAt: string;
}

export interface Position {
  id: number;
  code: string; // CEO, DEV, QA, PM, BA, HR_STAFF, TEAM_LEAD...
  name: string; // "CEO", "Lập trình viên", "Team Leader"...
  description: string | null;
  levelRank: number; // 1=Intern, 2=Junior, 3=Mid, 4=Senior, 5=Lead, 6=Manager, 7=Director, 8=CEO
  minSalary: number;
  maxSalary: number;
  active: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}
