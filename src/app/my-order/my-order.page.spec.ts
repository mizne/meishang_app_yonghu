import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyOrderPage } from './my-order.page';

describe('MyOrderPage', () => {
  let component: MyOrderPage;
  let fixture: ComponentFixture<MyOrderPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyOrderPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyOrderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
