import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CartListPage } from './cart-list.page';

describe('CartListPage', () => {
  let component: CartListPage;
  let fixture: ComponentFixture<CartListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CartListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CartListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
