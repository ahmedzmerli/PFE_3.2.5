import {Component, EventEmitter, Input, Output} from '@angular/core';
import { Permission } from 'src/app/models/permission.model';

@Component({
  selector: 'app-permission-list-details-modal',
  templateUrl: './permission-list-details-modal.component.html'
})
export class PermissionListDetailsModalComponent {
  @Input() visible: boolean = false;
  @Input() permissions: Permission[] = [];
  @Output() visibleChange = new EventEmitter<boolean>();

  getPermissionLabel(permission: Permission): string {
    return `${permission.feature}.${permission.action}`;
  }
  close() {
    this.visible = false;
    this.visibleChange.emit(false); // ← mise à jour parent
  }

  groupedPermissions: { feature: string, permissions: Permission[] }[] = [];

  ngOnChanges(): void {
    if (this.permissions) {
      const groups: Record<string, Permission[]> = {};

      for (const perm of this.permissions) {
        if (!groups[perm.feature]) {
          groups[perm.feature] = [];
        }
        groups[perm.feature].push(perm);
      }

      this.groupedPermissions = Object.entries(groups).map(([feature, permissions]) => ({
        feature,
        permissions
      }));
    }
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

  getFriendlyLabel(permission: Permission): string {
    const key = `${permission.feature}.${permission.action}`;
    return this.friendlyLabels[key] || key;
  }

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
      'roles.permissionlists.update': 'Modifier les listes d’un rôle'
    };

    return featureLabels[feature] || feature;
  }


}
