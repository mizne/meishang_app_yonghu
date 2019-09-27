import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToSetPersonalInfoPage } from './to-set-personal-info.page';

describe('ToSetPersonalInfoPage', () => {
  let component: ToSetPersonalInfoPage;
  let fixture: ComponentFixture<ToSetPersonalInfoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToSetPersonalInfoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToSetPersonalInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
