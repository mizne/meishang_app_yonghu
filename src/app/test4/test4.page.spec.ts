import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Test4Page } from './test4.page';

describe('Test4Page', () => {
  let component: Test4Page;
  let fixture: ComponentFixture<Test4Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Test4Page ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Test4Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
