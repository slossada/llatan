import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarDirectoresComponent } from './asignar-directores.component';

describe('AsignarDirectoresComponent', () => {
  let component: AsignarDirectoresComponent;
  let fixture: ComponentFixture<AsignarDirectoresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsignarDirectoresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignarDirectoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
