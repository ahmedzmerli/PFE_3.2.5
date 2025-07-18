import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared.module';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import {AppTopbar} from "./app.topbar";
import {AppSidebar} from "./app.sidebar";
import {AppFooter} from "./app.footer";
import {DialogModule} from "primeng/dialog";


@NgModule({
  declarations: [

    AdminLayoutComponent,

  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    ConfirmDialogModule,
    AppTopbar,
    AppTopbar,
    AppTopbar,
    AppSidebar,
    AppFooter,
    DialogModule

  ],
  exports: [

    AdminLayoutComponent,
    AppTopbar,
    AppSidebar,
    AppFooter
  ],

})
export class LayoutModule { }
