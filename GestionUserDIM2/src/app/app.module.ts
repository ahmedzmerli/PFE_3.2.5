import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { appRoutes } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { LoginComponent } from './pages/login/login.component';
// import { RegisterComponent } from './pages/register/register.component';
import { ActivateAccountComponent } from './pages/activate-account/activate-account.component';
import { BlacklistComponent } from './pages/blacklist/blacklist.component';
import { AdminComponent } from './pages/admin/admin.component';
// import { HomeComponent } from './pages/home/home.component';
import { Error403Component } from './pages/error403/error403.component';

import { LayoutModule } from './layout/layout.module';
import { SharedModule } from './shared.module';

import { AuthInterceptor } from './services/auth.interceptor';
import { ErrorInterceptor } from './services/error.interceptor';

import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { ListboxModule } from 'primeng/listbox';
import { MultiSelectModule } from 'primeng/multiselect';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';

import { MessageService, ConfirmationService } from 'primeng/api';
import {RouterModule} from "@angular/router";
import {PasswordModule} from "primeng/password";

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';




@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    // RegisterComponent,
    ActivateAccountComponent,
    BlacklistComponent,
    AdminComponent,
    // HomeComponent,
    Error403Component,
    

  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    BrowserAnimationsModule,
    LayoutModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    ListboxModule,
    MultiSelectModule,
    CheckboxModule,
    InputTextModule,
    ButtonModule,
    CardModule,
    MessageModule,
    ToastModule,
    SharedModule,
    ConfirmDialogModule,
    DialogModule,
    DropdownModule,
    PasswordModule,
    ToastModule,
    
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    MessageService,
    ConfirmationService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    }
  ],
  exports: [RouterModule],
  bootstrap: [AppComponent]
})
export class AppModule {}
