import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PermissionListModalComponent } from './pages/admin/modals/permission-list-modal/permission-list-modal.component';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageModule } from 'primeng/message';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RoleModalComponent } from './pages/admin/modals/role-modal/role-modal.component';
import { PermissionListManagementComponent } from './pages/admin/permission-list-management/permission-list-management.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { RoleManagementComponent } from './pages/admin/role-management/role-management.component';
import { UserModalComponent } from './pages/admin/modals/user-modal/user-modal.component';
import { UserManagementComponent } from './pages/admin/user-management/user-management.component';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { AssignRoleModalComponent } from './pages/admin/modals/assign-role-modal/assign-role-modal.component';
import { AssignSingleRoleModalComponent } from './pages/admin/modals/assign-single-role-modal/assign-single-role-modal.component';
import { PaginatorModule } from 'primeng/paginator';
import { HasPermissionDirective } from './directives/has-permission.directive';
import { UserRegisterModalComponent } from './pages/admin/modals/user-register-modal/user-register-modal.component';
import {TableModule} from "primeng/table";
import {ToolbarModule} from "primeng/toolbar";
import {TagModule} from "primeng/tag";
import { PermissionListDetailsModalComponent } from './pages/admin/modals/permission-list-details-modal/permission-list-details-modal.component';
import { RoleDetailsModalComponent } from './pages/admin/modals/role-details-modal/role-details-modal.component';
import {BlacklistManagementComponent} from "./pages/admin/blacklist-management/blacklist-management.component";
import {PasswordModule} from "primeng/password";
import {
  HistoryManagementComponentComponent
} from "./pages/admin/history-management/history-management.component";
import {Calendar, CalendarModule} from "primeng/calendar";
import { DashboardManagementComponent } from './pages/admin/dashboard-management/dashboard-management.component';
import { PdvManagementComponent } from './pages/admin/pdv-management/pdv-management.component';
import { PdvhistoryManagementComponent } from './pages/admin/pdvhistory-management/pdvhistory-management.component';
import { StatsManagementComponent } from './pages/admin/stats-management/stats-management.component';
import {NgChartsModule} from "ng2-charts";
import { MapComponent } from './pages/admin/map/map.component';
import { HomeComponent } from './pages/admin/home/home.component';
import { ToastModule } from 'primeng/toast';
// import {ChatComponent} from "./pages/admin/chat/chat.component";







@NgModule({
  declarations: [
    PermissionListModalComponent,
    RoleModalComponent,
    UserModalComponent,
    PermissionListManagementComponent,
    RoleManagementComponent,
    UserManagementComponent,
    AssignRoleModalComponent,
    AssignSingleRoleModalComponent,
    UserRegisterModalComponent,
    PermissionListDetailsModalComponent,
    RoleDetailsModalComponent,
    BlacklistManagementComponent,
HistoryManagementComponentComponent,
DashboardManagementComponent,
PdvManagementComponent,
PdvhistoryManagementComponent,
StatsManagementComponent,
MapComponent,
HomeComponent,

// ChatComponent



  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CheckboxModule,
    MessageModule,
    ButtonModule,
    InputTextModule,
    ConfirmDialogModule,
    DialogModule,
    DropdownModule,
    MultiSelectModule,
    PaginatorModule,
    HasPermissionDirective,
    TableModule,
    ToolbarModule,
    TagModule,
    PasswordModule,
    CalendarModule,
    NgChartsModule,
ToastModule,


  ],
  exports: [
    PermissionListModalComponent,
    RoleModalComponent,
    UserModalComponent,
 HasPermissionDirective,
    StatsManagementComponent,

  ],
  providers: [
    ConfirmationService,
    MessageService
  ]
})
export class SharedModule { }
