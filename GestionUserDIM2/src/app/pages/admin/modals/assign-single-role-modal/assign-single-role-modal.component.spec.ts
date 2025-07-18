import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignSingleRoleModalComponent } from './assign-single-role-modal.component';

describe('AssignSingleRoleModalComponent', () => {
  let component: AssignSingleRoleModalComponent;
  let fixture: ComponentFixture<AssignSingleRoleModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignSingleRoleModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignSingleRoleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
