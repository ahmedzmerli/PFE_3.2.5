import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';

import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ActivateAccountComponent } from './pages/activate-account/activate-account.component';
// import { Dashboard } from './pages/dashboard/dashboard';
import { Error403Component } from './pages/error403/error403.component';
import { AuthGuard } from './guards/auth.guard';
import { PermissionGuard } from './guards/permission.guard';
import { UserManagementComponent } from './pages/admin/user-management/user-management.component';
import { PermissionListManagementComponent } from './pages/admin/permission-list-management/permission-list-management.component';
import { RoleManagementComponent } from './pages/admin/role-management/role-management.component';
import { AppLayout } from './layout/app.layout';
import {BlacklistManagementComponent} from "./pages/admin/blacklist-management/blacklist-management.component";
import {HistoryManagementComponentComponent} from "./pages/admin/history-management/history-management.component";
import {DashboardManagementComponent} from "./pages/admin/dashboard-management/dashboard-management.component";
import {PdvManagementComponent} from "./pages/admin/pdv-management/pdv-management.component";
import {PdvhistoryManagementComponent} from "./pages/admin/pdvhistory-management/pdvhistory-management.component";
import {StatsManagementComponent} from "./pages/admin/stats-management/stats-management.component";
import {MapComponent} from "./pages/admin/map/map.component";

// import {ChatComponent} from "./pages/admin/chat/chat.component"; // ⚠️ ton layout Sakai principal

export const appRoutes: Routes = [
  {
    path: '',
    component: AppLayout,
    children: [
      {
        path: '',
        component: AdminLayoutComponent,
        canActivate: [AuthGuard],
        children: [
          {
            path: 'permission-lists',
            component: PermissionListManagementComponent,
            canActivate: [PermissionGuard],
            data: { permission: 'permissionlists.read' }
          },
          {
            path: 'users',
            component: UserManagementComponent,
            canActivate: [PermissionGuard],
            data: { permission: 'users.read' }
          },
          {
            path: 'liste-roles',
            component: RoleManagementComponent,
            canActivate: [PermissionGuard],
            data: { permission: 'roles.read' }
          },
          {
            path: 'register',
            component: RegisterComponent,
            canActivate: [PermissionGuard],
            data: { permission: 'users.create' }
          },
          {
            path: '',
            redirectTo: 'users',
            pathMatch: 'full'
          },

          {
            path: 'blacklist',
            component: BlacklistManagementComponent,
            canActivate: [PermissionGuard],
            data: { permission: 'blacklist.read' }
          },
          {
            path: 'historique',
            component: HistoryManagementComponentComponent,
            canActivate: [PermissionGuard],
            data: { permission: 'blhistory.read' }
          },
          {
            path: 'dashboard',
            component: DashboardManagementComponent,
            canActivate: [PermissionGuard],
            data: { permission: 'dashboard.read' }
          },

          {
            path: 'pdv',
            component: PdvManagementComponent,
            canActivate: [PermissionGuard],
            data: { permission: 'pdv.read' }
          } ,
          {
            path: 'pdvhistory',
            component: PdvhistoryManagementComponent,
            canActivate: [PermissionGuard],
            data: { permission: 'pdvhistory.read' }
          }
          ,
          {
            path: 'stats',
            component: StatsManagementComponent,
            canActivate: [PermissionGuard],
            data: { permission: 'dashboard.read' }
          }
          ,
          {
            path: 'map',
            component: MapComponent,
            canActivate: [PermissionGuard],
            data: { permission: 'pdv.read' }
          },

          // {
          //   path: 'chat',
          //   component: ChatComponent,
          //   canActivate: [PermissionGuard],
          //   data: { permission: 'pdv.read' }
          // }
        ]
      }
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: 'activate-account', component: ActivateAccountComponent },
  { path: 'forbidden', component: Error403Component },
  { path: '**', redirectTo: '' }
];
