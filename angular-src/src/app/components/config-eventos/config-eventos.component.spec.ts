import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigEventosComponent } from './config-eventos.component';

describe('ConfigEventosComponent', () => {
  let component: ConfigEventosComponent;
  let fixture: ComponentFixture<ConfigEventosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigEventosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigEventosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
