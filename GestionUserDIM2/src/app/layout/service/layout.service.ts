import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

export interface LayoutConfig {
  preset?: string;
  primary?: string;
  surface?: string | null;
  darkTheme?: boolean;
  menuMode?: string;
}

export interface LayoutState {
  staticMenuDesktopInactive?: boolean;
  overlayMenuActive?: boolean;
  configSidebarVisible?: boolean;
  staticMenuMobileActive?: boolean;
  menuHoverActive?: boolean;
}

interface MenuChangeEvent {
  key: string;
  routeEvent?: boolean;
}

@Injectable({ providedIn: 'root' })
export class LayoutService {
  private _config: LayoutConfig = {
    preset: 'Aura',
    primary: 'emerald',
    surface: null,
    darkTheme: false,
    menuMode: 'static'
  };

  private _state: LayoutState = {
    staticMenuDesktopInactive: false,
    overlayMenuActive: false,
    configSidebarVisible: false,
    staticMenuMobileActive: false,
    menuHoverActive: false
  };

  configSubject = new BehaviorSubject<LayoutConfig>(this._config);
  stateSubject = new BehaviorSubject<LayoutState>(this._state);
  private configUpdate = new Subject<LayoutConfig>();
  private overlayOpen = new Subject<any>();
  private menuSource = new Subject<MenuChangeEvent>();
  private resetSource = new Subject<boolean>();

  // Public observables
  config$ = this.configSubject.asObservable();
  state$ = this.stateSubject.asObservable();
  configUpdate$ = this.configUpdate.asObservable();
  overlayOpen$ = this.overlayOpen.asObservable();
  menuSource$ = this.menuSource.asObservable();
  resetSource$ = this.resetSource.asObservable();

  constructor() {
    // Apply dark theme on config init/update
    this.config$.pipe(distinctUntilChanged()).subscribe(config => {
      this.toggleDarkMode(config);
    });
  }

  // 🔄 Update config and emit changes
  updateConfig(config: Partial<LayoutConfig>) {
    const updated = { ...this.configSubject.value, ...config };
    this.configSubject.next(updated);
    this.configUpdate.next(updated);
  }

  // 🔄 Update state and emit changes
  updateState(state: Partial<LayoutState>) {
    const updated = { ...this.stateSubject.value, ...state };
    this.stateSubject.next(updated);
  }

  // 👁️ Getters (example computed-like)
  isDarkTheme$(): Observable<boolean> {
    return this.config$.pipe(map(cfg => !!cfg.darkTheme));
  }

  isSidebarActive$(): Observable<boolean> {
    return this.state$.pipe(
      map(state => !!(state.overlayMenuActive || state.staticMenuMobileActive))
    );
  }

  getPrimary$(): Observable<string | undefined> {
    return this.config$.pipe(map(cfg => cfg.primary));
  }

  getSurface$(): Observable<string | null | undefined> {
    return this.config$.pipe(map(cfg => cfg.surface));
  }

  isOverlay$(): Observable<boolean> {
    return this.config$.pipe(map(cfg => cfg.menuMode === 'overlay'));
  }

  // 🌓 Toggle theme mode
  toggleDarkMode(config: LayoutConfig) {
    if (config.darkTheme) {
      document.documentElement.classList.add('app-dark');
    } else {
      document.documentElement.classList.remove('app-dark');
    }
  }

  // 📱📟 Toggle menu state
  onMenuToggle() {
    const isOverlay = this.configSubject.value.menuMode === 'overlay';
    const currentState = this.stateSubject.value;

    if (isOverlay) {
      const newOverlay = !currentState.overlayMenuActive;
      this.updateState({ overlayMenuActive: newOverlay });
      if (newOverlay) this.overlayOpen.next(null);
    }

    if (this.isDesktop()) {
      const newDesktop = !currentState.staticMenuDesktopInactive;
      this.updateState({ staticMenuDesktopInactive: newDesktop });
    } else {
      const newMobile = !currentState.staticMenuMobileActive;
      this.updateState({ staticMenuMobileActive: newMobile });
      if (newMobile) this.overlayOpen.next(null);
    }
  }

  // 📱 Detect device
  isDesktop() {
    return window.innerWidth > 991;
  }

  isMobile() {
    return !this.isDesktop();
  }

  // 📡 Emit events
  onMenuStateChange(event: MenuChangeEvent) {
    this.menuSource.next(event);
  }

  reset() {
    this.resetSource.next(true);
  }

  get layoutConfigValue(): LayoutConfig {
    return this.configSubject.value;
  }
}
