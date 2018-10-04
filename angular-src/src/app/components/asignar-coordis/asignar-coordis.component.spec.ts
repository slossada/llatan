import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarCoordisComponent } from './asignar-coordis.component';

describe('AsignarCoordisComponent', () => {
  let component: AsignarCoordisComponent;
  let fixture: ComponentFixture<AsignarCoordisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsignarCoordisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignarCoordisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
