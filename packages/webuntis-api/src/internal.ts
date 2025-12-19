import type { SchoolYear } from "./types";
export type InternalSchoolYear = Omit<SchoolYear, "startDate" | "endDate"> & { startDate: string; endDate: string };

export type SessionInformation = {
  klasseId?: number;
  personId?: number;
  sessionId?: string;
  personType?: number;
  jwt_token?: string;
  name?: string;
  id?: number;
  departmentId?: number;
  roleId?: number;
  userGroupId?: number;
  persons?: Array<{
    id: number;
    type: number;
    displayName: string;
    longName: string;
    foreName: string;
  }>;
  email?: string;
};
