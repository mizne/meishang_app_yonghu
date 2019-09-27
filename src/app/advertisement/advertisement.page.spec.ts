import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvertisementPage } from './advertisement.page';

describe('AdvertisementPage', () => {
  let component: AdvertisementPage;
  let fixture: ComponentFixture<AdvertisementPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvertisementPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvertisementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
