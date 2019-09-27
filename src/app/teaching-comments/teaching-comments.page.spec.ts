import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeachingCommentsPage } from './teaching-comments.page';

describe('TeachingCommentsPage', () => {
  let component: TeachingCommentsPage;
  let fixture: ComponentFixture<TeachingCommentsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeachingCommentsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeachingCommentsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
