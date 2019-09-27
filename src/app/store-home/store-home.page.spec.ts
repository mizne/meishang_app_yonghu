import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreHomePage } from './store-home.page';

describe('StoreHomePage', () => {
  let component: StoreHomePage;
  let fixture: ComponentFixture<StoreHomePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreHomePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreHomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
