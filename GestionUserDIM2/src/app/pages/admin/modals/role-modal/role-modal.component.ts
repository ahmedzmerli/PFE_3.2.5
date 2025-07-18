import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RoleService } from 'src/app/services/role.service';
import { PermissionListService } from 'src/app/services/permission-list.service';
import { PermissionList } from 'src/app/models/permission-list.model';
import { animate, style, transition, trigger } from '@angular/animations';
import { Role } from 'src/app/models/role.model';
import { PermissionModalService } from 'src/app/services/serviceModals/PermissionModalService';

@Component({
  selector: 'app-role-modal',
  templateUrl: './role-modal.component.html',
  styleUrls: ['./role-modal.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('200ms ease-in', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-out', style({ opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ])
  ]

})
export class RoleModalComponent implements OnInit {
  @Output() created = new EventEmitter<void>();

  form: FormGroup;
  permissionLists: PermissionList[] = [];
  selectedItems: number[] = [];

  success = false;
  error = '';



  @Input() isEdit: boolean = false;
  @Input() editData?: Role;


  constructor(
    private fb: FormBuilder,
    private roleService: RoleService,
    private permissionListService: PermissionListService,
    public permissionModalService: PermissionModalService
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnInit(): void {
    this.permissionListService.getAll().subscribe({
      next: (data) => {
        this.permissionLists = data;

        if (this.isEdit && this.editData) {
          this.form.patchValue({ name: this.editData.name });
          this.selectedItems = this.editData.permissionLists?.map(pl => pl.id!) || [];
        } else {
          this.form.reset();
          this.selectedItems = [];
        }
      },
      error: () => this.error = 'Erreur lors du chargement des listes.'
    });
  }


  onSubmit(): void {
    if (this.form.invalid || this.selectedItems.length === 0) {
      this.error = 'Veuillez fournir un nom et choisir au moins une liste.';
      return;
    }

    if (this.isEdit && this.editData) {
      this.roleService.updateRole(this.editData.id!, this.form.value.name, this.selectedItems).subscribe({
        next: () => this.success = true,
        error: (err) => this.error = err.error?.message || 'Erreur lors de la modification.'
      });
    } else {
      this.roleService.createRoleWithPermissionLists(this.form.value.name, this.selectedItems).subscribe({
        next: () => this.success = true,
        error: (err) => this.error = err.error?.message || 'Erreur lors de la création.'
      });
    }

    this.created.emit();
    this.form.reset();
    this.selectedItems = [];
    setTimeout(() => this.success = false, 1000);
  }


  toggleSelection(id: number): void {
    const index = this.selectedItems.indexOf(id);
    index > -1 ? this.selectedItems.splice(index, 1) : this.selectedItems.push(id);
  }

  selectAll(): void {
    this.selectedItems = this.permissionLists.map(pl => pl.id!);
  }

  deselectAll(): void {
    this.selectedItems = [];
  }

  closeAlert(): void {
    this.success = false;
    this.error = '';
  }



}
