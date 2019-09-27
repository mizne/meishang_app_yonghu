import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpAndCustomerServicePage } from './help-and-customer-service.page';

describe('HelpAndCustomerServicePage', () => {
  let component: HelpAndCustomerServicePage;
  let fixture: ComponentFixture<HelpAndCustomerServicePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpAndCustomerServicePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpAndCustomerServicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
