import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignRoleModalComponent } from './assign-role-modal.component';

describe('AssignRoleModalComponent', () => {
  let component: AssignRoleModalComponent;
  let fixture: ComponentFixture<AssignRoleModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignRoleModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignRoleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
