import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginByPhonePage } from './login-by-phone.page';

describe('LoginByPhonePage', () => {
  let component: LoginByPhonePage;
  let fixture: ComponentFixture<LoginByPhonePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginByPhonePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginByPhonePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
