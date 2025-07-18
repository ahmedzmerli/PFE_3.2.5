import { Component, OnInit } from '@angular/core';
import {StatsService} from "../../../services/stats.service";
import {ChartOptions} from "chart.js";


@Component({
  selector: 'app-stats-management',
  templateUrl: './stats-management.component.html',
  styleUrls: ['./stats-management.component.scss']
})
export class StatsManagementComponent implements OnInit {

  // ---- Blacklist par mois (bar) ----
  blacklistMonthLabels: string[] = [];
  blacklistMonthData: number[] = [];
  loadingBlacklist = false;

  // ---- Whitelist par mois (line) ----
  whitelistMonthLabels: string[] = [];
  whitelistMonthData: number[] = [];
  loadingWhitelist = false;

  // ---- Par segment (pie) ----
  segmentLabels: string[] = [];
  segmentData: number[] = [];
  loadingSegment = false;

  // ---- Par utilisateur (horizontal bar) ----
  userLabels: string[] = [];
  userData: number[] = [];
  loadingUser = false;

  // Message d'erreur
  errorMessage: string = '';


  pieChartData: any;
  pieChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'right'
      }
    }
  };


  constructor(private statsService: StatsService) { }

  ngOnInit(): void {
    this.loadBlacklistParMois();
    this.loadWhitelistParMois();
    this.loadBlacklistParSegment();
    this.loadBlacklistParUser();
  }

  loadBlacklistParMois() {
    this.loadingBlacklist = true;
    this.statsService.getBlacklistParMois().subscribe({
      next: (results) => {
        this.blacklistMonthLabels = results.map(r => r.mois);
        this.blacklistMonthData = results.map(r => r.count);
        this.loadingBlacklist = false;
      },
      error: () => {
        this.errorMessage = "Erreur lors du chargement des stats Blacklist.";
        this.loadingBlacklist = false;
      }
    });
  }

  loadWhitelistParMois() {
    this.loadingWhitelist = true;
    this.statsService.getWhitelistParMois().subscribe({
      next: (results) => {
        this.whitelistMonthLabels = results.map(r => r.mois);
        this.whitelistMonthData = results.map(r => r.count);
        this.loadingWhitelist = false;
      },
      error: () => {
        this.errorMessage = "Erreur lors du chargement des stats Whitelist.";
        this.loadingWhitelist = false;
      }
    });
  }

  loadBlacklistParSegment() {
    this.loadingSegment = true;
    this.statsService.getBlacklistParSegment().subscribe({
      next: (results) => {
        this.segmentLabels = results.map(r => r.segment);
        this.segmentData = results.map(r => r.count);
        // Prépare le dataset pour ng2-charts
        this.pieChartData = {
          labels: this.segmentLabels,
          datasets: [
            {
              data: this.segmentData,
              backgroundColor: [
                '#dc3545', '#ffc107', '#28a745', '#17a2b8', '#6610f2', '#6c757d', '#20c997'
              ],
              borderWidth: 1,
            }
          ]
        };
        this.loadingSegment = false;
      },
      error: () => {
        this.errorMessage = "Erreur lors du chargement des stats Segment.";
        this.loadingSegment = false;
      }
    });
  }


  loadBlacklistParUser() {
    this.loadingUser = true;
    this.statsService.getBlacklistParUser().subscribe({
      next: (results) => {
        this.userLabels = results.map(r => r.username);
        this.userData = results.map(r => r.count);
        this.loadingUser = false;
      },
      error: () => {
        this.errorMessage = "Erreur lors du chargement des stats User.";
        this.loadingUser = false;
      }
    });
  }

}
