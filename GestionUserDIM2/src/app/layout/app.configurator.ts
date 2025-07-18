import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { SelectButtonModule } from 'primeng/selectbutton';
import { LayoutService } from './service/layout.service';
import { updatePreset, updateSurfacePalette } from '@primeng/themes';

import Aura from '@primeng/themes/aura';
import Lara from '@primeng/themes/lara';
import Nora from '@primeng/themes/nora';

const themePresets = {
  Aura,
  Lara,
  Nora
};

@Component({
  selector: 'app-configurator',
  standalone: true,
  imports: [CommonModule, FormsModule, SelectButtonModule],
  templateUrl: './app.configurator.html'
})
export class AppConfigurator implements OnInit {
  router = inject(Router);
  platformId = inject(PLATFORM_ID);
  layoutService = inject(LayoutService);

  surfaces = ['slate', 'gray', 'zinc', 'neutral', 'stone', 'soho', 'viva', 'ocean'];
  presets = Object.keys(themePresets);
  menuModeOptions = [
    { label: 'Static', value: 'static' },
    { label: 'Overlay', value: 'overlay' }
  ];

  selectedPreset: string = 'Aura';
  selectedSurface: string | null = null;
  selectedMenuMode: string = 'static';

  ngOnInit() {
    this.layoutService.config$.subscribe(config => {
      this.selectedPreset = config.preset || 'Aura';
      this.selectedSurface = config.surface || null;
      this.selectedMenuMode = config.menuMode || 'static';
    });

    // Apply preset theme if running in browser
    if (isPlatformBrowser(this.platformId)) {
      const presetTheme = themePresets[this.selectedPreset as keyof typeof themePresets];
      if (presetTheme) {
        updatePreset(presetTheme);
      }
    }
  }

  onPresetChange(preset: string) {
    this.layoutService.updateConfig({ preset });
    const presetTheme = themePresets[preset as keyof typeof themePresets];
    if (presetTheme) {
      updatePreset(presetTheme);
    }
  }

  onSurfaceChange(surface: string) {
    this.layoutService.updateConfig({ surface });
    updateSurfacePalette(surface);
  }

  onMenuModeChange(mode: string) {
    this.layoutService.updateConfig({ menuMode: mode });
  }
}
