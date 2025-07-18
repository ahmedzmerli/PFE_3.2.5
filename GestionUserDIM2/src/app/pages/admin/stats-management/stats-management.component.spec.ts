import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsManagementComponent } from './stats-management.component';

describe('StatsManagementComponent', () => {
  let component: StatsManagementComponent;
  let fixture: ComponentFixture<StatsManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatsManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatsManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
