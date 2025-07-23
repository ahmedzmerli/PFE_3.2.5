import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard.service';
import { Dashboard } from 'src/app/models/dashboard.model';

@Component({
  selector: 'app-dashboard-management',
  templateUrl: './dashboard-management.component.html',
  styleUrls: ['./dashboard-management.component.scss']
})
export class DashboardManagementComponent implements OnInit {
  msisdn = '';
  hotline = '';
  startDate?: Date;
  endDate?: Date;
  dateError = false;
  requiredError = false;

  loading = false; // Pour loader dans la table
  loadingPopup = false; // Pour le modal de chargement

  results: Dashboard[] = [];
  filteredResults: Dashboard[] = [];

  cols = [
    { field: 'callid', header: 'CallID' },
    { field: 'hotline', header: 'Hotline' },
    { field: 'num_CLIENT', header: 'MSISDN' },
    { field: 'time_IN_QUEUE', header: 'Temps File' },
    { field: 'file_ATT', header: 'File Att' },
    { field: 'date_HEURS', header: 'Date Heure' },
    { field: 'status', header: 'Statut' },
    { field: 'segment', header: 'Segment' }
  ];

  selectedColumns = [...this.cols];

  statusOptions = [
    { label: 'Tous', value: '' },
    { label: 'appel routé répondu', value: 'appel routé répondu' },
    { label: 'appel routé et non répondu', value: 'appel routé et non répondu' },
    { label: 'IVR', value: 'IVR' }
  ];
  selectedStatus = '';

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {}

  search(): void {
    this.dateError = false;
    this.requiredError = false;

    if (!this.msisdn.trim() || !this.hotline.trim()) {
      this.requiredError = true;
      return;
    }

    if (this.startDate && this.endDate && this.startDate > this.endDate) {
      this.dateError = true;
      return;
    }

    this.loadingPopup = true; // Ouvrir modal

    this.dashboardService.searchDashboard(
      this.msisdn,
      this.hotline,
      this.startDate,
      this.endDate
    ).subscribe(data => {
      this.results = data;
      this.applyFilter();
      this.loadingPopup = false; // Fermer modal
    }, error => {
      console.error('Erreur lors de la recherche :', error);
      this.loadingPopup = false;
    });
  }

  applyFilter(): void {
    if (this.selectedStatus) {
      this.filteredResults = this.results.filter(d => d.status === this.selectedStatus);
    } else {
      this.filteredResults = [...this.results];
    }
  }

  resetFilters(): void {
    this.msisdn = '';
    this.hotline = '';
    this.startDate = undefined;
    this.endDate = undefined;
    this.selectedStatus = '';
    this.filteredResults = [];
    this.results = [];
    this.dateError = false;
    this.requiredError = false;
  }

  resetColumns(): void {
    this.selectedColumns = [...this.cols];
  }
}
