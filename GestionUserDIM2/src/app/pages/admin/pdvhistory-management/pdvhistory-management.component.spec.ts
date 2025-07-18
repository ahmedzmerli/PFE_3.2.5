import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdvhistoryManagementComponent } from './pdvhistory-management.component';

describe('PdvhistoryManagementComponent', () => {
  let component: PdvhistoryManagementComponent;
  let fixture: ComponentFixture<PdvhistoryManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PdvhistoryManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PdvhistoryManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
