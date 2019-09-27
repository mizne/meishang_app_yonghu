import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderCourierPage } from './order-courier.page';

describe('OrderCourierPage', () => {
  let component: OrderCourierPage;
  let fixture: ComponentFixture<OrderCourierPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderCourierPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderCourierPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
