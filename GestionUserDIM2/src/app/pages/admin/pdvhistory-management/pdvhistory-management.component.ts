import { Component, OnInit } from '@angular/core';
import {PdvService} from "../../../services/pdv.service";
import { PdvHistory } from 'src/app/models/pdvhistory.model';

@Component({
  selector: 'app-pdvhistory-management',
  templateUrl: './pdvhistory-management.component.html',
  styleUrls: ['./pdvhistory-management.component.scss']
})
export class PdvhistoryManagementComponent implements OnInit {
  cols = [
    { field: 'msisdn', header: 'MSISDN' },
    { field: 'nomPdv', header: 'Nom PDV' },
    { field: 'adresse', header: 'Adresse' },
    { field: 'codePdv', header: 'Code PDV' },
    { field: 'username', header: 'Utilisateur' },
    { field: 'actionType', header: 'Action' },
    { field: 'dateAction', header: 'Date action' }
  ];
  selectedColumns = [...this.cols];

  histories: PdvHistory[] = [];
  filteredResults: PdvHistory[] = [];
  msisdn: string = '';

  constructor(private pdvHistoryService: PdvService) {}

  ngOnInit() {
    this.loadHistory();
  }

  loadHistory() {
    this.pdvHistoryService.getHistory().subscribe(data => {
      this.histories = data;
      this.filteredResults = data;
    });
  }

  resetColumns() {
    this.selectedColumns = [...this.cols];
  }

  applyFilter() {
    const search = this.msisdn.trim();
    if (!search) {
      this.filteredResults = [...this.histories];
      return;
    }
    this.filteredResults = this.histories.filter(h =>
      h.msisdn && h.msisdn.includes(search)
    );
  }
}
