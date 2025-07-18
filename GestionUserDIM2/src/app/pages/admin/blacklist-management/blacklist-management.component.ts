import { Component, OnInit } from '@angular/core';
import { BlacklistService } from 'src/app/services/blacklist.service';
import { Blacklist } from 'src/app/models/blacklist.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-blacklist-management',
  templateUrl: './blacklist-management.component.html',
  styleUrls: ['./blacklist-management.component.scss']
})
export class BlacklistManagementComponent implements OnInit {
  blacklist: Blacklist[] = [];
  filtered: Blacklist[] = [];

  searchMsisdn: string = '';
  selectedStatus = '';
  selectedTypeClient = '';
  selectedMotif = '';

  sortField: 'dureeBlacklist' | 'dateAction' | '' = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  statusOptions = [
    { label: 'BLACKLISTED', value: 'BLACKLISTED' },
    { label: 'WHITELISTED', value: 'WHITELISTED' }
  ];
  typeClientOptions: any[] = [];
  motifOptions: any[] = [];

  cols = [
    { field: 'msisdn', header: 'MSISDN' },
    { field: 'segment', header: 'Segment' },
    { field: 'dateDebut', header: 'Début' },
    { field: 'dateFin', header: 'Fin' },
    { field: 'motif', header: 'Motif' },
    { field: 'offre', header: 'Offre' },
    { field: 'statut', header: 'Statut' },
    { field: 'username', header: 'Utilisateur' },
    { field: 'typeClient', header: 'Type Client' },
    { field: 'dureeBlacklist', header: 'Durée' },
    { field: 'dateAction', header: 'Date action' },
  ];
  selectedColumns = [...this.cols]; // afficher toutes les colonnes au départ



  resetColumns(): void {
    this.selectedColumns = [...this.cols];
  }


  getColumnIcon(field: string): string {
    const icons: any = {
      msisdn: 'pi pi-phone',
      segment: 'pi pi-sitemap',
      dateDebut: 'pi pi-calendar-plus',
      dateFin: 'pi pi-calendar-minus',
      motif: 'pi pi-info-circle',
      offre: 'pi pi-gift',
      statut: 'pi pi-flag',
      username: 'pi pi-user',
      typeClient: 'pi pi-users',
      dureeBlacklist: 'pi pi-clock',
      dateAction: 'pi pi-history'
    };
    return icons[field] || '';
  }

  formatColumnData(b: any, field: string): any {
    if (field === 'statut') {
      return b[field];
    }
    if (field === 'dateDebut' || field === 'dateFin') {
      return b[field] ? new Date(b[field]).toLocaleDateString() : '';
    }
    if (field === 'dateAction') {
      return b[field] ? new Date(b[field]).toLocaleString() : '';
    }
    return b[field];
  }




  constructor(private blacklistService: BlacklistService) {}

  ngOnInit(): void {
    this.loadBlacklist();
  }

  loadBlacklist(): void {
    this.blacklistService.getAll().subscribe(data => {
      this.blacklist = data;
      this.filtered = data;
      this.initDropdowns();
    });
  }

  initDropdowns(): void {
    const types = Array.from(new Set(this.blacklist.map(b => b.typeClient).filter(Boolean)));
    const motifs = Array.from(new Set(this.blacklist.map(b => b.motif).filter(Boolean)));

    this.typeClientOptions = types.map(t => ({ label: t, value: t }));
    this.motifOptions = motifs.map(m => ({ label: m, value: m }));
  }

  applyFilter(): void {
    const term = this.searchMsisdn.trim().toLowerCase();

    this.filtered = this.blacklist
      .filter(b =>
        (!term || b.msisdn.toLowerCase().includes(term)) &&
        (!this.selectedStatus || b.statut === this.selectedStatus) &&
        (!this.selectedTypeClient || b.typeClient === this.selectedTypeClient) &&
        (!this.selectedMotif || b.motif === this.selectedMotif)
      );

    if (this.sortField) {
      this.filtered.sort((a: any, b: any) => {
        const valA = a[this.sortField];
        const valB = b[this.sortField];
        if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }
  }

  resetFilters(): void {
    this.searchMsisdn = '';
    this.selectedStatus = '';
    this.selectedTypeClient = '';
    this.selectedMotif = '';
    this.sortField = '';
    this.sortDirection = 'asc';
    this.applyFilter();
  }

  sortBy(field: 'dureeBlacklist' | 'dateAction') {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.applyFilter();
  }

  toggle(id: number): void {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Cette action va changer le statut de cet utilisateur.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Oui, continuer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.blacklistService.toggle(id).subscribe(() => {
          this.loadBlacklist();
          Swal.fire({
            title: 'Succès',
            text: 'Le statut a été mis à jour.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
        });
      }
    });
  }
}
