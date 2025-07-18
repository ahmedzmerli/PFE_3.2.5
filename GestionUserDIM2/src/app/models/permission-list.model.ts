import { Permission } from './permission.model';

export interface PermissionList {
  id?: number;
  name: string;
  permissions: Permission[];
}
