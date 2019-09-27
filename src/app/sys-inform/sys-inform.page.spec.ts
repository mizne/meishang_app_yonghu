import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SysInformPage } from './sys-inform.page';

describe('SysInformPage', () => {
  let component: SysInformPage;
  let fixture: ComponentFixture<SysInformPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SysInformPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SysInformPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
