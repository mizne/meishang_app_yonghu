import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessmanPage } from './businessman.page';

describe('BusinessmanPage', () => {
  let component: BusinessmanPage;
  let fixture: ComponentFixture<BusinessmanPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessmanPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessmanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
