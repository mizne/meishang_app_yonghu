import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettleAccountsCreateOrderPage } from './settle-accounts-create-order.page';

describe('SettleAccountsCreateOrderPage', () => {
  let component: SettleAccountsCreateOrderPage;
  let fixture: ComponentFixture<SettleAccountsCreateOrderPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettleAccountsCreateOrderPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettleAccountsCreateOrderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
