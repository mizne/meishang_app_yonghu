import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentListPage } from './comment-list.page';

describe('CommentListPage', () => {
  let component: CommentListPage;
  let fixture: ComponentFixture<CommentListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommentListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
