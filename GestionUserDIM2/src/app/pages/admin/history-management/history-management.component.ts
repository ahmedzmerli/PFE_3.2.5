import { Component } from '@angular/core';
import {BlHistory} from "../../../models/history.model";
import {HistoryService} from "../../../services/history.service";

@Component({
  selector: 'app-history-management',
  templateUrl: './history-management.component.html',
  styleUrls: ['./history-management.component.scss']
})
export class HistoryManagementComponentComponent {
  msisdn: string = '';
  startDate?: Date;
  endDate?: Date;
  results: BlHistory[] = [];
  loading = false;
  selectedStatus:string='';
  selectedTypeClient:string='';
  selectedMotif:string='';
  dateError = false;

  constructor(private historyService: HistoryService) {}

  search() {
    this.dateError = false;

    // 🛑 Validation : startDate < endDate (si les deux sont renseignées)
    if (this.startDate && this.endDate && this.startDate > this.endDate) {
      this.dateError = true;
      return;
    }

    if (!this.msisdn) return;

    this.loading = true;
    this.historyService.searchHistory(this.msisdn, this.startDate, this.endDate).subscribe({
      next: (data) => {
        console.log('Résultat API:', data);
        this.results = data;
        this.applyFilter();
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      },
    });
  }


  cols = [
    { field: 'msisdn', header: 'MSISDN' },
    { field: 'username', header: 'Utilisateur' },
    { field: 'motif', header: 'Motif' },
    { field: 'statut', header: 'Statut' },
    { field: 'offre', header: 'Offre' },
    { field: 'segment', header: 'Segment' },
    { field: 'typeClient', header: 'Type Client' },
    { field: 'dateAction', header: 'Date Action' },
    { field: 'typeBlack', header: 'Type Black' }
  ];

  selectedColumns = [...this.cols];

  statusOptions = [
    { label: 'Tous', value: '' },
    { label: 'BLACKLISTED', value: 'BLACKLISTED' },
    { label: 'WHITELISTED', value: 'WHITELISTED' }
  ];

  typeClientOptions: any[] = []; // à remplir dynamiquement ou manuellement
  motifOptions: any[] = [];      // idem

  filteredResults: BlHistory[] = [];

  applyFilter() {
    this.filteredResults = this.results.filter(item =>
      (!this.selectedStatus || item.statut === this.selectedStatus) &&
      (!this.selectedTypeClient || item.typeClient === this.selectedTypeClient) &&
      (!this.selectedMotif || item.motif === this.selectedMotif)
    );
  }

  resetColumns() {
    this.selectedColumns = [...this.cols];
  }

  resetFilters() {
    this.selectedStatus = '';
    this.selectedTypeClient = '';
    this.selectedMotif = '';
    this.applyFilter();
  }

}
