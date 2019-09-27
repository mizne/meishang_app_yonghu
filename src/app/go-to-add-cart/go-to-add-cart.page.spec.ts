import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoToAddCartPage } from './go-to-add-cart.page';

describe('GoToAddCartPage', () => {
  let component: GoToAddCartPage;
  let fixture: ComponentFixture<GoToAddCartPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoToAddCartPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoToAddCartPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
