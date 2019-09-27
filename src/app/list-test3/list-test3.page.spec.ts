import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTest3Page } from './list-test3.page';

describe('ListTest3Page', () => {
  let component: ListTest3Page;
  let fixture: ComponentFixture<ListTest3Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListTest3Page ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTest3Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
