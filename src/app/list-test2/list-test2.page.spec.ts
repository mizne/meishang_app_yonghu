import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTest2Page } from './list-test2.page';

describe('ListTest2Page', () => {
  let component: ListTest2Page;
  let fixture: ComponentFixture<ListTest2Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListTest2Page ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTest2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
