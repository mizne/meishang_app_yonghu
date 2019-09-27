import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfectingUserInforPage } from './perfecting-user-infor.page';

describe('PerfectingUserInforPage', () => {
  let component: PerfectingUserInforPage;
  let fixture: ComponentFixture<PerfectingUserInforPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerfectingUserInforPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerfectingUserInforPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
