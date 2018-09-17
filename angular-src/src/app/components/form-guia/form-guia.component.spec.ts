import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormGuiaComponent } from './form-guia.component';

describe('FormGuiaComponent', () => {
  let component: FormGuiaComponent;
  let fixture: ComponentFixture<FormGuiaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormGuiaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormGuiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
