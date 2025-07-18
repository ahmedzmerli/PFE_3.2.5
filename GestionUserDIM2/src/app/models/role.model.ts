import { PermissionList } from './permission-list.model';

export interface Role {
  id?: number;
  name: string;
  permissionLists: PermissionList[];
}
