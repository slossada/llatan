import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarStaffComponent } from './asignar-staff.component';

describe('AsignarStaffComponent', () => {
  let component: AsignarStaffComponent;
  let fixture: ComponentFixture<AsignarStaffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsignarStaffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignarStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
