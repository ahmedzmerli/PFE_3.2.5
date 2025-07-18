import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Role } from 'src/app/models/role.model';

@Injectable({ providedIn: 'root' })
export class PermissionModalService {
  private _showPermissionModal = new BehaviorSubject<boolean>(false);
  private _showPermissionListModal = new BehaviorSubject<boolean>(false);
  private _showRoleModal = new BehaviorSubject<boolean>(false);



  
  public showModal$ = this._showPermissionModal.asObservable();
  public showListModal$ = this._showPermissionListModal.asObservable();

  public showRoleModal$ = this._showRoleModal.asObservable();

  openModal() {
    this._showPermissionModal.next(true);
  }

  closeModal() {
    this._showPermissionModal.next(false);
  }


  openPermissionListModal() {
    this._showPermissionListModal.next(true);
  }
  closePermissionListModal() {
    this._showPermissionListModal.next(false);
  }

  openRoleModal() {
    this._showRoleModal.next(true);
  }
  closeRoleModal() {
    this._showRoleModal.next(false);
  }

  private _editRoleData: Role | null = null;
private _isRoleEdit = false;

setRoleModalData(edit: boolean, data?: Role) {
  this._isRoleEdit = edit;
  this._editRoleData = data || null;
}

get isRoleEdit(): boolean {
  return this._isRoleEdit;
}

get editRoleData(): Role | null {
  return this._editRoleData;
}



}
