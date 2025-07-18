import { Component, OnInit } from '@angular/core';
import { PdvService } from "../../../services/pdv.service";
import { PdvMaster } from "../../../models/pdvmaster.model";
import Swal from 'sweetalert2';
import * as L from 'leaflet';

@Component({
  selector: 'app-pdv-management',
  templateUrl: './pdv-management.component.html',
  styleUrls: ['./pdv-management.component.scss']
})
export class PdvManagementComponent implements OnInit {
  cols = [
    { field: 'msisdn', header: 'MSISDN' },
    { field: 'nomPdv', header: 'Nom PDV' },
    { field: 'adresse', header: 'Adresse' },
    { field: 'codePdv', header: 'Code PDV' },
    { field: 'Action', header: 'Action' }
  ];
  selectedColumns = [...this.cols];
  pdvs: PdvMaster[] = [];
  filteredResults: PdvMaster[] = [];
  msisdn: string = '';

  selectedPdv: any;
  map: any;
  showMap: boolean = false;
  miniMap: any;
  miniMapInteractive = false;

  // Modal ajout
  displayAddModal = false;
  addPdvForm: Partial<PdvMaster> = {
    msisdn: '',
    nomPdv: '',
    adresse: '',
    codePdv: '',
    latitude: undefined,
    longitude: undefined
  };

  constructor(private pdvService: PdvService) {}

  ngOnInit() {
    this.fetchPdvs();
  }

  fetchPdvs() {
    this.pdvService.getAll().subscribe(data => {
      this.pdvs = data;
      this.filteredResults = data;
    });
  }

  applyFilter() {
    this.filteredResults = this.pdvs.filter(pdv => {
      let valid = true;
      if (this.msisdn && !pdv.msisdn.includes(this.msisdn)) valid = false;
      return valid;
    });
  }

  resetFilters() {
    this.msisdn = '';
    this.filteredResults = [...this.pdvs];
  }

  resetColumns() {
    this.selectedColumns = [...this.cols];
  }

  openAddModal() {
    this.addPdvForm = {
      msisdn: '',
      nomPdv: '',
      adresse: '',
      codePdv: '',
      latitude: undefined,
      longitude: undefined
    };
    this.displayAddModal = true;
    setTimeout(() => this.updateMiniMap(), 600);
  }

  closeAddModal() {
    this.displayAddModal = false;
  }

  addPdv() {
    if (!this.addPdvForm.msisdn || !this.addPdvForm.nomPdv ||
      this.addPdvForm.latitude == null || this.addPdvForm.longitude == null) {
      Swal.fire('Champs obligatoires', 'Veuillez remplir MSISDN, Nom, Latitude et Longitude', 'warning');
      return;
    }

    this.pdvService.create(this.addPdvForm as PdvMaster).subscribe({
      next: () => {
        this.fetchPdvs();
        Swal.fire('Succès', 'PDV ajouté', 'success');
        this.closeAddModal();
      },
      error: err => {
        Swal.fire('Erreur', 'Échec de l\'ajout', 'error');
      }
    });
  }

  deletePdv(msisdn: string) {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Ce PDV sera supprimé définitivement.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.pdvService.delete(msisdn).subscribe({
          next: () => {
            this.fetchPdvs();
            Swal.fire('Supprimé', 'Le PDV a été supprimé.', 'success');
          },
          error: err => {
            Swal.fire('Erreur', 'Suppression impossible', 'error');
          }
        });
      }
    });
  }

  toggleMap() {
    this.showMap = !this.showMap;
    if (this.showMap) {
      setTimeout(() => this.initMap(), 100);
    }
  }

  initMap() {
    if (this.map) {
      this.map.remove();
    }

    this.map = L.map('map', {
      zoomControl: true,
      scrollWheelZoom: false,
      touchZoom: false
    }).setView([36.8065, 10.1815], 7);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.filteredResults.forEach(pdv => {
      if (pdv.latitude != null && pdv.longitude != null) {
        const marker = L.marker([pdv.latitude, pdv.longitude], {
          icon: L.icon({
            iconUrl: 'assets/img/cible-de-localisation.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41]
          })
        }).addTo(this.map);

        marker.on('click', () => {
          this.selectedPdv = pdv;
          this.map.setView([pdv.latitude!, pdv.longitude!], 13);
        });
      }
    });
  }

  updateMiniMap(): void {
    const lat = this.addPdvForm.latitude;
    const lng = this.addPdvForm.longitude;

    if (lat != null && lng != null) {
      if (this.miniMap) {
        this.miniMap.remove();
        this.miniMap = null;
      }

      setTimeout(() => {
        this.miniMap = L.map('mini-map', {
          zoomControl: this.miniMapInteractive,
          attributionControl: false,
          dragging: this.miniMapInteractive,
          scrollWheelZoom: this.miniMapInteractive,
          touchZoom: this.miniMapInteractive
        }).setView([lat, lng], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: ''
        }).addTo(this.miniMap);

        L.marker([lat, lng]).addTo(this.miniMap);
      }, 100);
    }
  }
}
