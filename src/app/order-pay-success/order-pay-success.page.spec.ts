import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPaySuccessPage } from './order-pay-success.page';

describe('OrderPaySuccessPage', () => {
  let component: OrderPaySuccessPage;
  let fixture: ComponentFixture<OrderPaySuccessPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderPaySuccessPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderPaySuccessPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
