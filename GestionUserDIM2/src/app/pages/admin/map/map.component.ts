import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  map: any;
  selectedPdv: any;
  pdvs: any[] = [];
  showMap = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadPdvs();
  }

  toggleMap(): void {
    this.showMap = !this.showMap;
    if (this.showMap) {
      setTimeout(() => this.initMap(), 100); // Attendre que le DOM soit prêt
    }
  }

  initMap(): void {
    if (this.map) {
      this.map.remove(); // éviter doublons
    }

    this.map = L.map('map', {
      zoomControl: true,
      scrollWheelZoom: false, // désactiver le zoom avec la souris ou pinch
      touchZoom: false // désactiver le pinch-to-zoom mobile
    }).setView([36.8065, 10.1815], 7);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.pdvs.forEach(pdv => {
      const marker = L.marker([pdv.latitude, pdv.longitude], {
        icon: L.icon({
          iconUrl: 'assets/img/epingle_rouge.jpg',
          iconSize: [25, 41],
          iconAnchor: [12, 41]
        })
      }).addTo(this.map);

      marker.on('click', () => {
        this.selectedPdv = pdv;
        this.map.setView([pdv.latitude, pdv.longitude], 13);
      });
    });
  }

  loadPdvs(): void {
    this.http.get<any[]>('http://localhost:8081/api/v1/pdv').subscribe(data => {
      this.pdvs = data;
    });
  }
}
