import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlacklistManagementComponent } from './blacklist-management.component';

describe('BlacklistManagementComponent', () => {
  let component: BlacklistManagementComponent;
  let fixture: ComponentFixture<BlacklistManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlacklistManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlacklistManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
