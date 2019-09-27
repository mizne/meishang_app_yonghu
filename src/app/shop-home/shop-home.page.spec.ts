import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopHomePage } from './shop-home.page';

describe('ShopHomePage', () => {
  let component: ShopHomePage;
  let fixture: ComponentFixture<ShopHomePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopHomePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopHomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
