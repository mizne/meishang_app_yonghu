import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTest1Page } from './list-test1.page';

describe('ListTest1Page', () => {
  let component: ListTest1Page;
  let fixture: ComponentFixture<ListTest1Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListTest1Page ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTest1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
