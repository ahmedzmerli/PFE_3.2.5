import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  OnChanges
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PermissionService } from 'src/app/services/permission.service';
import { PermissionListService } from 'src/app/services/permission-list.service';
import { Permission } from 'src/app/models/permission.model';
import { PermissionModalService } from 'src/app/services/serviceModals/PermissionModalService';
import { trigger, transition, style, animate } from '@angular/animations';
import { PermissionList } from 'src/app/models/permission-list.model';

@Component({
  selector: 'app-permission-list-modal',
  templateUrl: './permission-list-modal.component.html',
  styleUrls: ['./permission-list-modal.component.scss'],
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
export class PermissionListModalComponent implements OnInit, OnChanges {
  @Output() created = new EventEmitter<void>();
  @Input() isEdit: boolean = false;
  @Input() editData?: PermissionList;

  form: FormGroup;
  permissions: Permission[] = [];
  selectedItems: number[] = [];
  success = false;
  error = '';

  groupedPermissions: { feature: string; permissions: { label: string; value: number }[] }[] = [];

  constructor(
    private fb: FormBuilder,
    private permissionService: PermissionService,
    private permissionListService: PermissionListService,
    public permissionModalService: PermissionModalService
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnInit(): void {
    this.loadPermissions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['editData']) {
      if (this.isEdit && this.editData) {
        this.form.patchValue({ name: this.editData.name });
        this.selectedItems = this.editData.permissions.map(p => p.id!);
      } else {
        this.form.reset();
        this.selectedItems = [];
      }
    }
  }

  private loadPermissions(): void {
    this.permissionService.getAll().subscribe({
      next: (data) => {
        this.permissions = data.filter(p =>
          p.feature !== 'permissions' &&
          p.feature !== 'roles.assignpermissionlists' &&
          p.feature !== 'permissionlists.assignpermission'
        );
        this.groupPermissions();
        if (this.isEdit && this.editData) {
          this.patchEditData();
        }
      },
      error: () => this.error = 'Erreur lors du chargement des permissions.'
    });
  }

  private patchEditData(): void {
    if (this.editData) {
      this.form.patchValue({ name: this.editData.name });
      this.selectedItems = this.editData.permissions.map(p => p.id!);
    }
  }

  private groupPermissions(): void {
    const groupMap = new Map<string, { label: string; value: number }[]>();
    for (const p of this.permissions) {
      const key = p.feature;
      const permissionKey = `${p.feature}.${p.action}`;
      const label = this.friendlyLabels[permissionKey] || permissionKey;
      const value = { label, value: p.id! };
      if (!groupMap.has(key)) groupMap.set(key, []);
      groupMap.get(key)!.push(value);
    }

    this.groupedPermissions = Array.from(groupMap.entries()).map(([feature, permissions]) => ({
      feature, permissions
    }));
  }

  onSubmit(): void {
    if (this.form.invalid || this.selectedItems.length === 0) {
      this.error = 'Veuillez remplir le nom et choisir au moins une permission.';
      return;
    }

    const request$ = this.isEdit && this.editData
      ? this.permissionListService.update(this.editData.id!, this.form.value.name, this.selectedItems)
      : this.permissionListService.create(this.form.value.name, this.selectedItems);

    request$.subscribe({
      next: () => {
        this.success = true;
        this.error = '';
        this.created.emit();
        this.resetForm();
      },
      error: (err) => {
        this.success = false;
        this.error = err.error?.message || 'Erreur lors de l’enregistrement.';
      }
    });
  }

  resetForm(): void {
    this.form.reset();
    this.selectedItems = [];
    this.isEdit = false;
    this.editData = undefined;
    setTimeout(() => {
      this.success = false;
      this.permissionModalService.closePermissionListModal();
    }, 1000);
  }

  closeAlert(): void {
    this.success = false;
    this.error = '';
  }

  toggleSelection(id: number): void {
    const index = this.selectedItems.indexOf(id);
    index > -1 ? this.selectedItems.splice(index, 1) : this.selectedItems.push(id);
  }

  selectAllGlobal(): void {
    const allIds = this.groupedPermissions.flatMap(group => group.permissions.map(p => p.value));
    this.selectedItems = Array.from(new Set([...this.selectedItems, ...allIds]));
  }

  deselectAllGlobal(): void {
    this.selectedItems = [];
  }

  getPermissionLabelById(id: number): string {
    const perm = this.groupedPermissions
      .flatMap(group => group.permissions)
      .find(p => p.value === id);
    return perm?.label || `ID ${id}`;
  }

  friendlyLabels: Record<string, string> = {
    'permissionlists.create': 'Créer une liste de permissions',
    'permissionlists.read': 'Voir les listes de permissions',
    'permissionlists.update': 'Modifier une liste de permissions',
    'permissionlists.delete': 'Supprimer une liste de permissions',

    'permissionlists.permissions.create': 'Ajouter une permission à une liste',
    'permissionlists.permissions.delete': 'Retirer une permission d’une liste',

    'roles.create': 'Créer un rôle',
    'roles.createwithpermissionlists.create': 'Créer un rôle (avec listes)',
    'roles.read': 'Voir les rôles',
    'roles.update': 'Modifier un rôle',
    'roles.delete': 'Supprimer un rôle',
    'roles.roles.read': 'Voir les rôles assignés à un rôle',
    'roles.permissionlists.delete': 'Supprimer une liste d’un rôle',

    'users.create': 'Créer un utilisateur',
    'users.read': 'Voir les utilisateurs',
    'users.update': 'Modifier un utilisateur',
    'users.delete': 'Supprimer un utilisateur',

    'users.roles.read': 'Voir les rôles d’un utilisateur',
    'users.roles.create': 'Assigner un rôle à un utilisateur',
    'users.roles.delete': 'Retirer un rôle d’un utilisateur',

    'users.permissions.read': 'Voir les permissions d’un utilisateur',

    'blacklist.read': 'Voir la blacklist',
    'blacklist.toggle.create': 'Basculer l’état de la blacklist',
    'blhistory.read': 'Voir l’historique de blacklist',

    'permissions.read': 'Voir toutes les permissions',
    'permissions.distinct.read': 'Voir les types de permissions',

    'fixadmin.read': 'Initialiser les permissions'
  };

  getGroupLabel(feature: string): string {
    const featureLabels: Record<string, string> = {
      'users': 'Utilisateurs',
      'users.roles': 'Rôles des utilisateurs',
      'users.permissions': 'Permissions des utilisateurs',
      'permissionlists': 'Listes de permissions',
      'permissionlists.permissions': 'Permissions dans les listes',
      'roles': 'Rôles',
      'roles.roles': 'Rôles imbriqués',
      'roles.permissionlists': 'Listes liées à un rôle',
      'roles.createwithpermissionlists': 'Création de rôle avancée',
      'blacklist': 'Blacklist',
      'blhistory': 'Historique blacklist',
      'fixadmin': 'Initialisation système',
      'roles.permissionlists.read': 'Voir les listes liées à un rôle',
      'roles.permissionlists.update': 'Modifier les listes d’un rôle',

    };
    return featureLabels[feature] || feature;
  }
}
