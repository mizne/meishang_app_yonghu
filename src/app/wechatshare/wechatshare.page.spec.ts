import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WechatsharePage } from './wechatshare.page';

describe('WechatsharePage', () => {
  let component: WechatsharePage;
  let fixture: ComponentFixture<WechatsharePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WechatsharePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WechatsharePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
