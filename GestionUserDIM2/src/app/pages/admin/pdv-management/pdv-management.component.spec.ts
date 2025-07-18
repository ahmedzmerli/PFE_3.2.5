import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdvManagementComponent } from './pdv-management.component';

describe('PdvManagementComponent', () => {
  let component: PdvManagementComponent;
  let fixture: ComponentFixture<PdvManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PdvManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PdvManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
