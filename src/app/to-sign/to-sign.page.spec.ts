import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToSignPage } from './to-sign.page';

describe('ToSignPage', () => {
  let component: ToSignPage;
  let fixture: ComponentFixture<ToSignPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToSignPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToSignPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
