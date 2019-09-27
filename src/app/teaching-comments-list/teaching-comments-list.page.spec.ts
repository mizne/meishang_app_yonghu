import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeachingCommentsListPage } from './teaching-comments-list.page';

describe('TeachingCommentsListPage', () => {
  let component: TeachingCommentsListPage;
  let fixture: ComponentFixture<TeachingCommentsListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeachingCommentsListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeachingCommentsListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
