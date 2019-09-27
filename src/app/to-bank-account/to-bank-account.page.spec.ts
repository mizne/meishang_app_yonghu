import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToBankAccountPage } from './to-bank-account.page';

describe('ToBankAccountPage', () => {
  let component: ToBankAccountPage;
  let fixture: ComponentFixture<ToBankAccountPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToBankAccountPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToBankAccountPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
